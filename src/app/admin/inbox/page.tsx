"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Loader2, AlertCircle, Mail, Trash2 } from "lucide-react";

type Submission = {
  id: string;
  name: string | null;
  email: string;
  projectType: string | null;
  budget: string | null;
  message: string | null;
  createdAt: string;
};

export default function AdminInboxPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/admin/inbox");
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setItems(data.submissions || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8">
        <p className="kicker mb-2 text-primary">Inbox</p>
        <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Contact Submissions
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          All messages submitted via the public contact form.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-border bg-white p-12">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-12 text-center">
          <Mail className="mx-auto mb-3 h-8 w-8 text-foreground/30" />
          <p className="text-sm text-foreground/60">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-border bg-white p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="font-display text-lg font-bold text-foreground">
                    {s.name || <span className="text-foreground/40">Anonymous</span>}
                  </span>
                  <span className="ml-3 text-sm text-foreground/60">{s.email}</span>
                </div>
                <span className="text-xs text-foreground/40">
                  {new Date(s.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Tags */}
              {(s.projectType || s.budget) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {s.projectType && (
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {s.projectType}
                    </span>
                  )}
                  {s.budget && (
                    <span className="rounded bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                      Budget: {s.budget}
                    </span>
                  )}
                </div>
              )}

              {/* Message */}
              {s.message && (
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                  {s.message}
                </p>
              )}

              {/* Reply link */}
              <a
                href={`mailto:${s.email}?subject=Re: Your project inquiry&body=Hi ${s.name || "there"},%0D%0A%0D%0AThanks for reaching out to Auratech.`}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <Mail className="h-3 w-3" />
                Reply via email
              </a>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
