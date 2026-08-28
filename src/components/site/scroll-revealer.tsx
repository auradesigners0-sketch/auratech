"use client";

import { useEffect } from "react";
import { usePage } from "./page-context";

/**
 * Mounts once at the root. Watches for elements with [data-reveal]
 * and adds the .reveal-in class when they enter the viewport, giving
 * them a smooth fade-up entrance.
 *
 * Re-runs whenever the page changes (so newly-rendered page content
 * also gets observed).
 */
const SELECTOR = "[data-reveal]";

export function ScrollRevealer() {
  const { page } = usePage();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    // Defer to next frame so DOM is fully painted
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        el.classList.add("reveal-pending");
        observer.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [page]);

  return null;
}
