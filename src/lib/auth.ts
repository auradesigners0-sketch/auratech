import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { db } from "@/lib/db";
import { checkRateLimit, logLoginAttempt } from "@/lib/rate-limit";

/**
 * NextAuth configuration — credentials provider with:
 *  - bcrypt password hashing
 *  - 2FA (TOTP) support via Google Authenticator
 *  - Rate limiting (max 5 failed attempts per 15 minutes per IP)
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        // === Rate limiting ===
        // Get IP from request headers
        const headers = (req as any)?.headers || {};
        const ip =
          headers["x-forwarded-for"] ||
          headers["x-real-ip"] ||
          headers["client-ip"] ||
          "unknown";

        const rateLimit = await checkRateLimit(ip, credentials.email);
        if (rateLimit.blocked) {
          throw new Error(
            `Too many failed login attempts. Please try again in ${rateLimit.minutesLeft} minutes.`
          );
        }

        // === Find user ===
        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.password) {
          await logLoginAttempt(ip, credentials.email, false);
          return null;
        }

        // === Verify password ===
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) {
          await logLoginAttempt(ip, credentials.email, false);
          return null;
        }

        // === 2FA check ===
        if (user.totpEnabled && user.totpSecret) {
          if (!credentials.totpCode) {
            // Signal to frontend that 2FA is required
            throw new Error("2FA_REQUIRED");
          }

          const totpValid = authenticator.verify({
            token: credentials.totpCode,
            secret: user.totpSecret,
          });

          if (!totpValid) {
            await logLoginAttempt(ip, credentials.email, false);
            throw new Error("Invalid 2FA code. Please try again.");
          }
        }

        // Only ADMIN users can sign in
        if (user.role !== "ADMIN") {
          await logLoginAttempt(ip, credentials.email, false);
          return null;
        }

        // Success — log it
        await logLoginAttempt(ip, credentials.email, true);

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

// Type augmentation
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
    };
  }
  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
