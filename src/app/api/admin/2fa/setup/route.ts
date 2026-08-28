import { authenticator } from "otplib";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/2fa/setup
 * Generates a new TOTP secret for the logged-in admin user.
 * Returns the secret + a QR code URL that the user scans with
 * Google Authenticator / Authy / 1Password etc.
 *
 * The secret is NOT saved to the database yet — it's only saved
 * after the user verifies a TOTP code (see /api/admin/2fa/verify).
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a new TOTP secret using the authenticator instance
    const secret = authenticator.generateSecret();

    // Build the otpauth:// URL that QR codes encode
    const issuer = "Auratech";
    const account = session.user.email || "admin";
    const otpauthUrl = authenticator.keyuri(account, issuer, secret);

    return NextResponse.json({
      success: true,
      secret,
      otpauthUrl,
      // QR code API URL (user can scan this)
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`,
    });
  } catch (err) {
    console.error("2FA setup failed:", err);
    return NextResponse.json(
      { error: `Failed to generate 2FA secret: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
