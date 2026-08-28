"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, ArrowLeft, Save } from "lucide-react";
import { ImageUpload } from "./image-upload";

type TestimonialData = {
  quote: string;
  author: string;
  role: string;
  company: string;
  photoData: string | null;
  published: boolean;
  order: number;
};

const empty: TestimonialData = {
  quote: "",
  author: "",
  role: "",
  company: "",
  photoData: null,
  published: true,
  order: 0,
};

export function TestimonialForm({ initial, testimonialId }: { initial?: TestimonialData; testimonialId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<TestimonialData>(initial ?? empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof TestimonialData>(k: K, v: TestimonialData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = testimonialId ? `/api/admin/testimonials/${testimonialId}` : "/api/admin/testimonials";
    const method = testimonialId ? "PUT" : "POST";

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
      router.push("/admin/testimonials");
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
          href="/admin/testimonials"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Testimonials
        </Link>
        <button
          type="submit"
          disabled={saving || !data.quote || !data.author}
          className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {testimonialId ? "Save Changes" : "Add Testimonial"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left — main content */}
        <div className="space-y-6">
          <Card>
            <Label htmlFor="quote">Quote *</Label>
            <textarea
              id="quote"
              value={data.quote}
              onChange={(e) => update("quote", e.target.value)}
              rows={5}
              required
              placeholder="What did the client say about working with you?"
              className="w-full resize-y rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-xs text-foreground/50">
              The full testimonial quote. Keep it natural and specific.
            </p>

            <Label htmlFor="author" className="mt-5">Author Name *</Label>
            <Input
              id="author"
              value={data.author}
              onChange={(e) => update("author", e.target.value)}
              placeholder="e.g. Dr. Amani Mushi"
              required
            />

            <Label htmlFor="role" className="mt-5">Role / Title</Label>
            <Input
              id="role"
              value={data.role}
              onChange={(e) => update("role", e.target.value)}
              placeholder="e.g. Medical Director"
            />

            <Label htmlFor="company" className="mt-5">Company</Label>
            <Input
              id="company"
              value={data.company}
              onChange={(e) => update("company", e.target.value)}
              placeholder="e.g. Verdant Polyclinic Group"
            />
          </Card>
        </div>

        {/* Right — photo + publish settings */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-display text-lg font-bold text-foreground">Photo</h3>
            <p className="mt-1 text-xs text-foreground/60">
              Upload a photo of the person giving the testimonial (optional but recommended).
            </p>
            <div className="mt-4">
              <ImageUpload
                value={data.photoData}
                onChange={(url) => update("photoData", url)}
                placeholder="Click to upload photo"
                aspectRatio="aspect-square"
                maxSizeText="Max 2MB · PNG, JPG, WebP"
              />
            </div>
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
              Lower = appears first. Default: next available.
            </p>
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
