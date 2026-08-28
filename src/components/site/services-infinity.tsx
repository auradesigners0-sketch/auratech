"use client";

import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/site-content";
import { usePage } from "./page-context";

export function ServicesInfinity() {
  const { setPage } = usePage();

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-background py-24 sm:py-32 lg:py-40"
    >
      {/* Subtle grid texture — light green tint on white */}
      <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden="true" />

      <div className="editorial relative z-10">
        {/* Header — asymmetric */}
        <div data-reveal className="mb-12 flex items-center gap-4">
          <span className="h-px w-12 bg-primary" />
          <p className="kicker text-primary">What We Do</p>
        </div>

        {/* Title + intro — full-width row, intro aligned right on large screens */}
        <div
          data-reveal
          className="mb-16 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20"
        >
          <h2 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-primary sm:text-6xl lg:text-7xl">
            Services
            <br />
            <span className="text-accent">crafted</span>
            <br />
            to scale.
          </h2>
          <p className="serif-italic text-lg leading-relaxed text-foreground/70 sm:text-xl lg:pb-3">
            A full-stack technology studio under one roof — from first sketch
            to enterprise rollout and 24/7 support.
          </p>
        </div>

        {/* Services grid — 1 col mobile, 2 cols tablet, 3 cols desktop.
         * White cards with green borders on a white background.
         * Clean, light, professional. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((service, idx) => (
            <ServiceCard
              key={service.title}
              index={idx + 1}
              icon={service.icon}
              title={service.title}
              description={service.description}
              onClick={() => setPage("contact")}
              staggerDelay={idx * 80}
            />
          ))}
        </div>

        {/* CTA — centered below grid */}
        <div data-reveal className="mt-14 flex justify-center">
          <button
            onClick={() => setPage("contact")}
            className="group inline-flex items-center justify-center gap-2 bg-primary px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-primary/90"
          >
            Start a Project
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  index,
  icon: Icon,
  title,
  description,
  onClick,
  staggerDelay = 0,
}: {
  index: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
  staggerDelay?: number;
}) {
  return (
    <button
      data-reveal="fade-up"
      onClick={onClick}
      style={{ transitionDelay: `${staggerDelay}ms` }}
      className="group relative flex flex-col items-start rounded-xl border border-border bg-white p-7 text-left transition-all duration-300 hover:border-primary/40 hover:shadow-md sm:p-8 lg:p-10"
    >
      {/* Top row — index + icon */}
      <div className="mb-6 flex w-full items-center justify-between">
        <span className="kicker text-foreground/40">0{index}</span>
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
          <Icon className="h-5 w-5" />
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-2xl font-bold text-primary transition-colors duration-300 group-hover:text-accent sm:text-[1.7rem]">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-foreground/60 sm:text-[0.95rem]">
        {description}
      </p>

      {/* Bottom "Start a project" link — reveals on hover */}
      <span className="mt-6 inline-flex translate-y-1 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        Start a project
        <ArrowUpRight className="h-3 w-3" />
      </span>
    </button>
  );
}
