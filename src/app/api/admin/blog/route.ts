import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/admin/blog — list all blog posts (admin view) */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ posts });
}

/** POST /api/admin/blog — create a new blog post */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Title and slug are required." },
        { status: 400 }
      );
    }

    const existing = await db.blogPost.findUnique({ where: { slug: body.slug } });
    if (existing) {
      return NextResponse.json(
        { error: `Slug "${body.slug}" is already in use.` },
        { status: 409 }
      );
    }

    const post = await db.blogPost.create({
      data: {
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt || "",
        content: body.content || "",
        category: body.category || "Insights",
        date: body.date || new Date().toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        readTime: body.readTime || "5 min read",
        coverImage: body.coverImage || null,
        published: body.published ?? true,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (err) {
    console.error("Create blog post failed:", err);
    return NextResponse.json(
      { error: "Failed to create blog post." },
      { status: 500 }
    );
  }
}
