"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import type { PublicProject } from "@/app/api/projects/route";
import { SiteHeader } from "@/components/site/site-header";
import { FooterInfinity } from "@/components/site/footer-infinity";
import { ScrollRevealer } from "@/components/site/scroll-revealer";

/**
 * /projects — full portfolio page (all published projects, not capped at 6).
 */
export default function ProjectsPage() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/projects");
        const data = await r.json();
        setProjects(data.projects ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <>
      <SiteHeader />
      <ScrollRevealer />
      <main className="flex-1">
        <div className="h-24" aria-hidden="true" />

        {/* Header */}
        <section className="bg-background py-16 sm:py-20 lg:py-24">
          <div className="editorial">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.22em] text-foreground/60 transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>

            <div data-reveal className="mt-8 flex items-center gap-4">
              <span className="h-px w-12 bg-primary" />
              <p className="kicker text-primary">All Projects</p>
            </div>

            <h1
              data-reveal
              className="mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            >
              Every project
              <br />
              we&apos;ve shipped.
            </h1>

            <p
              data-reveal
              className="serif-italic mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl"
            >
              A complete portfolio of products we&apos;ve built across healthcare,
              finance, agriculture, logistics, retail and beyond.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="bg-background pb-24 sm:pb-32">
          <div className="editorial">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : projects.length === 0 ? (
              <p className="py-24 text-center text-sm text-foreground/50">
                No projects published yet.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
                {projects.map((item, idx) => (
                  <ProjectCardLarge
                    key={item.id}
                    item={item}
                    index={idx + 1}
                    staggerDelay={idx * 80}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <FooterInfinity />
    </>
  );
}

function ProjectCardLarge({
  item,
  index,
  staggerDelay = 0,
}: {
  item: PublicProject;
  index: number;
  staggerDelay?: number;
}) {
  return (
    <a
      href={`/#/case-study/${item.slug}`}
      data-reveal="scale-up"
      style={{ transitionDelay: `${staggerDelay}ms` }}
      // aspect-[4/5] = tall card, gives enough vertical room for the
      // full hover description (tag + title + 3-line description + CTA).
      // Same size for every card — no more "first card bigger" issue.
      className="group relative block aspect-[4/5] overflow-hidden bg-[#1B4332] lift-on-hover"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${item.accent}`} aria-hidden="true" />

      {/* Thumbnail image — full opacity, no color overlay, clearly visible */}
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

      {/* Subtle bottom gradient — only for text readability.
          Image stays clearly visible. */}
      {item.thumbnail && (
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          aria-hidden="true"
        />
      )}

      <span className="pointer-events-none absolute -bottom-6 -right-4 select-none font-display text-[10rem] font-extrabold leading-none text-white/10">
        {item.title[0]}
      </span>

      <span className="absolute left-5 top-5 kicker text-white/70">
        0{index}
      </span>

      {/* On hover: plain dark green overlay + white "View Details" button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1B4332] p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-center font-display text-xl font-bold text-white sm:text-2xl">
          {item.title}
        </h3>
        <span className="mt-4 inline-flex items-center gap-1.5 bg-white px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1B4332] transition-transform group-hover:scale-105">
          View Details
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>

      {/* Default (non-hover) state */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300 group-hover:opacity-0">
        <span className="kicker text-white drop-shadow-md">{item.category}</span>
        <h3 className="mt-1 font-display text-xl font-bold text-white drop-shadow-lg sm:text-2xl">
          {item.title}
        </h3>
      </div>
    </a>
  );
}
