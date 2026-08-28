"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import type { PublicBlogPost } from "@/app/api/blog/route";
import { FooterInfinity } from "./footer-infinity";

/**
 * BlogInfinity — the "Insights" page.
 *
 * Professional editorial layout:
 *  - Hero header
 *  - Featured post: large horizontal card with thumbnail on left, text on right
 *  - All posts: compact list rows with small thumbnail, title, excerpt, meta
 *
 * Fetches from /api/blog (admin-managed).
 */
export function BlogInfinity() {
  const [posts, setPosts] = useState<PublicBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => setPosts(data.posts ?? []))
      .catch((e) => console.error("Blog load failed:", e))
      .finally(() => setLoading(false));
  }, []);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <main className="flex-1">
        {/* Top spacer to clear the fixed transparent header */}
        <div className="h-24" aria-hidden="true" />

        {/* === Hero === */}
        <section className="bg-background py-16 sm:py-20">
          <div className="editorial">
            <div data-reveal className="mb-10 flex items-center gap-4">
              <span className="h-px w-12 bg-primary" />
              <p className="kicker text-primary">Insights</p>
            </div>
            <h1
              data-reveal
              className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-primary sm:text-6xl lg:text-7xl"
            >
              Notes from the
              <br />
              <span className="text-accent">studio</span>.
            </h1>
            <p
              data-reveal
              className="serif-italic mt-8 max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl"
            >
              Field reports, engineering notes, and the occasional opinion on
              building software in and for Africa. New posts every few weeks.
            </p>
          </div>
        </section>

        {loading ? (
          <section className="bg-background py-16">
            <div className="editorial">
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              </div>
            </div>
          </section>
        ) : posts.length === 0 ? (
          <section className="bg-background py-16">
            <div className="editorial">
              <p className="py-12 text-center text-sm text-foreground/50">
                No blog posts yet. Add some via the admin dashboard.
              </p>
            </div>
          </section>
        ) : (
          <>
            {/* === Featured post — horizontal split layout === */}
            {featured && (
              <section className="bg-secondary py-16 sm:py-20">
                <div className="editorial">
                  <div data-reveal className="mb-8 flex items-center gap-4">
                    <span className="h-px w-12 bg-primary" />
                    <p className="kicker text-primary">Featured</p>
                  </div>
                  <a
                    href={`/blog/${featured.slug}`}
                    data-reveal
                    className="group grid overflow-hidden border border-border bg-card transition-all hover:border-primary/40 lg:grid-cols-2"
                  >
                    {/* Image — left side on desktop, top on mobile */}
                    {featured.coverImage ? (
                      <div className="aspect-[16/9] overflow-hidden lg:aspect-auto">
                        <img
                          src={featured.coverImage}
                          alt={featured.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#1B4332] to-[#143A2B] lg:aspect-auto">
                        <div className="flex h-full items-center justify-center p-8">
                          <span className="font-display text-6xl font-extrabold text-white/20">
                            {featured.title[0]}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content — right side on desktop, below on mobile */}
                    <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
                          {featured.category}
                        </span>
                        <span className="text-foreground/40">·</span>
                        <span className="flex items-center gap-1 text-foreground/60">
                          <Clock className="h-3 w-3" />
                          {featured.readTime}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl">
                        {featured.title}
                      </h2>
                      <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
                        {featured.excerpt}
                      </p>
                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
                        Read article
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </a>
                </div>
              </section>
            )}

            {/* === All posts — compact horizontal cards === */}
            {rest.length > 0 && (
              <section className="bg-background py-16 sm:py-20">
                <div className="editorial">
                  <div data-reveal className="mb-8 flex items-center gap-4">
                    <span className="h-px w-12 bg-primary" />
                    <p className="kicker text-primary">All posts</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post, idx) => (
                      <a
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        data-reveal="fade-up"
                        style={{ transitionDelay: `${idx * 80}ms` }}
                        className="group flex flex-col overflow-hidden border border-border bg-card transition-all hover:border-primary/40 hover:shadow-md"
                      >
                        {/* Thumbnail — small, top of card */}
                        {post.coverImage ? (
                          <div className="aspect-[16/9] overflow-hidden">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#1B4332] to-[#143A2B]">
                            <div className="flex h-full items-center justify-center">
                              <span className="font-display text-4xl font-extrabold text-white/20">
                                {post.title[0]}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-5">
                          <div className="mb-2 flex items-center gap-2 text-xs">
                            <span className="font-semibold uppercase tracking-wider text-accent">
                              {post.category}
                            </span>
                            <span className="text-foreground/40">·</span>
                            <span className="flex items-center gap-1 text-foreground/50">
                              <Clock className="h-3 w-3" />
                              {post.readTime}
                            </span>
                          </div>
                          <h3 className="font-display text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                            {post.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground/60">
                            {post.excerpt}
                          </p>
                          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                            Read
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <FooterInfinity />
    </>
  );
}
