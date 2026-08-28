"use client";

import { ArrowRight, ArrowDown, Rocket, ShieldCheck, TrendingUp, type LucideIcon } from "lucide-react";
import { usePage } from "./page-context";
import { AnimatedBackground } from "./animated-background";

/**
 * Hero — compact on desktop, full-height on mobile, with 3 selling-point
 * cards anchored at the bottom of the section (always horizontal across
 * every viewport).
 *
 * Design rules:
 *  - Mobile:  min-h-[85vh] — slightly less than full screen so users see the next section peeking.
 *  - Desktop: min-h-[72vh] — doesn't dominate the page.
 *  - Headline ALWAYS 2 lines (whitespace-nowrap on each line span).
 *  - Buttons smaller than default (.btn-solid / .btn-ghost-dark) via
 *    explicit padding + font-size overrides.
 *  - 3 selling-point cards always horizontal: 3-col grid on every viewport.
 *    On mobile the description is hidden, only icon + title shown.
 *  - Animated background: 3 drifting gradient orbs + floating dots.
 */
export function HeroInfinity() {
  const { setPage } = usePage();

  return (
    <section
      id="home"
      className="relative flex min-h-[85vh] flex-col overflow-hidden bg-background sm:min-h-[72vh]"
    >
      {/* Animated background — drifting orbs + floating dots */}
      <AnimatedBackground />

      {/* Subtle grid texture for visual interest */}
      <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden="true" />

      {/* Soft fade at bottom for smooth transition into next section */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />

      {/* === Centered hero content (kicker + headline + CTAs) === */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Kicker — anchor to what we do, not who we are */}
          <p
            data-reveal
            className="kicker mb-5 text-primary animate-fade-in"
          >
            Web · Mobile · Cloud · AI
          </p>

          {/* Headline — exactly 2 lines on every viewport. */}
          <h1
            data-reveal
            className="font-display text-2xl font-extrabold leading-[1.1] tracking-tight text-primary sm:text-4xl lg:text-5xl"
          >
            <span className="block whitespace-nowrap">We build the software</span>
            <span className="block whitespace-nowrap">that runs your business.</span>
          </h1>

          {/* Two CTAs — smaller buttons, pushed lower. */}
          <div
            data-reveal
            className="mt-12 flex flex-col items-center justify-center gap-3 sm:mt-16 sm:flex-row sm:gap-4"
          >
            <button
              onClick={() => setPage("work")}
              className="group order-2 inline-flex items-center justify-center gap-2 border border-primary/60 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary transition-all duration-300 hover:bg-primary hover:text-white sm:order-1"
            >
              See Our Work
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => setPage("contact")}
              className="group order-1 inline-flex items-center justify-center gap-2 bg-primary px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-primary/90 sm:order-2"
            >
              Start a Project
              <ArrowDown className="h-3 w-3 transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* === 3 selling-point cards anchored at the bottom ===
       * Always 3 columns (horizontal) on every viewport.
       * Mobile: icon + title only (compact). Boxes sit 15px higher than before.
       * Tablet/Desktop: icon + title + description. Smaller padding on large screens. */}
      <div
        data-reveal
        className="relative z-10 px-6 pb-6 sm:px-10 sm:pb-10 lg:pb-12"
      >
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          <SellingPoint
            icon={Rocket}
            title="Fast Delivery"
            description="Tight 2-week sprints with weekly demos. Most projects ship in 8–16 weeks."
          />
          <SellingPoint
            icon={ShieldCheck}
            title="Full Ownership"
            description="100% of code, designs, and IP transfer to you on final payment. No lock-in, ever."
          />
          <SellingPoint
            icon={TrendingUp}
            title="Built to Scale"
            description="Engineered from day one for growth — secure, monitored, and refined for years."
          />
        </div>
      </div>
    </section>
  );
}

/**
 * SellingPoint — single card with icon at top-center, title below, description
 * below title. Hidden description on mobile to keep 3 cards readable in a row.
 * Sizes reduced on large devices for a more compact, professional look.
 */
function SellingPoint({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex flex-col items-center rounded-xl border border-border bg-white p-3 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-md sm:p-4 lg:p-5">
      {/* Icon — centered, top of card. Smaller on large screens now. */}
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white sm:h-11 sm:w-11 lg:h-12 lg:w-12">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5" />
      </span>

      {/* Title */}
      <h3 className="mt-2 font-display text-[10px] font-bold leading-tight tracking-tight text-foreground sm:mt-3 sm:text-sm lg:text-base">
        {title}
      </h3>

      {/* Description — hidden on mobile (too tight in 3 cols), visible on sm+ */}
      <p className="mt-1 hidden text-[11px] leading-relaxed text-foreground/60 sm:mt-2 sm:block sm:text-xs lg:text-[13px]">
        {description}
      </p>
    </div>
  );
}
