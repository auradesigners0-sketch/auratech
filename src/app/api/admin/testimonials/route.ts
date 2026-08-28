import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/admin/testimonials — list all testimonials (admin view) */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const testimonials = await db.testimonial.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Admin testimonials GET error:", error);
    // Return empty array instead of crashing — the admin page will
    // show "No testimonials yet" instead of an error.
    return NextResponse.json({ testimonials: [] });
  }
}

/** POST /api/admin/testimonials — create a new testimonial */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.quote || !body.author) {
      return NextResponse.json(
        { error: "Quote and author name are required." },
        { status: 400 }
      );
    }

    // Validate photo size if provided (max 2MB base64)
    if (body.photoData && body.photoData.length > 2_700_000) {
      return NextResponse.json(
        { error: "Photo is too large. Please use an image under 2MB." },
        { status: 400 }
      );
    }

    const lastOrder = await db.testimonial.aggregate({ _max: { order: true } });
    const order = body.order ?? (lastOrder._max.order ?? 0) + 1;

    const testimonial = await db.testimonial.create({
      data: {
        quote: body.quote,
        author: body.author,
        role: body.role || "",
        company: body.company || "",
        photoData: body.photoData || null,
        order,
        published: body.published ?? true,
      },
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (err) {
    console.error("Create testimonial failed:", err);
    return NextResponse.json(
      { error: "Failed to create testimonial." },
      { status: 500 }
    );
  }
}
