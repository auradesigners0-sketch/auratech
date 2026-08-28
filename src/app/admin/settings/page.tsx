"use client";

import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Loader2, Check, AlertCircle, Lock, KeyRound, ShieldCheck } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from the current password.");
      return;
    }

    setStatus("loading");
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to change password");
      }

      setStatus("success");
      setSuccessMessage(data.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Clear success message after 10 seconds
      setTimeout(() => {
        setStatus("idle");
        setSuccessMessage(null);
      }, 10000);
    } catch (err) {
      console.error("Change password error:", err);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to change password");
      setTimeout(() => setStatus("idle"), 10000);
    }
  };

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8">
        <p className="kicker mb-2 text-primary">Settings</p>
        <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Change your admin password. You must enter your current password as confirmation.
        </p>
      </div>

      <div className="max-w-md">
        {/* Security info banner */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Security confirmation required
            </p>
            <p className="mt-1 text-xs text-foreground/60">
              To change your password, you must enter your current password first.
              This prevents unauthorized changes if someone else accesses your
              admin session.
            </p>
          </div>
        </div>

        {/* Password change form */}
        <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-border bg-white p-6">
          <div>
            <label htmlFor="currentPassword" className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <KeyRound className="h-3.5 w-3.5" />
              Current Password <span className="text-primary">*</span>
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              disabled={status === "loading"}
              autoComplete="current-password"
              className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-foreground/50">
              This is your confirmation — no changes happen without it.
            </p>
          </div>

          <div>
            <label htmlFor="newPassword" className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <Lock className="h-3.5 w-3.5" />
              New Password <span className="text-primary">*</span>
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              disabled={status === "loading"}
              autoComplete="new-password"
              className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
              <Lock className="h-3.5 w-3.5" />
              Confirm New Password <span className="text-primary">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter the new password"
              disabled={status === "loading"}
              autoComplete="new-password"
              className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/5 p-3 text-sm font-medium text-[#22C55E]">
              <Check className="h-4 w-4 shrink-0" />
              {successMessage}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={status === "loading" || !currentPassword || !newPassword || !confirmPassword}
            className="group inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Changing…
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                Change Password
              </>
            )}
          </button>
        </form>

        {/* Password requirements */}
        <div className="mt-6 rounded-xl border border-border bg-secondary/30 p-4">
          <p className="kicker mb-3 text-foreground/60">Password requirements</p>
          <ul className="space-y-1.5 text-xs text-foreground/60">
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary" />
              At least 8 characters long
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Must be different from your current password
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Use a mix of letters, numbers, and symbols for best security
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Don&apos;t reuse passwords from other accounts
            </li>
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
