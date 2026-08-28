import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/admin/projects — list all projects (admin view, includes unpublished) */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await db.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ projects });
}

/** POST /api/admin/projects — create a new project */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Required fields
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Title and slug are required." },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await db.project.findUnique({ where: { slug: body.slug } });
    if (existing) {
      return NextResponse.json(
        { error: `Slug "${body.slug}" is already in use.` },
        { status: 409 }
      );
    }

    // Auto-assign order if not provided
    const lastOrder = await db.project.aggregate({ _max: { order: true } });
    const order = body.order ?? (lastOrder._max.order ?? 0) + 1;

    const project = await db.project.create({
      data: {
        slug: body.slug,
        title: body.title,
        category: body.category || "Project",
        description: body.description || "",
        tag: body.tag || "Web",
        accent: body.accent || "from-[#1B4332] to-[#143A2B]",
        brief: body.brief || "",
        challenges: body.challenges || "",
        solution: body.solution || "",
        results: body.results || "",
        thumbnail: body.thumbnail || null,
        previewUrl: body.previewUrl || null,
        featured: body.featured ?? false,
        published: body.published ?? true,
        order,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (err) {
    console.error("Create project failed:", err);
    return NextResponse.json(
      { error: "Failed to create project." },
      { status: 500 }
    );
  }
}
