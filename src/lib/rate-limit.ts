import { db } from "@/lib/db";

/**
 * Rate limiting for login attempts.
 * Uses the database (not Redis) so it works on Netlify.
 *
 * Rules:
 *  - Max 5 failed attempts per 15 minutes per IP
 *  - After 5 failures, the IP is blocked for 15 minutes
 *  - Successful logins reset the counter
 */

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

/**
 * Check if an IP/email is currently rate-limited.
 * Returns { blocked, attemptsLeft, minutesLeft }
 */
export async function checkRateLimit(ip: string, email?: string) {
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

  // Count failed attempts from this IP in the time window
  const failedAttempts = await db.loginAttempt.count({
    where: {
      ip,
      success: false,
      createdAt: { gte: windowStart },
    },
  });

  if (failedAttempts >= MAX_ATTEMPTS) {
    // Find the most recent failed attempt to calculate time left
    const latest = await db.loginAttempt.findFirst({
      where: {
        ip,
        success: false,
        createdAt: { gte: windowStart },
      },
      orderBy: { createdAt: "desc" },
    });

    const blockUntil = latest
      ? new Date(latest.createdAt.getTime() + WINDOW_MINUTES * 60 * 1000)
      : new Date(Date.now() + WINDOW_MINUTES * 60 * 1000);

    const minutesLeft = Math.ceil(
      (blockUntil.getTime() - Date.now()) / (60 * 1000)
    );

    return {
      blocked: true,
      attemptsLeft: 0,
      minutesLeft: Math.max(1, minutesLeft),
    };
  }

  return {
    blocked: false,
    attemptsLeft: MAX_ATTEMPTS - failedAttempts,
    minutesLeft: 0,
  };
}

/**
 * Log a login attempt (success or failure).
 * Also cleans up old entries (older than 1 hour) to keep the table small.
 */
export async function logLoginAttempt(
  ip: string,
  email: string | undefined,
  success: boolean
) {
  try {
    // Log the attempt
    await db.loginAttempt.create({
      data: {
        ip,
        email: email || null,
        success,
      },
    });

    // Clean up old entries (older than 1 hour) — runs on every login attempt
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    await db.loginAttempt.deleteMany({
      where: { createdAt: { lt: oneHourAgo } },
    });
  } catch (error) {
    // If the LoginAttempt table doesn't exist yet (fresh DB),
    // silently fail — don't block the login
    console.error("Rate limit logging failed:", error);
  }
}
