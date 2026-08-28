import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/admin/testimonials/[id] — fetch a single testimonial for editing */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const testimonial = await db.testimonial.findUnique({ where: { id } });
  if (!testimonial) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ testimonial });
}

/** PUT /api/admin/testimonials/[id] — update a testimonial */
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

  if (body.photoData && body.photoData.length > 2_700_000) {
    return NextResponse.json(
      { error: "Photo is too large. Please use an image under 2MB." },
      { status: 400 }
    );
  }

  try {
    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        ...(body.quote !== undefined && { quote: body.quote }),
        ...(body.author !== undefined && { author: body.author }),
        ...(body.role !== undefined && { role: body.role }),
        ...(body.company !== undefined && { company: body.company }),
        ...(body.photoData !== undefined && { photoData: body.photoData }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });
    return NextResponse.json({ success: true, testimonial });
  } catch (err) {
    console.error("Update testimonial failed:", err);
    return NextResponse.json(
      { error: "Failed to update testimonial." },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/testimonials/[id] — permanently delete a testimonial */
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
    await db.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete testimonial failed:", err);
    return NextResponse.json(
      { error: "Failed to delete testimonial." },
      { status: 500 }
    );
  }
}
