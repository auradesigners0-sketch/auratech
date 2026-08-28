"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { Loader2, AlertCircle } from "lucide-react";

type TestimonialData = {
  quote: string;
  author: string;
  role: string;
  company: string;
  photoData: string | null;
  published: boolean;
  order: number;
};

export default function EditTestimonialPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [testimonial, setTestimonial] = useState<TestimonialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/testimonials/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setTestimonial(data.testimonial);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return (
      <AdminShell>
        <p className="text-sm text-foreground/60">Missing testimonial ID.</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <p className="kicker mb-2 text-primary">Edit Testimonial</p>
      <h1 className="mb-8 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
        Edit Testimonial
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
      ) : testimonial ? (
        <TestimonialForm initial={testimonial} testimonialId={id} />
      ) : null}
    </AdminShell>
  );
}
