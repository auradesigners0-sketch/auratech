"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { FolderKanban, FileText, Inbox, Plus, ArrowRight, MessageSquareQuote, Users } from "lucide-react";

type Stats = {
  projects: number;
  blogPosts: number;
  testimonials: number;
  clients: number;
  contactSubmissions: number;
  recentSubmissions: {
    id: string;
    name: string | null;
    email: string;
    projectType: string | null;
    createdAt: string;
  }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="kicker mb-2 text-primary">Dashboard</p>
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Welcome back.
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New Project
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 border border-primary/40 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary transition-colors hover:bg-primary hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            New Post
          </Link>
        </div>
      </div>

      {/* Stats grid — 5 cards showing all content types */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={FolderKanban}
          label="Projects"
          value={loading ? "—" : String(stats?.projects ?? 0)}
          href="/admin/projects"
        />
        <StatCard
          icon={FileText}
          label="Blog Posts"
          value={loading ? "—" : String(stats?.blogPosts ?? 0)}
          href="/admin/blog"
        />
        <StatCard
          icon={MessageSquareQuote}
          label="Testimonials"
          value={loading ? "—" : String(stats?.testimonials ?? 0)}
          href="/admin/testimonials"
        />
        <StatCard
          icon={Users}
          label="Clients"
          value={loading ? "—" : String(stats?.clients ?? 0)}
          href="/admin/clients"
        />
        <StatCard
          icon={Inbox}
          label="Inbox"
          value={loading ? "—" : String(stats?.contactSubmissions ?? 0)}
          href="/admin/inbox"
        />
      </div>

      {/* Recent submissions */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">
            Recent Contact Submissions
          </h2>
          <Link
            href="/admin/inbox"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="rounded-xl border border-border bg-white p-8 text-center text-sm text-foreground/50">
            Loading…
          </div>
        ) : stats?.recentSubmissions?.length ? (
          <div className="overflow-hidden rounded-xl border border-border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-foreground/60">Name</th>
                  <th className="px-4 py-3 font-medium text-foreground/60">Email</th>
                  <th className="px-4 py-3 font-medium text-foreground/60">Project Type</th>
                  <th className="px-4 py-3 font-medium text-foreground/60">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.recentSubmissions.map((s) => (
                  <tr key={s.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {s.name || <span className="text-foreground/40">—</span>}
                    </td>
                    <td className="px-4 py-3 text-foreground/70">{s.email}</td>
                    <td className="px-4 py-3 text-foreground/70">
                      {s.projectType || <span className="text-foreground/40">—</span>}
                    </td>
                    <td className="px-4 py-3 text-foreground/60">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-white p-8 text-center text-sm text-foreground/50">
            No contact submissions yet.
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-border bg-white p-5 transition-all hover:border-primary/40 hover:shadow-md"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-3xl font-extrabold text-foreground">{value}</p>
        <p className="kicker mt-1 text-foreground/60">{label}</p>
      </div>
    </Link>
  );
}
