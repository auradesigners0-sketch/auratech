"use client";

import { useState, useCallback, useEffect } from "react";
import { Quote, ArrowLeft, ArrowRight } from "lucide-react";
import type { PublicTestimonial } from "@/app/api/testimonials/route";

/**
 * TestimonialsInfinity — carousel of client testimonials.
 *
 * Fetches from /api/testimonials (admin-managed).
 * Shows the person's photo if uploaded, otherwise their initials.
 */
export function TestimonialsInfinity() {
  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => setTestimonials(data.testimonials ?? []))
      .catch((e) => console.error("Testimonials load failed:", e))
      .finally(() => setLoading(false));
  }, []);

  const total = testimonials.length;

  const go = useCallback(
    (dir: number) => setActive((p) => (p + dir + total) % total),
    [total]
  );

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => go(1), 8000);
    return () => clearInterval(id);
  }, [go, total]);

  if (loading || total === 0) {
    return (
      <section className="relative overflow-hidden bg-[#1B4332] py-24 text-white sm:py-32 lg:py-40">
        <div className="editorial relative z-10 text-center">
          <p className="text-sm text-white/50">
            {loading ? "Loading testimonials..." : "No testimonials yet."}
          </p>
        </div>
      </section>
    );
  }

  const current = testimonials[active];

  return (
    <section className="relative overflow-hidden bg-[#1B4332] py-24 text-white sm:py-32 lg:py-40">
      {/* Texture — radial dots */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.18) 0px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.14) 0px, transparent 2px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.12) 0px, transparent 2px), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.16) 0px, transparent 2px)",
          backgroundSize: "120px 120px, 90px 90px, 150px 150px, 80px 80px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="editorial relative z-10">
        {/* Header */}
        <div data-reveal className="mb-16 flex items-center gap-4">
          <span className="h-px w-12 bg-white" />
          <p className="kicker text-white/70">Testimonials</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          {/* Left — headline + controls */}
          <div data-reveal>
            <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              What they say
              <br />
              about us.
            </h2>

            <div className="mt-10 flex items-center gap-4">
              <button
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="flex h-12 w-12 items-center justify-center border border-white/30 text-white transition-all hover:bg-white hover:text-primary"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="flex h-12 w-12 items-center justify-center border border-white/30 text-white transition-all hover:bg-white hover:text-primary"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
              <span className="kicker ml-2 text-white/60">
                0{active + 1} / 0{total}
              </span>
            </div>
          </div>

          {/* Right — quote */}
          <div className="relative">
            <Quote
              data-reveal="scale-up"
              className="mb-8 h-12 w-12 text-accent"
              strokeWidth={1}
              fill="currentColor"
            />
            <blockquote
              key={active}
              data-reveal="fade-up"
              className="animate-fade-up serif-italic text-2xl font-normal leading-relaxed text-white sm:text-3xl lg:text-[2rem] lg:leading-[1.5]"
            >
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            <div data-reveal="fade-up" style={{ transitionDelay: "120ms" }} className="mt-10 flex items-center gap-4">
              {/* Photo — uploaded image or initials fallback */}
              {current.photoData ? (
                <img
                  src={current.photoData}
                  alt={current.author}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white font-display text-lg font-bold text-primary">
                  {current.author
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}
              <div>
                <p className="font-display text-base font-bold text-white">
                  {current.author}
                </p>
                <p className="kicker mt-1 text-white/60">
                  {current.role}{current.role && current.company ? " · " : ""}{current.company}
                </p>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="mt-10 flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`h-1 transition-all ${
                    idx === active
                      ? "w-10 bg-accent"
                      : "w-4 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
