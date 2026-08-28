import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/admin/projects/[id] — fetch a single project for editing */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ project });
}

/** PUT /api/admin/projects/[id] — update a project */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // If slug is changing, check uniqueness
  if (body.slug) {
    const clash = await db.project.findUnique({ where: { slug: body.slug } });
    if (clash && clash.id !== id) {
      return NextResponse.json(
        { error: `Slug "${body.slug}" is already in use.` },
        { status: 409 }
      );
    }
  }

  try {
    const project = await db.project.update({
      where: { id },
      data: {
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.tag !== undefined && { tag: body.tag }),
        ...(body.accent !== undefined && { accent: body.accent }),
        ...(body.brief !== undefined && { brief: body.brief }),
        ...(body.challenges !== undefined && { challenges: body.challenges }),
        ...(body.solution !== undefined && { solution: body.solution }),
        ...(body.results !== undefined && { results: body.results }),
        ...(body.thumbnail !== undefined && { thumbnail: body.thumbnail }),
        ...(body.previewUrl !== undefined && { previewUrl: body.previewUrl }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });
    return NextResponse.json({ success: true, project });
  } catch (err) {
    console.error("Update project failed:", err);
    return NextResponse.json(
      { error: "Failed to update project." },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/projects/[id] — permanently delete a project */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await db.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete project failed:", err);
    return NextResponse.json(
      { error: "Failed to delete project." },
      { status: 500 }
    );
  }
}
