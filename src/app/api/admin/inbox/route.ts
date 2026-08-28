import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/admin/inbox — all contact submissions, newest first */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = await db.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({
    submissions: submissions.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      projectType: s.projectType,
      budget: s.budget,
      message: s.message,
      status: s.status || "new",
      quoteAmount: s.quoteAmount,
      notes: s.notes,
      createdAt: s.createdAt.toISOString(),
    })),
  });
}
