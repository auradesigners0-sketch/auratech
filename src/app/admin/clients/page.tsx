"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

type Client = {
  id: string;
  name: string;
  logoData: string;
  order: number;
  published: boolean;
  createdAt: string;
};

export default function AdminClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/admin/clients");
        const data = await r.json();
        if (data.error) throw new Error(data.error);
        setClients(data.clients || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const onDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
    if (res.ok) {
      setClients((c) => c.filter((x) => x.id !== id));
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
          <p className="kicker mb-2 text-primary">Clients</p>
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Client Logos
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Upload client logos to display in the &quot;Trusted By&quot; strip on the homepage.
          </p>
        </div>
        <Link
          href="/admin/clients/new"
          className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Client
        </Link>
      </div>

      {/* Grid of client cards */}
      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-border bg-white p-12">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : clients.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-12 text-center">
          <p className="text-sm text-foreground/60">No clients yet.</p>
          <Link
            href="/admin/clients/new"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Add your first client
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <div
              key={c.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-white p-5"
            >
              {/* Status badges */}
              <div className="absolute right-3 top-3 flex gap-1">
                {!c.published && (
                  <span className="rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-foreground/50">
                    Draft
                  </span>
                )}
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-foreground/50">
                  #{c.order}
                </span>
              </div>

              {/* Logo */}
              <div className="flex h-20 items-center justify-center rounded-lg bg-secondary/30 p-3">
                <img
                  src={c.logoData}
                  alt={c.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Name */}
              <p className="mt-3 truncate font-display text-sm font-bold text-foreground">
                {c.name}
              </p>

              {/* Actions */}
              <div className="mt-3 flex gap-2 border-t border-border pt-3">
                <button
                  onClick={() => router.push(`/admin/clients/${c.id}/edit`)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded border border-border py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(c.id, c.name)}
                  disabled={deletingId === c.id}
                  className="flex items-center justify-center rounded border border-border px-3 py-1.5 text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                  aria-label="Delete"
                >
                  {deletingId === c.id ? (
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
