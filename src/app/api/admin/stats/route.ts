import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/admin/stats — counts + 5 most recent contact submissions */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Count testimonials and clients separately with try-catch,
  // in case those tables don't exist yet on a fresh database.
  let testimonials = 0;
  let clients = 0;
  try {
    testimonials = await db.testimonial.count();
  } catch {
    testimonials = 0;
  }
  try {
    clients = await db.client.count();
  } catch {
    clients = 0;
  }

  const [projects, blogPosts, contactSubmissions, recentSubmissions] =
    await Promise.all([
      db.project.count(),
      db.blogPost.count(),
      db.contactSubmission.count(),
      db.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return NextResponse.json({
    projects,
    blogPosts,
    testimonials,
    clients,
    contactSubmissions,
    recentSubmissions: recentSubmissions.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      projectType: s.projectType,
      createdAt: s.createdAt.toISOString(),
    })),
  });
}
