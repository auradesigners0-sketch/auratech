"use client";

import { useEffect, useState } from "react";
import type { PublicClient } from "@/app/api/clients/route";

/**
 * ClientsInfinity — "Trusted By" marquee strip.
 *
 * Loads client logos from /api/clients (admin-managed).
 * If no DB rows exist, falls back to the static `clients` array
 * (rendered as initials since there are no logo files).
 *
 * The strip is a seamless marquee — logos loop infinitely.
 */
export function ClientsInfinity() {
  const [clients, setClients] = useState<PublicClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => setClients(data.clients ?? []))
      .catch((e) => console.error("Clients load failed:", e))
      .finally(() => setLoading(false));
  }, []);

  // Duplicate the list for a seamless marquee loop
  const loop = [...clients, ...clients];

  return (
    <section
      id="clients"
      className="border-y border-border bg-secondary py-16 sm:py-20"
    >
      <div className="editorial mb-8 text-center sm:mb-10">
        <div data-reveal className="mb-4 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-primary" />
          <p className="kicker text-primary">Trusted By</p>
          <span className="h-px w-12 bg-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          Teams who scaled with Auratech
        </h2>
      </div>

      {/* Marquee strip — full-bleed */}
      <div className="relative overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-secondary to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-secondary to-transparent" />

        {loading ? (
          <div className="flex h-20 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          </div>
        ) : clients.length === 0 ? (
          <div className="flex h-20 items-center justify-center text-sm text-foreground/40">
            No clients yet.
          </div>
        ) : (
          <div className="flex w-max animate-marquee items-center gap-12 sm:gap-16">
            {loop.map((client, idx) => (
              <LogoTile
                key={`${client.id}-${idx}`}
                name={client.name}
                logoData={client.logoData}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function LogoTile({ name, logoData }: { name: string; logoData: string | null }) {
  // If we have a real logo image, show it
  if (logoData) {
    return (
      <div className="flex shrink-0 items-center gap-3 px-2 opacity-60 transition-opacity hover:opacity-100">
        <img
          src={logoData}
          alt={name}
          className="h-10 w-auto object-contain sm:h-12"
        />
        <span className="font-display text-base font-bold tracking-tight text-foreground/70 sm:text-lg">
          {name}
        </span>
      </div>
    );
  }

  // Fallback: initials in a colored box (used when no logo is uploaded)
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="flex shrink-0 items-center gap-3 px-2 opacity-50 transition-opacity hover:opacity-100">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 font-display text-sm font-bold text-primary sm:h-12 sm:w-12">
        {initials}
      </span>
      <span className="font-display text-base font-bold tracking-tight text-foreground/70 sm:text-lg">
        {name}
      </span>
    </div>
  );
}
