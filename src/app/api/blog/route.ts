import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts as staticBlogPosts } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export type PublicBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  coverImage: string | null;
};

/**
 * GET /api/blog
 * Returns published blog posts (no content body — use /api/blog/[slug] for that).
 * Falls back to static blogPosts if no DB rows exist.
 */
export async function GET() {
  const rows = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  if (rows.length === 0) {
    const fallback: PublicBlogPost[] = staticBlogPosts.map((p, i) => ({
      id: `static-${i}`,
      ...p,
      coverImage: null,
    }));
    return NextResponse.json({ posts: fallback });
  }

  const posts: PublicBlogPost[] = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    date: p.date,
    readTime: p.readTime,
    coverImage: p.coverImage,
  }));

  return NextResponse.json({ posts });
}
