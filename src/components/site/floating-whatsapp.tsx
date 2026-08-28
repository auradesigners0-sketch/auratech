"use client";

import { useEffect, useState } from "react";

/**
 * FloatingWhatsApp — fixed bottom-right round WhatsApp button shown on
 * every page. Hover reveals a "Chat with us" tooltip.
 *
 * Brand palette: WhatsApp green (#25D366) is used for the icon background
 * to preserve recognizability; the hover ring uses our brand primary
 * (deep green) so it harmonizes with the rest of the site.
 *
 * The button is hidden until the user scrolls past ~120px so it doesn't
 * overlap awkwardly with the hero's CTA cluster on initial load.
 */
export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="https://wa.me/255613400250"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`group fixed bottom-5 right-5 z-50 flex items-center transition-all duration-500 sm:bottom-7 sm:right-7 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {/* Tooltip — "Chat with us" — hidden on small screens */}
      <span className="pointer-events-none mr-3 hidden whitespace-nowrap rounded-full border border-primary/20 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 md:block">
        Chat with us
      </span>

      {/* Circular button — WhatsApp green with subtle pulse ring */}
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16">
        {/* Pulse ring — pulses twice to draw attention, then settles */}
        <span
          className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-30"
          aria-hidden="true"
          style={{ animationDuration: "2.5s", animationIterationCount: "infinite" }}
        />
        {/* Official WhatsApp glyph (simplified) */}
        <svg
          viewBox="0 0 32 32"
          className="h-7 w-7 fill-white sm:h-8 sm:w-8"
          aria-hidden="true"
        >
          <path d="M16.001 5.333c-5.89 0-10.668 4.778-10.668 10.668 0 1.88.493 3.713 1.43 5.332L5.333 26.667l5.522-1.43a10.62 10.62 0 0 0 5.146 1.315h.001c5.89 0 10.668-4.778 10.668-10.668S21.891 5.333 16.001 5.333zm0 19.55h-.001a8.83 8.83 0 0 1-4.499-1.233l-.323-.192-3.348.868.895-3.262-.21-.335a8.83 8.83 0 0 1-1.354-4.728c0-4.873 3.965-8.838 8.84-8.838 2.361 0 4.58.92 6.249 2.59a8.78 8.78 0 0 1 2.589 6.25c0 4.873-3.965 8.838-8.838 8.838zm4.847-6.612c-.266-.133-1.572-.775-1.816-.863-.244-.089-.421-.133-.599.133-.177.266-.687.863-.842 1.041-.155.177-.31.2-.576.066-.266-.133-1.123-.414-2.139-1.32-.791-.706-1.324-1.577-1.479-1.843-.155-.266-.016-.41.117-.543.12-.12.266-.31.4-.466.133-.155.177-.266.266-.443.089-.177.044-.332-.022-.466-.066-.133-.599-1.444-.82-1.977-.216-.518-.435-.448-.599-.456l-.51-.01c-.177 0-.466.066-.71.332-.244.266-.93.91-.93 2.22 0 1.31.953 2.573 1.086 2.751.133.177 1.873 2.86 4.535 4.008.634.274 1.129.437 1.515.56.637.203 1.215.174 1.673.105.51-.076 1.572-.642 1.793-1.263.221-.62.221-1.151.155-1.263-.066-.111-.244-.177-.51-.31z" />
        </svg>
      </span>
    </a>
  );
}
