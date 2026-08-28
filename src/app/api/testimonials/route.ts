import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testimonials as staticTestimonials } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export type PublicTestimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  photoData: string | null;
};

/**
 * GET /api/testimonials
 * Returns published testimonials ordered by `order` asc.
 * Falls back to static testimonials if DB query fails or no rows exist.
 * NEVER returns an empty/non-JSON response — always returns valid JSON.
 */
export async function GET() {
  try {
    const rows = await db.testimonial.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    if (rows.length === 0) {
      const fallback: PublicTestimonial[] = staticTestimonials.map((t, i) => ({
        id: `static-${i}`,
        quote: t.quote,
        author: t.author,
        role: t.role,
        company: t.company,
        photoData: null,
      }));
      return NextResponse.json({ testimonials: fallback });
    }

    const testimonials: PublicTestimonial[] = rows.map((t) => ({
      id: t.id,
      quote: t.quote,
      author: t.author,
      role: t.role,
      company: t.company,
      photoData: t.photoData,
    }));

    return NextResponse.json({ testimonials });
  } catch (error) {
    // If the database query fails (e.g. table doesn't exist, Prisma
    // client not generated), return the static fallback instead of
    // crashing with an empty response.
    console.error("Testimonials API error:", error);
    const fallback: PublicTestimonial[] = staticTestimonials.map((t, i) => ({
      id: `static-${i}`,
      quote: t.quote,
      author: t.author,
      role: t.role,
      company: t.company,
      photoData: null,
    }));
    return NextResponse.json({ testimonials: fallback });
  }
}
