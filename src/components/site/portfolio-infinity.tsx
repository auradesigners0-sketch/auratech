"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { usePage } from "./page-context";
import type { PublicProject } from "@/app/api/projects/route";

/**
 * PortfolioInfinity — homepage portfolio section.
 *
 * Shows the 3 projects the admin has flagged as `featured: true`.
 * If fewer than 3 are featured, only those are shown.
 * If more than 3 are featured, the first 3 by `order` are shown.
 *
 * All cards use the same tall aspect ratio so the hover description
 * never gets clipped.
 */
export function PortfolioInfinity() {
  const { setPage, openCaseStudy } = usePage();
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the 3 most recent published projects.
  // Admin controls which 3 appear via the "Display order" field —
  // lower numbers appear first. New projects auto-appear on the
  // homepage (no need to tick "Show on homepage" anymore).
  useEffect(() => {
    fetch("/api/projects?limit=3")
      .then((r) => r.json())
      .then((data) => setProjects(data.projects ?? []))
      .catch((e) => console.error("Portfolio load failed:", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="portfolio"
      className="relative bg-background py-24 sm:py-32 lg:py-40"
    >
      {/* Decorative oversized index */}
      <div
        className="pointer-events-none absolute -left-8 top-16 hidden select-none font-display text-[16rem] font-extrabold leading-none text-primary/[0.05] xl:block lg:top-24"
        aria-hidden="true"
      >
        03
      </div>

      <div className="editorial relative z-10">
        {/* Header */}
        <div data-reveal className="mb-16 flex items-center gap-4">
          <span className="h-px w-12 bg-primary" />
          <p className="kicker text-primary">Portfolio</p>
        </div>

        <div data-reveal className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <h2 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            See our featured
            <br />
            projects.
          </h2>
          <p className="serif-italic max-w-md text-lg leading-relaxed text-foreground/70 sm:text-xl">
            A selection of products we&apos;ve shipped across healthcare,
            finance, agriculture, logistics, retail and beyond — engineered
            to perform at scale.
          </p>
        </div>

        {/* Uniform 3-card grid — all cards same tall aspect ratio so
            the hover description never gets clipped. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {loading ? (
            <>
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </>
          ) : projects.length === 0 ? (
            <p className="col-span-full text-sm text-foreground/50">
              No featured projects yet. Mark projects as Featured in the admin
              to show them here.
            </p>
          ) : (
            projects.map((item, idx) => (
              <PortfolioCard
                key={item.id}
                item={item}
                index={idx + 1}
                onClick={() => openCaseStudy(item.slug)}
                staggerDelay={idx * 90}
              />
            ))
          )}
        </div>

        {/* Ghost CTA — always links to /projects (full portfolio) */}
        <div className="mt-16 flex justify-center">
          <a href="/projects" className="btn-ghost-dark group">
            View All Projects
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function PortfolioCard({
  item,
  index,
  onClick,
  staggerDelay = 0,
}: {
  item: PublicProject;
  index: number;
  onClick: () => void;
  staggerDelay?: number;
}) {
  return (
    <article
      data-reveal="scale-up"
      onClick={onClick}
      style={{ transitionDelay: `${staggerDelay}ms` }}
      // aspect-[4/5] = tall card → enough vertical room for the full
      // hover description (title + tag + 3-line description + "View Case Study" link).
      className="group relative aspect-[4/5] cursor-pointer overflow-hidden bg-[#1B4332] lift-on-hover"
    >
      {/* Gradient background per item */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${item.accent}`}
        aria-hidden="true"
      />

      {/* Thumbnail image — shown at full opacity, no color overlay.
          The image is displayed clearly so users can see it. */}
      {item.thumbnail && (
        <img
          src={item.thumbnail}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Diagonal stripes texture — only when no thumbnail */}
      {!item.thumbnail && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0px, transparent 18px, rgba(255,255,255,0.4) 18px, rgba(255,255,255,0.4) 19px)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Subtle bottom gradient — only for text readability at the bottom.
          Keeps the image clearly visible while ensuring the title is readable. */}
      {item.thumbnail && (
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          aria-hidden="true"
        />
      )}

      {/* Oversized initial */}
      <span className="pointer-events-none absolute -bottom-6 -right-4 select-none font-display text-[10rem] font-extrabold leading-none text-white/10">
        {item.title[0]}
      </span>

      {/* Index number */}
      <span className="absolute left-5 top-5 kicker text-white/70">
        0{index}
      </span>

      {/* On hover: plain dark green overlay covers the card + white
          "View Details" button appears in the center. Clicking the
          card or the button opens the case study. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1B4332] p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-center font-display text-xl font-bold text-white sm:text-2xl">
          {item.title}
        </h3>
        <span className="mt-4 inline-flex items-center gap-1.5 bg-white px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1B4332] transition-transform group-hover:scale-105">
          View Details
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>

      {/* Default (non-hover) state — category + title at bottom */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300 group-hover:opacity-0">
        <span className="kicker text-white drop-shadow-md">{item.category}</span>
        <h3 className="mt-1 font-display text-xl font-bold text-white drop-shadow-lg sm:text-2xl">
          {item.title}
        </h3>
      </div>
    </article>
  );
}

function LoadingCard() {
  return (
    <div className="aspect-[4/5] animate-pulse bg-secondary" />
  );
}
