import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** PUT /api/admin/inbox/[id] — update submission status, quote, or notes */
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

  try {
    const submission = await db.contactSubmission.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.quoteAmount !== undefined && { quoteAmount: body.quoteAmount || null }),
        ...(body.notes !== undefined && { notes: body.notes || null }),
      },
    });
    return NextResponse.json({ success: true, submission });
  } catch (err) {
    console.error("Update submission failed:", err);
    return NextResponse.json(
      { error: "Failed to update submission." },
      { status: 500 }
    );
  }
}
