"use client";

import { useState, useEffect, useRef } from "react";

const VISION_TEXT =
  "To become Africa's most trusted software studio — recognised globally for engineering excellence, ethical AI, and partnerships that outlast any single project.";

const MISSION_TEXT =
  "We exist to help ambitious teams turn ideas into impact. We design, build, and scale software that is reliable, accessible, and grounded in the communities it serves — delivering measurable outcomes, not just deliverables. Every line of code, every conversation, and every partnership is in service of that goal.";

export function VisionMission() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Trigger the animations when the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#1B4332] text-white"
    >
      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-grid-green opacity-30" aria-hidden="true" />

      {/* Decorative oversized star */}
      <div
        className="pointer-events-none absolute -right-8 top-16 hidden select-none font-display text-[16rem] font-extrabold leading-none text-white/[0.04] xl:block lg:top-24"
        aria-hidden="true"
      >
        ★
      </div>

      <div className="editorial relative z-10 py-24 sm:py-32 lg:py-40">
        {/* Kicker */}
        <div
          className={`mb-12 flex items-center gap-4 transition-opacity duration-700 ${
            inView ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="h-px w-12 bg-accent" />
          <p className="kicker text-accent">Vision &amp; Mission</p>
        </div>

        {/* Vision — large editorial quote with typewriter effect */}
        <div className="mb-20 max-w-4xl">
          <p
            className={`kicker mb-6 text-white/50 transition-opacity duration-700 ${
              inView ? "opacity-100" : "opacity-0"
            }`}
          >
            Our Vision
          </p>
          <h2 className="serif-italic font-display text-3xl font-normal leading-[1.3] text-white sm:text-4xl lg:text-5xl lg:leading-[1.25]">
            <span className="opacity-50">&ldquo;</span>
            <Typewriter text={VISION_TEXT} start={inView} speed={28} />
            <span className="opacity-50">&rdquo;</span>
          </h2>
        </div>

        {/* Divider */}
        <div
          className={`mb-16 flex items-center gap-4 transition-opacity duration-700 ${
            inView ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
          aria-hidden="true"
        >
          <span className="h-px w-12 bg-white/20" />
          <span className="h-2 w-2 rotate-45 border border-white/40" />
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* Mission — 2-column editorial layout with word-by-word fade-in */}
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div
            className={`transition-all duration-700 ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <p className="kicker text-accent">Our Mission</p>
          </div>
          <div>
            <p className="text-base leading-relaxed text-white/75 sm:text-lg lg:text-xl lg:leading-relaxed">
              <WordReveal
                text={MISSION_TEXT}
                start={inView}
                baseDelay={500}
                wordDelay={35}
              />
            </p>
          </div>
        </div>

        {/* Values strip */}
        <div
          className={`mt-20 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/10 pt-12 transition-opacity duration-700 sm:grid-cols-4 ${
            inView ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "2000ms" }}
        >
          <Value value="Excellence" label="Craft over hype" />
          <Value value="Integrity" label="Honest estimates" />
          <Value value="Impact" label="Outcomes, not output" />
          <Value value="Partnership" label="In it for the long run" />
        </div>
      </div>
    </section>
  );
}

/**
 * Typewriter — types out the text character-by-character when `start` is true.
 * Shows a blinking cursor while typing.
 */
function Typewriter({
  text,
  start,
  speed = 30,
}: {
  text: string;
  start: boolean;
  speed?: number;
}) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCount(i);
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, start, speed]);

  const displayed = text.slice(0, count);

  return (
    <span>
      {displayed}
      <span
        className={`inline-block w-[2px] h-[0.8em] ml-1 align-middle ${
          done ? "animate-pulse" : ""
        }`}
        style={{ backgroundColor: done ? "rgba(255,255,255,0.6)" : "#7ED957" }}
        aria-hidden="true"
      />
    </span>
  );
}

/**
 * WordReveal — fades in each word one-by-one when `start` is true.
 */
function WordReveal({
  text,
  start,
  baseDelay = 0,
  wordDelay = 50,
}: {
  text: string;
  start: boolean;
  baseDelay?: number;
  wordDelay?: number;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block transition-opacity duration-500"
          style={{
            opacity: start ? 1 : 0,
            transitionDelay: `${baseDelay + i * wordDelay}ms`,
          }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </>
  );
}

function Value({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-lg font-bold text-accent sm:text-xl">
        {value}
      </p>
      <p className="kicker mt-1 text-white/50">{label}</p>
    </div>
  );
}
