"use client";

import { ArrowRight } from "lucide-react";
import { usePage } from "./page-context";

export function AboutInfinity() {
  const { setPage } = usePage();

  return (
    <section
      id="about"
      className="relative bg-background py-24 sm:py-32 lg:py-40"
    >
      {/* Decorative oversized index — left edge */}
      <div
        className="pointer-events-none absolute -left-8 top-16 hidden select-none font-display text-[16rem] font-extrabold leading-none text-primary/[0.05] xl:block lg:top-24"
        aria-hidden="true"
      >
        01
      </div>

      <div className="editorial">
        {/* Kicker */}
        <div data-reveal className="mb-10 flex items-center gap-4">
          <span className="h-px w-12 bg-primary" />
          <p className="kicker text-primary">About Auratech</p>
        </div>

        {/* Editorial layout — asymmetric two-column */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          {/* Left column — large headline */}
          <div data-reveal>
            <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              We build software that helps ambitious teams scale.
            </h2>
          </div>

          {/* Right column — serif body */}
          <div data-reveal className="space-y-6">
            <p className="serif-italic text-xl leading-relaxed text-foreground/80 sm:text-2xl">
              A big opportunity for your business growth in this digital era —
              Auratech partners with founders, enterprises and institutions to
              design, build and scale software that turns ambitious ideas into
              measurable outcomes.
            </p>

            <p className="text-base leading-relaxed text-foreground/70">
              From first prototype to enterprise rollout, our cross-functional
              teams immerse in your business, audit your systems and craft a
              clear technical roadmap aligned with your commercial goals. We
              code. You grow. Every line of work is engineered to perform at
              scale, monitored for resilience and refined for years to come.
            </p>

            <p className="text-base leading-relaxed text-foreground/70">
              Based in Tanzania, working remotely with clients across Africa
              and beyond — we bring the rigor of a global studio to every
              engagement, large or small.
            </p>

            {/* Ghost CTA */}
            <div className="pt-4">
              <button onClick={() => setPage("services")} className="btn-ghost-dark group">
                Our Services
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
