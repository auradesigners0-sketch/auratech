"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { SiteHeader } from "@/components/site/site-header";
import { FooterInfinity } from "@/components/site/footer-infinity";
import { ScrollRevealer } from "@/components/site/scroll-revealer";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  coverImage: string | null;
};

/**
 * /blog/[slug] — single blog post detail page.
 * Renders the markdown body via react-markdown.
 *
 * In Next.js 16, `params` is a Promise that must be awaited.
 */
export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetch(`/api/blog/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setPost(data.post);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <>
      <SiteHeader />
      <ScrollRevealer />
      <main className="flex-1">
        <div className="h-24" aria-hidden="true" />

        <article className="bg-background py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-12">
            {/* Back link */}
            <Link
              href="/#/blog"
              className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.22em] text-foreground/60 transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Insights
            </Link>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            ) : post ? (
              <>
                {/* Header */}
                <div data-reveal className="mt-8 flex items-center gap-3">
                  <span className="kicker text-primary">{post.category}</span>
                  <span className="h-px w-8 bg-border" />
                  <span className="text-xs text-foreground/50">{post.date} · {post.readTime}</span>
                </div>

                <h1
                  data-reveal
                  className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                >
                  {post.title}
                </h1>

                <p
                  data-reveal
                  className="serif-italic mt-6 text-lg leading-relaxed text-foreground/70 sm:text-xl"
                >
                  {post.excerpt}
                </p>

                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt=""
                    className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
                  />
                )}

                {/* Divider */}
                <div className="my-10 h-px w-full bg-border" />

                {/* Markdown body */}
                <div
                  data-reveal
                  className="blog-body text-base leading-relaxed text-foreground/90 sm:text-lg"
                >
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* Footer CTA */}
                <div className="mt-16 rounded-2xl bg-[#1B4332] p-8 text-white">
                  <p className="kicker mb-3 text-accent">Like what you read?</p>
                  <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                    Let&apos;s build something remarkable together.
                  </h2>
                  <Link
                    href="/#/contact"
                    className="mt-5 inline-flex items-center gap-2 bg-accent px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary transition-colors hover:bg-accent/90"
                  >
                    Start a Project
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </>
            ) : null}
          </div>
        </article>
      </main>
      <FooterInfinity />
    </>
  );
}
