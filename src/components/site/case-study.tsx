"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { portfolioItems } from "@/lib/site-content";
import { usePage } from "./page-context";
import type { PublicProject } from "@/app/api/projects/route";

export function CaseStudy() {
  const { caseStudySlug, setPage, openCaseStudy } = usePage();
  const [project, setProject] = useState<PublicProject | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the project from the DB (so we get previewUrl + any admin edits)
  useEffect(() => {
    if (!caseStudySlug) return;
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        const found = (data.projects ?? []).find(
          (p: PublicProject) => p.slug === caseStudySlug
        );
        // Fall back to static if not in DB
        if (!found) {
          const staticProject = portfolioItems.find(
            (p) => p.slug === caseStudySlug
          );
          if (staticProject) {
            setProject({
              id: `static-${staticProject.slug}`,
              ...staticProject,
              thumbnail: null,
              previewUrl: null,
              featured: false,
            });
          } else {
            setProject(null);
          }
        } else {
          setProject(found);
        }
      })
      .catch(() => {
        // Final fallback to static
        const staticProject = portfolioItems.find(
          (p) => p.slug === caseStudySlug
        );
        if (staticProject) {
          setProject({
            id: `static-${staticProject.slug}`,
            ...staticProject,
            thumbnail: null,
            previewUrl: null,
            featured: false,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [caseStudySlug]);

  // Find next case study (cyclic)
  const realProjects = portfolioItems.filter(
    (p) => p.challenges && p.solution && p.results
  );
  const currentIdx = realProjects.findIndex((p) => p.slug === caseStudySlug);
  const nextProject =
    realProjects[(currentIdx + 1) % realProjects.length] || realProjects[0];

  if (loading) {
    return (
      <main className="flex-1">
        <div className="h-24" aria-hidden="true" />
        <div className="editorial py-24 text-center">
          <p className="text-sm text-foreground/50">Loading…</p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex-1">
        <div className="h-24" aria-hidden="true" />
        <div className="editorial py-24 text-center">
          <p className="kicker mb-4 text-primary">Case study not found</p>
          <h2 className="font-display text-3xl font-bold text-foreground mb-8">
            We couldn&apos;t find that project.
          </h2>
          <button onClick={() => setPage("work")} className="btn-solid">
            Back to all work
          </button>
        </div>
      </main>
    );
  }

  const isPlaceholder = !project.challenges;

  return (
    <main className="flex-1">
      {/* Top spacer to clear the fixed header */}
      <div className="h-24" aria-hidden="true" />

      {/* === Hero === */}
      <section className="bg-secondary py-20 sm:py-24">
        <div className="editorial">
          <button
            onClick={() => setPage("work")}
            className="group mb-10 inline-flex items-center gap-2 text-sm font-medium text-foreground/60 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to all work
          </button>

          <div data-reveal className="mb-6 flex items-center gap-4">
            <span className="h-px w-12 bg-primary" />
            <p className="kicker text-primary">{project.category}</p>
          </div>

          <h1
            data-reveal
            className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-primary sm:text-6xl lg:text-7xl"
          >
            {project.title}
          </h1>

          <p
            data-reveal
            className="serif-italic mt-8 max-w-2xl text-xl leading-relaxed text-foreground/80 sm:text-2xl"
          >
            {project.brief}
          </p>

          {/* View Project button — links to previewUrl if set */}
          {project.previewUrl && (
            <div data-reveal className="mt-8">
              <a
                href={project.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-solid group inline-flex items-center gap-2"
              >
                View Project
                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* === Visual hero block === */}
      <section className="bg-background py-16">
        <div className="editorial">
          <div
            data-reveal
            className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${project.accent}`}
          >
            {/* Uploaded thumbnail image — fills the entire block when present */}
            {project.thumbnail && (
              <img
                src={project.thumbnail}
                alt={project.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {/* Diagonal stripes texture — only when no thumbnail */}
            {!project.thumbnail && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, transparent 0px, transparent 18px, rgba(255,255,255,0.4) 18px, rgba(255,255,255,0.4) 19px)",
                }}
                aria-hidden="true"
              />
            )}

            {/* STRONG dark gradient overlay — ensures the white title text
                is clearly readable on the case study detail page. Heavier
                than the portfolio cards because the title is larger here. */}
            {project.thumbnail && (
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"
                aria-hidden="true"
              />
            )}

            {/* Oversized initial — only when no thumbnail */}
            {!project.thumbnail && (
              <span className="pointer-events-none absolute -bottom-8 -right-4 select-none font-display text-[18rem] font-extrabold leading-none text-white/10">
                {project.title[0]}
              </span>
            )}

            <span className="absolute left-6 top-6 kicker text-white/80">
              {project.tag}
            </span>
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <h2 className="text-center font-display text-3xl font-bold text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
                {project.title}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* === Detail blocks === */}
      {!isPlaceholder ? (
        <section className="bg-background py-24 sm:py-32">
          <div className="editorial space-y-20">
            <DetailBlock
              number="01"
              kicker="The challenge"
              title="What we were up against"
              body={project.challenges}
            />
            <DetailBlock
              number="02"
              kicker="The solution"
              title="What we built"
              body={project.solution}
            />
            <DetailBlock
              number="03"
              kicker="The results"
              title="What changed"
              body={project.results}
              highlight
            />
          </div>

          {/* Bottom View Project CTA — also links to previewUrl */}
          {project.previewUrl && (
            <div data-reveal className="mt-16 text-center">
              <a
                href={project.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-solid group inline-flex items-center gap-2"
              >
                View Live Project
                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          )}
        </section>
      ) : (
        <section className="bg-background py-24 sm:py-32">
          <div className="editorial text-center">
            <p className="serif-italic text-xl text-foreground/70 sm:text-2xl">
              This case study is still being written. Check back soon for the
              full brief, challenges, solution, and results.
            </p>
          </div>
        </section>
      )}

      {/* === Next case study CTA === */}
      {nextProject && nextProject.slug !== project.slug && (
        <section className="bg-secondary py-20">
          <div className="editorial">
            <button
              onClick={() => openCaseStudy(nextProject.slug)}
              className="group flex flex-col items-start gap-4 text-left sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="kicker mb-2 text-foreground/60">Next case study</p>
                <h3 className="font-display text-3xl font-bold text-primary sm:text-4xl">
                  {nextProject.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/60">
                  {nextProject.category}
                </p>
              </div>
              <span className="flex h-14 w-14 items-center justify-center bg-primary text-white transition-all group-hover:bg-accent group-hover:text-accent-foreground">
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

function DetailBlock({
  number,
  kicker,
  title,
  body,
  highlight,
}: {
  number: string;
  kicker: string;
  title: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div
      data-reveal
      className={`grid gap-8 lg:grid-cols-[1fr_3fr] lg:gap-16 ${
        highlight ? "rounded-lg bg-secondary p-8 sm:p-12" : ""
      }`}
    >
      <div>
        <span className="font-display text-6xl font-extrabold text-accent sm:text-7xl">
          {number}
        </span>
      </div>
      <div>
        <div className="mb-4 flex items-center gap-4">
          <span className="h-px w-8 bg-primary" />
          <p className="kicker text-primary">{kicker}</p>
        </div>
        <h3 className="font-display text-3xl font-bold text-foreground sm:text-4xl mb-6">
          {title}
        </h3>
        <p className="text-base leading-relaxed text-foreground/70 sm:text-lg">
          {body}
        </p>
        {highlight && (
          <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
            <CheckCircle2 className="h-5 w-5" />
            <span>Outcomes verified by client</span>
          </div>
        )}
      </div>
    </div>
  );
}
