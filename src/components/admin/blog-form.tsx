"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, ArrowLeft, Save, Eye, PenLine } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ImageUpload } from "./image-upload";

type BlogPostData = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  coverImage: string | null;
  published: boolean;
};

const empty: BlogPostData = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  category: "Insights",
  date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
  readTime: "5 min read",
  coverImage: null,
  published: true,
};

export function BlogForm({ initial, postId }: { initial?: BlogPostData; postId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<BlogPostData>(initial ?? empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"write" | "preview">("write");

  const update = <K extends keyof BlogPostData>(k: K, v: BlogPostData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

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

    const url = postId ? `/api/admin/blog/${postId}` : "/api/admin/blog";
    const method = postId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Save failed");
      router.push("/admin/blog");
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
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Blog
        </Link>
        <button
          type="submit"
          disabled={saving || !data.title || !data.slug}
          className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {postId ? "Save Changes" : "Publish"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Left — editor + content */}
        <div className="space-y-6">
          <Card>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Why we build with Next.js"
              required
            />

            <Label htmlFor="slug" className="mt-5">Slug *</Label>
            <Input
              id="slug"
              value={data.slug}
              onChange={(e) => update("slug", slugify(e.target.value))}
              placeholder="why-we-build-with-next-js"
              required
            />

            <Label htmlFor="excerpt" className="mt-5">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={data.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              rows={2}
              placeholder="One-sentence summary shown on blog cards."
            />
          </Card>

          {/* Markdown editor */}
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <Label className="!mb-0">Content (Markdown)</Label>
              <div className="flex rounded-md border border-border">
                <button
                  type="button"
                  onClick={() => setView("write")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                    view === "write" ? "bg-primary text-white" : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  <PenLine className="h-3 w-3" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setView("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                    view === "preview" ? "bg-primary text-white" : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  <Eye className="h-3 w-3" />
                  Preview
                </button>
              </div>
            </div>

            {view === "write" ? (
              <textarea
                value={data.content}
                onChange={(e) => update("content", e.target.value)}
                rows={20}
                placeholder={"# Heading\n\nWrite your post in **Markdown**.\n\n- Use lists\n- Use **bold** and *italic*\n- Use `code` blocks"}
                className="w-full resize-y rounded-lg border border-border bg-white px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            ) : (
              <article className="prose prose-sm max-w-none rounded-lg border border-border bg-secondary/30 p-6">
                {data.content ? (
                  <ReactMarkdown>{data.content}</ReactMarkdown>
                ) : (
                  <p className="text-foreground/40 italic">Nothing to preview yet.</p>
                )}
              </article>
            )}

            <p className="mt-2 text-xs text-foreground/50">
              Tip: Markdown supports <code className="rounded bg-secondary px-1"># headings</code>,{" "}
              <code className="rounded bg-secondary px-1">**bold**</code>,{" "}
              <code className="rounded bg-secondary px-1">*italic*</code>,{" "}
              <code className="rounded bg-secondary px-1">- lists</code>,{" "}
              <code className="rounded bg-secondary px-1">`code`</code>, and more.
            </p>
          </Card>
        </div>

        {/* Right — meta */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-display text-lg font-bold text-foreground">Publish</h3>

            <Toggle
              checked={data.published}
              onChange={(v) => update("published", v)}
              label="Published"
              hint="Visible on public blog"
            />

            <Label htmlFor="category" className="mt-5">Category</Label>
            <Input
              id="category"
              value={data.category}
              onChange={(e) => update("category", e.target.value)}
              placeholder="Engineering"
            />

            <Label htmlFor="date" className="mt-5">Display date</Label>
            <Input
              id="date"
              value={data.date}
              onChange={(e) => update("date", e.target.value)}
              placeholder="Aug 2026"
            />

            <Label htmlFor="readTime" className="mt-5">Read time</Label>
            <Input
              id="readTime"
              value={data.readTime}
              onChange={(e) => update("readTime", e.target.value)}
              placeholder="5 min read"
            />
          </Card>

          <Card>
            <h3 className="font-display text-lg font-bold text-foreground">Cover Image</h3>
            <div className="mt-4">
              <ImageUpload
                value={data.coverImage}
                onChange={(url) => update("coverImage", url)}
                placeholder="Click to upload cover image"
                aspectRatio="aspect-video"
                maxSizeText="Max 2MB · PNG, JPG, SVG, WebP"
              />
              <p className="mt-2 text-xs text-foreground/50">
                Shown at the top of the blog post. Upload directly from your computer.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
