"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Quote } from "lucide-react";

type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  photoData: string | null;
  order: number;
  published: boolean;
  createdAt: string;
};

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/admin/testimonials");
        const data = await r.json();
        if (data.error) throw new Error(data.error);
        setTestimonials(data.testimonials || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const onDelete = async (id: string, author: string) => {
    if (!confirm(`Delete testimonial from "${author}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTestimonials((t) => t.filter((x) => x.id !== id));
    } else {
      alert("Failed to delete. Try again.");
    }
    setDeletingId(null);
  };

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="kicker mb-2 text-primary">Testimonials</p>
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Client Testimonials
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Add and manage client testimonials shown on the homepage.
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Testimonial
        </Link>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-border bg-white p-12">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-12 text-center">
          <Quote className="mx-auto mb-3 h-8 w-8 text-foreground/30" />
          <p className="text-sm text-foreground/60">No testimonials yet.</p>
          <Link
            href="/admin/testimonials/new"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Add your first testimonial
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-white p-5"
            >
              {/* Status badges */}
              <div className="absolute right-3 top-3 flex gap-1">
                {!t.published && (
                  <span className="rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-foreground/50">
                    Draft
                  </span>
                )}
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-foreground/50">
                  #{t.order}
                </span>
              </div>

              {/* Quote */}
              <div className="flex gap-3">
                {/* Photo */}
                <div className="shrink-0">
                  {t.photoData ? (
                    <img
                      src={t.photoData}
                      alt={t.author}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                      {t.author[0]}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-3 text-sm italic text-foreground/80">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="mt-2 font-display text-sm font-bold text-foreground">
                    {t.author}
                  </p>
                  <p className="text-xs text-foreground/50">
                    {t.role}{t.role && t.company ? ", " : ""}{t.company}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2 border-t border-border pt-3">
                <button
                  onClick={() => router.push(`/admin/testimonials/${t.id}/edit`)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded border border-border py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(t.id, t.author)}
                  disabled={deletingId === t.id}
                  className="flex items-center justify-center rounded border border-border px-3 py-1.5 text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                  aria-label="Delete"
                >
                  {deletingId === t.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
