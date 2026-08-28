import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/2fa/disable
 * Disables 2FA for the logged-in admin user.
 * Requires the current password as confirmation.
 *
 * Body: { currentPassword }
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { currentPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required to disable 2FA." },
        { status: 400 }
      );
    }

    // Verify current password
    const bcrypt = await import("bcryptjs");
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }

    // Disable 2FA
    await db.user.update({
      where: { id: session.user.id },
      data: {
        totpSecret: null,
        totpEnabled: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "2FA disabled successfully.",
    });
  } catch (err) {
    console.error("2FA disable failed:", err);
    return NextResponse.json(
      { error: "Failed to disable 2FA." },
      { status: 500 }
    );
  }
}
