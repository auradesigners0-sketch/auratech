"use client";

import { AdminShell } from "@/components/admin/admin-shell";
import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPostPage() {
  return (
    <AdminShell>
      <p className="kicker mb-2 text-primary">New Post</p>
      <h1 className="mb-8 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
        Write a Blog Post
      </h1>
      <BlogForm />
    </AdminShell>
  );
}
