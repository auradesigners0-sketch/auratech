"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, ArrowLeft, Save } from "lucide-react";
import { ImageUpload } from "./image-upload";

type ProjectData = {
  slug: string;
  title: string;
  category: string;
  description: string;
  tag: string;
  accent: string;
  brief: string;
  challenges: string;
  solution: string;
  results: string;
  thumbnail: string | null;
  previewUrl: string | null;
  featured: boolean;
  published: boolean;
  order: number;
};

const empty: ProjectData = {
  slug: "",
  title: "",
  category: "Project",
  description: "",
  tag: "Web",
  accent: "from-[#1B4332] to-[#143A2B]",
  brief: "",
  challenges: "",
  solution: "",
  results: "",
  thumbnail: null,
  previewUrl: null,
  featured: false,
  published: true,
  order: 0,
};

const ACCENT_PRESETS = [
  { label: "Deep green", value: "from-[#1B4332] to-[#143A2B]" },
  { label: "Darker green", value: "from-[#1B4332] to-[#0F2D20]" },
  { label: "Lime → green", value: "from-[#7ED957] to-[#1B4332]" },
  { label: "Lime → dark", value: "from-[#7ED957] to-[#143A2B]" },
];

export function ProjectForm({ initial, projectId }: { initial?: ProjectData; projectId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<ProjectData>(initial ?? empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProjectData>(k: K, v: ProjectData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  // Auto-generate slug from title (only if slug is empty or matches the previous auto-slug)
  const onTitleChange = (title: string) => {
    update("title", title);
    if (!initial || data.slug === "" || data.slug === slugify(initial.title)) {
      update("slug", slugify(title));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = projectId ? `/api/admin/projects/${projectId}` : "/api/admin/projects";
    const method = projectId ? "PUT" : "POST";

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
      router.push("/admin/projects");
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
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Projects
        </Link>
        <button
          type="submit"
          disabled={saving || !data.title || !data.slug}
          className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {projectId ? "Save Changes" : "Create Project"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Main grid — 2-col layout on desktop */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left — main content */}
        <div className="space-y-6">
          <Card>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. ABC Global Church"
              required
            />

            <Label htmlFor="slug" className="mt-5">Slug *</Label>
            <Input
              id="slug"
              value={data.slug}
              onChange={(e) => update("slug", slugify(e.target.value))}
              placeholder="abc-global-church"
              required
            />
            <p className="mt-1 text-xs text-foreground/50">
              Used in the URL: <code className="rounded bg-secondary px-1.5 py-0.5">/projects/{data.slug || "..."}</code>
            </p>

            <Label htmlFor="category" className="mt-5">Category</Label>
            <Input
              id="category"
              value={data.category}
              onChange={(e) => update("category", e.target.value)}
              placeholder="Church & Community Platform"
            />

            <Label htmlFor="description" className="mt-5">
              Description <span className="text-foreground/40">(short teaser shown on card)</span>
            </Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              placeholder="A modern web platform for a global church — live streaming, sermon library…"
            />
          </Card>

          <Card>
            <h3 className="font-display text-lg font-bold text-foreground">Case Study Details</h3>
            <p className="mt-1 text-xs text-foreground/60">
              Shown on the project detail page when a visitor clicks a card.
            </p>

            <Label htmlFor="brief" className="mt-4">Brief</Label>
            <Textarea
              id="brief"
              value={data.brief}
              onChange={(e) => update("brief", e.target.value)}
              rows={2}
              placeholder="One-sentence summary of what was built."
            />

            <Label htmlFor="challenges" className="mt-4">Challenges</Label>
            <Textarea
              id="challenges"
              value={data.challenges}
              onChange={(e) => update("challenges", e.target.value)}
              rows={4}
              placeholder="What problem was the client facing?"
            />

            <Label htmlFor="solution" className="mt-4">Solution</Label>
            <Textarea
              id="solution"
              value={data.solution}
              onChange={(e) => update("solution", e.target.value)}
              rows={4}
              placeholder="What did you build? How does it work?"
            />

            <Label htmlFor="results" className="mt-4">Results</Label>
            <Textarea
              id="results"
              value={data.results}
              onChange={(e) => update("results", e.target.value)}
              rows={3}
              placeholder="Measurable outcomes — percentages, numbers, timelines."
            />
          </Card>
        </div>

        {/* Right — meta / publish controls */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-display text-lg font-bold text-foreground">Publish</h3>

            <Toggle
              checked={data.published}
              onChange={(v) => update("published", v)}
              label="Published"
              hint="Visible on public site"
            />

            <Toggle
              checked={data.featured}
              onChange={(v) => update("featured", v)}
              label="Featured"
              hint="Highlights the project (optional — all projects show on homepage based on order)"
              className="mt-3"
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

          <Card>
            <h3 className="font-display text-lg font-bold text-foreground">Card Style</h3>

            <Label htmlFor="tag" className="mt-4">Tag</Label>
            <Input
              id="tag"
              value={data.tag}
              onChange={(e) => update("tag", e.target.value)}
              placeholder="Web"
            />

            <Label className="mt-5">Accent gradient</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {ACCENT_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.value}
                  onClick={() => update("accent", preset.value)}
                  className={`flex items-center gap-2 rounded-lg border p-2 text-left text-xs transition-colors ${
                    data.accent === preset.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className={`h-6 w-6 rounded bg-gradient-to-br ${preset.value}`} />
                  <span className="font-medium text-foreground/80">{preset.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-5">
              <ImageUpload
                label="Thumbnail image (optional)"
                value={data.thumbnail}
                onChange={(url) => update("thumbnail", url)}
                placeholder="Click to upload thumbnail"
                aspectRatio="aspect-video"
                maxSizeText="Max 2MB · PNG, JPG, SVG, WebP"
              />
              <p className="mt-1 text-xs text-foreground/50">
                Shown on the project card. Upload directly from your computer.
              </p>
            </div>

            <Label htmlFor="previewUrl" className="mt-5">
              Live Project URL <span className="text-foreground/40">(optional)</span>
            </Label>
            <Input
              id="previewUrl"
              type="url"
              value={data.previewUrl ?? ""}
              onChange={(e) => update("previewUrl", e.target.value || null)}
              placeholder="https://abcchurch.com"
            />
            <p className="mt-1 text-xs text-foreground/50">
              Link to the live project. The &quot;View Project&quot; button on the
              case study page opens this in a new tab.
            </p>
          </Card>
        </div>
      </div>
    </form>
  );
}

/* === Helpers === */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* === Small presentational primitives === */
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

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full resize-y rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${props.className ?? ""}`}
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
    <div className={`flex items-center justify-between ${className}`}>
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
