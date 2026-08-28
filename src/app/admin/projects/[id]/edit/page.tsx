"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { Loader2, AlertCircle } from "lucide-react";

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
  featured: boolean;
  published: boolean;
  order: number;
};

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setProject(data.project);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return (
      <AdminShell>
        <p className="text-sm text-foreground/60">Missing project ID.</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <p className="kicker mb-2 text-primary">Edit Project</p>
      <h1 className="mb-8 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
        Edit Project
      </h1>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-border bg-white p-12">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : project ? (
        <ProjectForm initial={project} projectId={id} />
      ) : null}
    </AdminShell>
  );
}
