"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { ClientForm } from "@/components/admin/client-form";

export default function NewClientPage() {
  return (
    <AdminShell>
      <p className="kicker mb-2 text-primary">New Client</p>
      <h1 className="mb-8 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
        Add a Client Logo
      </h1>
      <ClientForm />
    </AdminShell>
  );
}
