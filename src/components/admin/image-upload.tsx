"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

/**
 * ImageUpload — reusable file upload component that converts the selected
 * image to a base64 data URL and stores it directly in the database.
 *
 * Why base64 instead of file storage?
 *  - Works on any host (Netlify, Vercel, etc.) — no external storage service
 *  - No CORS issues, no CDN configuration
 *  - Perfect for small images (logos, thumbnails, cover photos)
 *  - Tradeoff: uses database storage (~50-200KB per image)
 *
 * Used by:
 *  - Client logo upload (admin/clients)
 *  - Project thumbnail upload (admin/projects)
 *  - Blog cover image upload (admin/blog)
 */
const MAX_FILE_SIZE = 2_000_000; // 2MB — allows higher quality images

export function ImageUpload({
  value,
  onChange,
  label,
  placeholder = "Click to upload",
  aspectRatio = "aspect-video",
  maxSizeText = "Max 2MB · PNG, JPG, SVG, WebP",
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  label?: string;
  placeholder?: string;
  aspectRatio?: string;
  maxSizeText?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, SVG, or WebP).");
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError(
        `File is too large (${(file.size / 1024).toFixed(0)} KB). Maximum is ${MAX_FILE_SIZE / 1000} KB.`
      );
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        onChange(result);
        setUploading(false);
      };
      reader.onerror = () => {
        setError("Failed to read the file. Please try again.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to process the image. Please try a different file.");
      setUploading(false);
    }
  };

  const removeImage = () => {
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      {label && (
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">
          {label}
        </label>
      )}

      {error && (
        <p className="mb-2 text-sm text-destructive">{error}</p>
      )}

      {value ? (
        <div className={`relative ${aspectRatio} overflow-hidden rounded-lg border border-border bg-secondary/30`}>
          <button
            type="button"
            onClick={removeImage}
            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <img
            src={value}
            alt="Preview"
            className="h-full w-full object-contain"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`flex ${aspectRatio} w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/20 transition-colors hover:border-primary/40 hover:bg-secondary/30 disabled:opacity-50`}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <Upload className="h-6 w-6 text-foreground/40" />
          )}
          <span className="mt-2 text-sm font-medium text-foreground/70">
            {uploading ? "Processing…" : placeholder}
          </span>
          <span className="mt-1 text-xs text-foreground/40">
            {maxSizeText}
          </span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        onChange={onFileChange}
        className="hidden"
      />

      {value && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mt-2 w-full rounded-lg border border-border py-2 text-xs font-medium text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
        >
          Replace Image
        </button>
      )}
    </div>
  );
}
