import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/admin/clients — list all clients (admin view) */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clients = await db.client.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ clients });
}

/** POST /api/admin/clients — create a new client */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.name || !body.logoData) {
      return NextResponse.json(
        { error: "Client name and logo image are required." },
        { status: 400 }
      );
    }

    // Validate logoData is a data URL with reasonable size (< 2MB base64)
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

    const lastOrder = await db.client.aggregate({ _max: { order: true } });
    const order = body.order ?? (lastOrder._max.order ?? 0) + 1;

    const client = await db.client.create({
      data: {
        name: body.name,
        logoData: body.logoData,
        order,
        published: body.published ?? true,
      },
    });

    return NextResponse.json({ success: true, client });
  } catch (err) {
    console.error("Create client failed:", err);
    return NextResponse.json(
      { error: "Failed to create client." },
      { status: 500 }
    );
  }
}
