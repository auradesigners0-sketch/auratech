import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts as staticBlogPosts } from "@/lib/site-content";

export const dynamic = "force-dynamic";

/**
 * GET /api/blog/[slug]
 * Returns full blog post content (markdown body) for a single post.
 * Falls back to static blogPosts if slug not found in DB.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const post = await db.blogPost.findUnique({ where: { slug } });

  if (post && post.published) {
    return NextResponse.json({
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        date: post.date,
        readTime: post.readTime,
        coverImage: post.coverImage,
      },
    });
  }

  // Fallback to static
  const staticPost = staticBlogPosts.find((p) => p.slug === slug);
  if (staticPost) {
    return NextResponse.json({
      post: {
        ...staticPost,
        id: `static-${slug}`,
        content: staticPost.excerpt,
        coverImage: null,
      },
    });
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
