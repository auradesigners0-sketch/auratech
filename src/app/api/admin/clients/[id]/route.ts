import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/admin/clients/[id] — fetch a single client for editing */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const client = await db.client.findUnique({ where: { id } });
  if (!client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ client });
}

/** PUT /api/admin/clients/[id] — update a client */
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

  // Validate new logo if provided
  if (body.logoData !== undefined) {
    if (!body.logoData.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Logo must be an image data URL." },
        { status: 400 }
      );
    }
    if (body.logoData.length > 2_700_000) {
      return NextResponse.json(
        { error: "Logo image is too large. Please use an image under 2MB." },
        { status: 400 }
      );
    }
  }

  try {
    const client = await db.client.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.logoData !== undefined && { logoData: body.logoData }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });
    return NextResponse.json({ success: true, client });
  } catch (err) {
    console.error("Update client failed:", err);
    return NextResponse.json(
      { error: "Failed to update client." },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/clients/[id] — permanently delete a client */
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
    await db.client.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete client failed:", err);
    return NextResponse.json(
      { error: "Failed to delete client." },
      { status: 500 }
    );
  }
}
