import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolioItems } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export type PublicProject = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  tag: string;
  accent: string;
  brief: string;
  challenges: string;
  solution: string;
  results: string;
  thumbnail: string | null;
  previewUrl: string | null;
  featured: boolean;
};

/**
 * GET /api/projects
 *
 * Returns published projects ordered by `order` asc then `createdAt` desc.
 *
 * Query params:
 *  - limit:    number of projects to return (default: all)
 *  - featured: "true" to return only projects flagged as featured
 *
 * Homepage uses ?featured=true&limit=3 → up to 3 admin-selected projects.
 * /projects page uses no params → all published projects.
 *
 * If no DB rows exist, falls back to the static portfolioItems.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;
  const featuredOnly = searchParams.get("featured") === "true";

  const rows = await db.project.findMany({
    where: {
      published: true,
      ...(featuredOnly ? { featured: true } : {}),
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    ...(limit ? { take: limit } : {}),
  });

  if (rows.length === 0) {
    // Fallback to static content so the site never looks empty
    const fallback: PublicProject[] = portfolioItems
      .filter((_, i) => !featuredOnly || i < 3)
      .map((p, i) => ({
        id: `static-${i}`,
        ...p,
        thumbnail: null,
        previewUrl: null,
        featured: i < 3,
      }));
    return NextResponse.json({
      projects: limit ? fallback.slice(0, limit) : fallback,
    });
  }

  const projects: PublicProject[] = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    description: p.description,
    tag: p.tag,
    accent: p.accent,
    brief: p.brief,
    challenges: p.challenges,
    solution: p.solution,
    results: p.results,
    thumbnail: p.thumbnail,
    previewUrl: p.previewUrl,
    featured: p.featured,
  }));

  return NextResponse.json({ projects });
}
