"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export default function NewTestimonialPage() {
  return (
    <AdminShell>
      <p className="kicker mb-2 text-primary">New Testimonial</p>
      <h1 className="mb-8 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
        Add a Testimonial
      </h1>
      <TestimonialForm />
    </AdminShell>
  );
}
