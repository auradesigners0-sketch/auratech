import { authenticator } from "otplib";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/2fa/verify
 * Verifies a TOTP code from the user's authenticator app.
 * If valid, saves the secret to the database and enables 2FA.
 *
 * Body: { secret, code }
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { secret, code } = body;

    if (!secret || !code) {
      return NextResponse.json(
        { error: "Secret and verification code are required." },
        { status: 400 }
      );
    }

    // Verify the TOTP code against the secret
    const isValid = authenticator.verify({
      token: code,
      secret,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code. Please try again." },
        { status: 400 }
      );
    }

    // Code is valid — save the secret and enable 2FA
    await db.user.update({
      where: { id: session.user.id },
      data: {
        totpSecret: secret,
        totpEnabled: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "2FA enabled successfully. You'll need a verification code on next login.",
    });
  } catch (err) {
    console.error("2FA verify failed:", err);
    return NextResponse.json(
      { error: `Failed to verify 2FA code: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
