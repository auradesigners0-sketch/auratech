"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { Loader2 } from "lucide-react";

export default function NewProjectPage() {
  return (
    <AdminShell>
      <p className="kicker mb-2 text-primary">New Project</p>
      <h1 className="mb-8 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
        Create a Project
      </h1>
      <ProjectForm />
    </AdminShell>
  );
}
