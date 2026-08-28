"use client";

/**
 * AnimatedBackground — subtle moving gradient orbs that float slowly
 * in the background of the homepage hero section.
 *
 * Design:
 *  - 3 large blurred orbs (deep green, lime, lighter green)
 *  - Each orb drifts on its own slow random path via CSS animations
 *  - Very low opacity so it never distracts from content
 *  - Hidden on mobile (performance + visual clutter)
 *
 * Purely decorative — pointer-events: none, aria-hidden.
 */
export function AnimatedBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Orb 1 — deep green, top-left, slow drift right-down */}
      <div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl"
        style={{
          animation: "orbDrift1 20s ease-in-out infinite",
        }}
      />

      {/* Orb 2 — lime accent, top-right, drifts left-down */}
      <div
        className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
        style={{
          animation: "orbDrift2 25s ease-in-out infinite",
        }}
      />

      {/* Orb 3 — lighter green, bottom-center, drifts up */}
      <div
        className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#2A5A47]/12 blur-3xl"
        style={{
          animation: "orbDrift3 18s ease-in-out infinite",
        }}
      />

      {/* Tiny floating dots — scattered, very subtle */}
      <div className="absolute inset-0">
        {[
          { left: "10%", top: "20%", delay: "0s", duration: "8s" },
          { left: "25%", top: "60%", delay: "2s", duration: "10s" },
          { left: "45%", top: "30%", delay: "1s", duration: "9s" },
          { left: "65%", top: "70%", delay: "3s", duration: "11s" },
          { left: "80%", top: "25%", delay: "1.5s", duration: "8.5s" },
          { left: "90%", top: "55%", delay: "2.5s", duration: "9.5s" },
          { left: "15%", top: "80%", delay: "0.5s", duration: "10.5s" },
          { left: "55%", top: "15%", delay: "3.5s", duration: "8s" },
        ].map((dot, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-primary/20"
            style={{
              left: dot.left,
              top: dot.top,
              animation: `floatDot ${dot.duration} ease-in-out ${dot.delay} infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
