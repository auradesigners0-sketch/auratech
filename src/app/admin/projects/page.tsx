"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  tag: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: string;
};

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/admin/projects");
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setProjects(data.projects || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((p) => p.filter((x) => x.id !== id));
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
          <p className="kicker mb-2 text-primary">Projects</p>
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            All Projects
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            The 3 most recent projects (by display order) appear on the homepage.
            All published projects appear on the /projects page.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          New
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
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-12 text-center">
          <p className="text-sm text-foreground/60">No projects yet.</p>
          <Link
            href="/admin/projects/new"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                <th className="px-4 py-3 font-medium text-foreground/60">Title</th>
                <th className="px-4 py-3 font-medium text-foreground/60">Category</th>
                <th className="px-4 py-3 font-medium text-foreground/60">Tag</th>
                <th className="px-4 py-3 font-medium text-foreground/60">Order</th>
                <th className="px-4 py-3 font-medium text-foreground/60">Status</th>
                <th className="px-4 py-3 font-medium text-foreground/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{p.title}</span>
                      {p.featured && (
                        <span
                          title="Shown on homepage"
                          className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent"
                        >
                          ★ Homepage
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-foreground/40">/{p.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">{p.category}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-foreground/70">
                      {p.tag}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">{p.order}</td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#22C55E]">
                        <Eye className="h-3 w-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/50">
                        <EyeOff className="h-3 w-3" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => router.push(`/admin/projects/${p.id}/edit`)}
                        className="flex h-8 w-8 items-center justify-center rounded text-primary transition-colors hover:bg-primary/10"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(p.id, p.title)}
                        disabled={deletingId === p.id}
                        className="flex h-8 w-8 items-center justify-center rounded text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                        aria-label="Delete"
                      >
                        {deletingId === p.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
