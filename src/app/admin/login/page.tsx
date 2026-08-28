"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
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
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-green opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / brand */}
        <div className="mb-10 text-center">
          <p className="kicker mb-3 text-accent">Auratech Admin</p>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Sign in to your dashboard
          </h1>
          <p className="serif-italic mt-3 text-base text-white/60">
            Manage projects, blog posts, and contact submissions.
          </p>
        </div>

        {/* Form card */}
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
          <div className="mb-8">
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

          {/* Error */}
          {error && (
            <p className="mb-6 flex items-center gap-2 text-sm font-medium text-[#FF6B6B]">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="group inline-flex w-full items-center justify-center gap-2 bg-accent px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary transition-all duration-300 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Back to site */}
        <p className="mt-8 text-center text-xs text-white/40">
          <a href="/" className="underline underline-offset-4 hover:text-white/70">
            ← Back to website
          </a>
        </p>
      </div>
    </main>
  );
}
