"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Loader2, Check, AlertCircle, Lock, KeyRound, ShieldCheck, QrCode, X } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export default function AdminSettingsPage() {
  // === Password change state ===
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwStatus, setPwStatus] = useState<Status>("idle");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  // === 2FA state ===
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [show2faSetup, setShow2faSetup] = useState(false);
  const [totpSecret, setTotpSecret] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [totpStatus, setTotpStatus] = useState<Status>("idle");
  const [totpError, setTotpError] = useState<string | null>(null);
  const [totpSuccess, setTotpSuccess] = useState<string | null>(null);

  // === Disable 2FA state ===
  const [disablePassword, setDisablePassword] = useState("");
  const [disableStatus, setDisableStatus] = useState<Status>("idle");

  // Check if 2FA is already enabled
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        // We can't get totpEnabled from the session directly,
        // so we check via a dedicated endpoint
      })
      .catch(() => {});
  }, []);

  // === Password change handler ===
  const onPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("All fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New password and confirmation do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setPwError("New password must be different from the current password.");
      return;
    }

    setPwStatus("loading");
    setPwError(null);
    setPwSuccess(null);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      setPwStatus("success");
      setPwSuccess(data.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => { setPwStatus("idle"); setPwSuccess(null); }, 10000);
    } catch (err) {
      setPwStatus("error");
      setPwError(err instanceof Error ? err.message : "Failed to change password");
      setTimeout(() => setPwStatus("idle"), 10000);
    }
  };

  // === 2FA setup handler ===
  const start2faSetup = async () => {
    setTotpStatus("loading");
    setTotpError(null);
    try {
      const res = await fetch("/api/admin/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      setTotpSecret(data.secret);
      setQrUrl(data.qrUrl);
      setShow2faSetup(true);
      setTotpStatus("idle");
    } catch (err) {
      setTotpError(err instanceof Error ? err.message : "Failed to start 2FA setup");
      setTotpStatus("idle");
    }
  };

  // === 2FA verify handler ===
  const verify2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length !== 6) {
      setTotpError("Please enter the 6-digit code.");
      return;
    }

    setTotpStatus("loading");
    setTotpError(null);
    try {
      const res = await fetch("/api/admin/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: totpSecret, code: totpCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      setTotpEnabled(true);
      setShow2faSetup(false);
      setTotpSuccess(data.message || "2FA enabled successfully!");
      setTotpCode("");
      setTotpSecret("");
      setQrUrl("");
      setTotpStatus("idle");
      setTimeout(() => setTotpSuccess(null), 10000);
    } catch (err) {
      setTotpError(err instanceof Error ? err.message : "Failed to verify");
      setTotpStatus("idle");
    }
  };

  // === 2FA disable handler ===
  const disable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disablePassword) return;
    setDisableStatus("loading");
    try {
      const res = await fetch("/api/admin/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: disablePassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      setTotpEnabled(false);
      setDisablePassword("");
      setDisableStatus("idle");
      setTotpSuccess("2FA disabled.");
      setTimeout(() => setTotpSuccess(null), 10000);
    } catch (err) {
      setTotpError(err instanceof Error ? err.message : "Failed");
      setDisableStatus("idle");
    }
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="kicker mb-2 text-primary">Settings</p>
        <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">Account Settings</h1>
        <p className="mt-1 text-sm text-foreground/60">Manage your password and security settings.</p>
      </div>

      <div className="max-w-md space-y-8">
        {/* === Password Change Section === */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <Lock className="h-5 w-5 text-primary" /> Change Password
          </h2>
          <form onSubmit={onPasswordChange} className="space-y-5 rounded-xl border border-border bg-white p-6">
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                <KeyRound className="h-3.5 w-3.5" /> Current Password *
              </label>
              <input
                type="password" value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password" disabled={pwStatus === "loading"}
                className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                <Lock className="h-3.5 w-3.5" /> New Password *
              </label>
              <input
                type="password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters" disabled={pwStatus === "loading"}
                className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
                <Lock className="h-3.5 w-3.5" /> Confirm New Password *
              </label>
              <input
                type="password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password" disabled={pwStatus === "loading"}
                className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
            {pwError && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" /> {pwError}
              </div>
            )}
            {pwSuccess && (
              <div className="flex items-center gap-2 rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/5 p-3 text-sm font-medium text-[#22C55E]">
                <Check className="h-4 w-4 shrink-0" /> {pwSuccess}
              </div>
            )}
            <button
              type="submit"
              disabled={pwStatus === "loading" || !currentPassword || !newPassword || !confirmPassword}
              className="inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {pwStatus === "loading" ? (<><Loader2 className="h-3.5 w-3.5 animate-spin" /> Changing…</>) : (<><Lock className="h-3.5 w-3.5" /> Change Password</>)}
            </button>
          </form>
        </div>

        {/* === 2FA Section === */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <ShieldCheck className="h-5 w-5 text-primary" /> Two-Factor Authentication (2FA)
          </h2>

          {/* 2FA status banner */}
          <div className={`mb-4 flex items-start gap-3 rounded-xl border p-4 ${totpEnabled ? "border-[#22C55E]/30 bg-[#22C55E]/5" : "border-amber-300 bg-amber-50"}`}>
            <ShieldCheck className={`mt-0.5 h-5 w-5 shrink-0 ${totpEnabled ? "text-[#22C55E]" : "text-amber-600"}`} />
            <div>
              <p className="text-sm font-medium text-foreground">
                {totpEnabled ? "2FA is ENABLED" : "2FA is NOT enabled"}
              </p>
              <p className="mt-1 text-xs text-foreground/60">
                {totpEnabled
                  ? "Your account requires a verification code from your authenticator app on every login."
                  : "Enable 2FA for an extra layer of security. You'll need Google Authenticator, Authy, or similar app."}
              </p>
            </div>
          </div>

          {/* 2FA success message */}
          {totpSuccess && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/5 p-3 text-sm font-medium text-[#22C55E]">
              <Check className="h-4 w-4 shrink-0" /> {totpSuccess}
            </div>
          )}

          {/* 2FA error */}
          {totpError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" /> {totpError}
            </div>
          )}

          {/* Enable 2FA button */}
          {!totpEnabled && !show2faSetup && (
            <button
              onClick={start2faSetup}
              disabled={totpStatus === "loading"}
              className="inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {totpStatus === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
              Enable 2FA
            </button>
          )}

          {/* 2FA Setup wizard */}
          {show2faSetup && (
            <div className="rounded-xl border border-border bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-foreground">Set up 2FA</h3>
                <button onClick={() => { setShow2faSetup(false); setTotpCode(""); setTotpSecret(""); setQrUrl(""); }} className="text-foreground/40 hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Step 1: Scan QR code */}
              <div className="mb-6">
                <p className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">1</span>
                  Scan this QR code with your authenticator app
                </p>
                {qrUrl && (
                  <div className="flex justify-center">
                    <img src={qrUrl} alt="QR Code for 2FA" className="rounded-lg border border-border" />
                  </div>
                )}
                <p className="mt-3 text-center text-xs text-foreground/50">
                  Or enter this code manually:
                </p>
                <p className="mt-1 break-all rounded bg-secondary p-2 text-center font-mono text-xs text-foreground/70">
                  {totpSecret}
                </p>
              </div>

              {/* Step 2: Enter code */}
              <form onSubmit={verify2fa}>
                <p className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">2</span>
                  Enter the 6-digit code from your app
                </p>
                <input
                  type="text" inputMode="numeric" maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000" disabled={totpStatus === "loading"}
                  className="w-full rounded-lg border border-border bg-white px-3 py-3 text-center text-2xl tracking-[0.5em] text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={totpStatus === "loading" || totpCode.length !== 6}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-accent px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary transition-all hover:bg-accent/90 disabled:opacity-50"
                >
                  {totpStatus === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  Verify & Enable
                </button>
              </form>
            </div>
          )}

          {/* Disable 2FA */}
          {totpEnabled && !show2faSetup && (
            <form onSubmit={disable2fa} className="rounded-xl border border-border bg-white p-6">
              <h3 className="mb-2 font-display text-base font-bold text-foreground">Disable 2FA</h3>
              <p className="mb-4 text-xs text-foreground/60">
                Enter your current password to disable 2FA. This will make your account less secure.
              </p>
              <input
                type="password" value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="Current password" disabled={disableStatus === "loading"}
                className="mb-3 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                disabled={disableStatus === "loading" || !disablePassword}
                className="inline-flex w-full items-center justify-center gap-2 border border-destructive/40 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-destructive transition-all hover:bg-destructive hover:text-white disabled:opacity-50"
              >
                {disableStatus === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                Disable 2FA
              </button>
            </form>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
