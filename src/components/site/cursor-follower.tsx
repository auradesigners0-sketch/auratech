"use client";

import { useEffect, useRef } from "react";

/**
 * CursorFollower — a smooth trailing ring that follows the mouse cursor.
 *
 * Two layers:
 *  - Inner dot: small (8px), follows cursor instantly
 *  - Outer ring: larger (36px), follows with spring-like lag
 *
 * Hidden on touch devices + small screens via CSS (md:block).
 * Grows + changes color when hovering interactive elements (a, button).
 *
 * Uses requestAnimationFrame + direct DOM manipulation (not React state)
 * for buttery 60fps tracking.
 */
export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId: number;
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Move the dot instantly via direct DOM manipulation
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX - 4}px`;
        dotRef.current.style.top = `${mouseY - 4}px`;
      }

      // Check if hovering an interactive element
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest("a, button, input, textarea, select, [role='button']");

      // Update ring classes directly (avoid state)
      if (ringRef.current) {
        if (isInteractive) {
          ringRef.current.style.width = "48px";
          ringRef.current.style.height = "48px";
          ringRef.current.style.borderColor = "#7ED957";
        } else {
          ringRef.current.style.width = "36px";
          ringRef.current.style.height = "36px";
          ringRef.current.style.borderColor = "rgba(27, 67, 50, 0.4)";
        }
      }

      if (dotRef.current) {
        dotRef.current.style.backgroundColor = isInteractive ? "#7ED957" : "#1B4332";
      }
    };

    // Animation loop — ring follows with spring-like easing (lerp)
    const animate = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ringRef.current) {
        const half = parseFloat(ringRef.current.style.width || "36") / 2;
        ringRef.current.style.left = `${ringX - half}px`;
        ringRef.current.style.top = `${ringY - half}px`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Inner dot — follows cursor instantly.
          Hidden on mobile/touch via md:block + coarse pointer media query. */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999] hidden h-2 w-2 rounded-full md:block"
        style={{
          left: -100,
          top: -100,
          backgroundColor: "#1B4332",
          transition: "background-color 0.2s",
        }}
        aria-hidden="true"
      />

      {/* Outer ring — follows with lag (spring effect) */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9998] hidden rounded-full border-2 md:block"
        style={{
          left: -100,
          top: -100,
          width: "36px",
          height: "36px",
          borderColor: "rgba(27, 67, 50, 0.4)",
          transition: "width 0.3s ease, height 0.3s ease, border-color 0.3s ease",
        }}
        aria-hidden="true"
      />
    </>
  );
}
