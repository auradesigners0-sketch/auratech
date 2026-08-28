"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ClientForm } from "@/components/admin/client-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { Loader2, AlertCircle } from "lucide-react";

type ClientData = {
  name: string;
  logoData: string;
  published: boolean;
  order: number;
};

export default function EditClientPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/clients/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setClient(data.client);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return (
      <AdminShell>
        <p className="text-sm text-foreground/60">Missing client ID.</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <p className="kicker mb-2 text-primary">Edit Client</p>
      <h1 className="mb-8 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
        Edit Client Logo
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
      ) : client ? (
        <ClientForm initial={client} clientId={id} />
      ) : null}
    </AdminShell>
  );
}
