"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showTotp, setShowTotp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      // Only send totpCode if the 2FA field is showing
      ...(showTotp && totpCode ? { totpCode } : {}),
      redirect: false,
    });

    if (res?.error) {
      if (res.error === "2FA_REQUIRED") {
        // Show the TOTP input field
        setShowTotp(true);
        setError("Enter your 6-digit verification code from your authenticator app.");
        setLoading(false);
      } else if (res.error.includes("Too many failed")) {
        setError(res.error);
        setLoading(false);
      } else if (res.error.includes("2FA code")) {
        setError("Invalid verification code. Please try again.");
        setLoading(false);
      } else {
        setError("Invalid email or password.");
        setLoading(false);
      }
    } else if (res?.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1B4332] px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-grid-green opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="kicker mb-3 text-accent">Auratech Admin</p>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Sign in to your dashboard
          </h1>
          <p className="serif-italic mt-3 text-base text-white/60">
            Manage projects, blog posts, and contact submissions.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl bg-white/[0.04] p-8 shadow-2xl backdrop-blur-sm sm:p-10"
        >
          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="mb-3 block">
              <span className="kicker text-white/60">Email</span>
            </label>
            <div className="flex items-center border-b-2 border-white/20 transition-colors focus-within:border-accent">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@auratech.com"
                disabled={loading}
                autoComplete="email"
                className="flex-1 bg-transparent py-3 text-base text-white placeholder:text-white/40 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="mb-3 block">
              <span className="kicker text-white/60">Password</span>
            </label>
            <div className="flex items-center border-b-2 border-white/20 transition-colors focus-within:border-accent">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
                className="flex-1 bg-transparent py-3 text-base text-white placeholder:text-white/40 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* 2FA Code — only shows if 2FA is required */}
          {showTotp && (
            <div className="mb-6">
              <label htmlFor="totpCode" className="mb-3 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                <span className="kicker text-accent">Verification Code (2FA)</span>
              </label>
              <div className="flex items-center border-b-2 border-accent/40">
                <input
                  id="totpCode"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  disabled={loading}
                  autoComplete="one-time-code"
                  className="flex-1 bg-transparent py-3 text-center text-2xl tracking-[0.5em] text-white placeholder:text-white/30 focus:outline-none disabled:opacity-50"
                />
              </div>
              <p className="mt-2 text-xs text-white/50">
                Enter the 6-digit code from your authenticator app (Google Authenticator, Authy, etc.)
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mb-6 flex items-start gap-2 text-sm font-medium text-[#FF6B6B]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email || !password || (showTotp && totpCode.length !== 6)}
            className="group inline-flex w-full items-center justify-center gap-2 bg-accent px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary transition-all duration-300 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                {showTotp ? "Verify & Sign In" : "Sign In"}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/40">
          <a href="/" className="underline underline-offset-4 hover:text-white/70">
            ← Back to website
          </a>
        </p>
      </div>
    </main>
  );
}
