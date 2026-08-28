"use client";

import { processSteps } from "@/lib/site-content";
import { usePage } from "./page-context";
import { ArrowRight } from "lucide-react";

export function ProcessSection() {
  const { setPage } = usePage();

  return (
    <section className="bg-background py-24 sm:py-32 border-t border-border">
      <div className="editorial">
        {/* Header */}
        <div data-reveal className="mb-16 flex items-center gap-4">
          <span className="h-px w-12 bg-primary" />
          <p className="kicker text-primary">How We Work</p>
        </div>

        <div className="mb-20 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <h2
            data-reveal
            className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-primary sm:text-6xl lg:text-7xl"
          >
            From first call
            <br />
            to <span className="text-accent">long-term</span>
            <br />
            partnership.
          </h2>
          <p
            data-reveal
            className="serif-italic max-w-md text-lg leading-relaxed text-foreground/70 sm:text-xl"
          >
            A clear, five-step engagement model. You always know what&apos;s
            happening, what&apos;s next, and what you&apos;re paying for.
          </p>
        </div>

        {/* Process steps — vertical timeline */}
        <ol className="relative border-l border-border">
          {processSteps.map((step, idx) => (
            <li
              key={step.number}
              data-reveal
              className="group relative mb-12 pl-10 last:mb-0 sm:pl-14"
              style={{
                transitionDelay: `${idx * 80}ms`,
              }}
            >
              {/* Number node on the timeline */}
              <span className="absolute left-0 top-0 flex h-10 w-10 -translate-x-1/2 items-center justify-center bg-primary font-display text-sm font-bold text-white sm:h-12 sm:w-12 sm:text-base">
                {step.number}
              </span>

              <div className="pt-1">
                <h3 className="font-display text-2xl font-bold text-primary sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/70 sm:text-lg">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* CTA */}
        <div data-reveal className="mt-16 flex justify-center">
          <button onClick={() => setPage("contact")} className="btn-solid group">
            Start a Project
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
