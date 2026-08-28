"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, ArrowLeft, Save, Upload, X } from "lucide-react";

type ClientData = {
  name: string;
  logoData: string;
  published: boolean;
  order: number;
};

const empty: ClientData = {
  name: "",
  logoData: "",
  published: true,
  order: 0,
};

const MAX_FILE_SIZE = 2_000_000; // 2MB

export function ClientForm({ initial, clientId }: { initial?: ClientData; clientId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<ClientData>(initial ?? empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof ClientData>(k: K, v: ClientData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  /** Convert a File to a base64 data URL, with size validation + format check */
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, SVG, or WebP).");
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError(
        `File is too large (${(file.size / 1024).toFixed(0)} KB). Maximum is ${MAX_FILE_SIZE / 1000} KB.`
      );
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        update("logoData", result);
        setUploading(false);
      };
      reader.onerror = () => {
        setError("Failed to read the file. Please try again.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to process the image. Please try a different file.");
      setUploading(false);
    }
  };

  const removeLogo = () => {
    update("logoData", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = clientId ? `/api/admin/clients/${clientId}` : "/api/admin/clients";
    const method = clientId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Save failed");
      }
      router.push("/admin/clients");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Top nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Clients
        </Link>
        <button
          type="submit"
          disabled={saving || !data.name || !data.logoData}
          className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {clientId ? "Save Changes" : "Add Client"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left — name + publish settings */}
        <div className="space-y-6">
          <Card>
            <Label htmlFor="name">Client Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. ABC Global Church"
              required
            />
            <p className="mt-2 text-xs text-foreground/50">
              Shown below the logo in the &quot;Trusted By&quot; strip on the homepage.
            </p>
          </Card>

          <Card>
            <h3 className="font-display text-lg font-bold text-foreground">Publish</h3>

            <Toggle
              checked={data.published}
              onChange={(v) => update("published", v)}
              label="Published"
              hint="Visible on public site"
            />

            <Label htmlFor="order" className="mt-5">Display order</Label>
            <Input
              id="order"
              type="number"
              value={data.order}
              onChange={(e) => update("order", Number(e.target.value))}
              placeholder="1"
            />
            <p className="mt-1 text-xs text-foreground/50">
              Lower = appears first in the strip. Default: next available.
            </p>
          </Card>
        </div>

        {/* Right — logo upload */}
        <div>
          <Card>
            <h3 className="font-display text-lg font-bold text-foreground">Logo</h3>
            <p className="mt-1 text-xs text-foreground/60">
              Upload the client&apos;s logo. Recommended: PNG or SVG with transparent background, max 2MB.
            </p>

            {/* Preview / dropzone */}
            <div className="mt-4">
              {data.logoData ? (
                <div className="relative rounded-lg border border-border bg-secondary/30 p-6">
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"
                    aria-label="Remove logo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex items-center justify-center">
                    <img
                      src={data.logoData}
                      alt="Logo preview"
                      className="max-h-32 max-w-full object-contain"
                    />
                  </div>
                  <p className="mt-3 text-center text-xs text-foreground/50">
                    Logo preview
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/20 p-8 text-center transition-colors hover:border-primary/40 hover:bg-secondary/30 disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  ) : (
                    <Upload className="h-6 w-6 text-foreground/40" />
                  )}
                  <span className="mt-2 text-sm font-medium text-foreground/70">
                    {uploading ? "Processing…" : "Click to upload"}
                  </span>
                  <span className="mt-1 text-xs text-foreground/40">
                    PNG, JPG, SVG, or WebP — max 2MB
                  </span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={onFileChange}
                className="hidden"
              />

              {/* Allow replacing the logo if one is already uploaded */}
              {data.logoData && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-3 w-full rounded-lg border border-border py-2 text-xs font-medium text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
                >
                  Replace Logo
                </button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}

/* === Helpers === */
function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-border bg-white p-6">{children}</div>;
}

function Label({ htmlFor, children, className = "" }: { htmlFor?: string; children: React.ReactNode; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={`mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60 ${className}`}>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${props.className ?? ""}`}
    />
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
  className = "",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={`mt-4 flex items-center justify-between ${className}`}>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="text-xs text-foreground/50">{hint}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-foreground/20"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
