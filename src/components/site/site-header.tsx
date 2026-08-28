"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks, contactInfo, socialLinks as socialLinksData } from "@/lib/site-content";
import { usePage, type PageId } from "./page-context";

const socialLinks = [
  { label: "WhatsApp", href: socialLinksData.whatsapp },
  { label: "LinkedIn", href: socialLinksData.linkedin },
  { label: "Instagram", href: socialLinksData.instagram },
  { label: "Facebook", href: socialLinksData.facebook },
];

/**
 * Fixed header — transparent over the hero, turns solid (cream/white)
 * once the user scrolls. Shows a green logo on the left and a
 * "MENU" + hamburger trigger on the right on ALL devices (desktop
 * and mobile).
 *
 * When the overlay popup is open:
 *   - The header stays on top (z-60 > popup z-50)
 *   - The logo is hidden
 *   - The hamburger morphs into an X (close) icon
 *   - The X has a WHITE background pill + DARK GREEN icon
 *   - Clicking the X closes the popup
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { setPage } = usePage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the overlay is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (p: PageId) => {
    setPage(p);
    setOpen(false);
  };

  const toggle = () => setOpen((v) => !v);

  // The menu trigger button shows the hamburger (closed) or X (open).
  // Open state: white pill bg + dark green icon
  // Closed + scrolled: dark green pill bg + white icon
  // Closed + top: no bg, sage green icon
  const pillOpen = open;
  const pillScrolled = scrolled && !open;

  return (
    <>
      {/* ====== Fixed header bar (always above popup) ====== */}
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
          scrolled || open ? "py-3" : "bg-transparent py-6"
        }`}
      >
        <div className="container-site flex items-center justify-between">
          {/* Logo — hidden when scrolled OR when popup is open */}
          <button
            onClick={() => go("home")}
            className={`block transition-opacity hover:opacity-80 ${
              scrolled || open
                ? "pointer-events-none opacity-0"
                : "pointer-events-auto opacity-100"
            }`}
            aria-label="Auratech home"
            tabIndex={scrolled || open ? -1 : 0}
          >
            <Image
              src="/logos/auratech-wordmark.png"
              alt="Auratech"
              width={1850}
              height={368}
              priority
              className="h-7 w-auto sm:h-8"
            />
          </button>

          {/* Menu trigger — morphs hamburger ↔ X */}
          <button
            onClick={toggle}
            className={`group inline-flex items-center gap-3 rounded-full px-5 py-2.5 transition-all duration-300 ${
              pillOpen
                ? "bg-white text-[#1B4332] hover:bg-white/90"
                : pillScrolled
                ? "bg-[#1B4332] text-white hover:bg-[#143A2B]"
                : "bg-transparent text-primary hover:text-primary/70"
            }`}
            style={{ marginLeft: scrolled || open ? "auto" : undefined }}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className={`kicker hidden sm:inline ${
                pillOpen ? "text-[#1B4332]" : pillScrolled ? "text-white" : "text-primary"
              }`}
            >
              {open ? "Close" : "Menu"}
            </span>

            {/* Hamburger ↔ X icon */}
            <span className="relative flex h-5 w-7 items-center justify-center">
              <span
                className="absolute left-0 h-px w-7 transition-all duration-300"
                style={{
                  backgroundColor: pillOpen
                    ? "#1B4332"
                    : pillScrolled
                    ? "#ffffff"
                    : "#1B4332",
                  transform: pillOpen
                    ? "rotate(45deg) translateY(0)"
                    : "rotate(0deg) translateY(-4px)",
                }}
              />
              <span
                className="absolute left-0 h-px w-7 transition-all duration-300"
                style={{
                  backgroundColor: pillOpen
                    ? "#1B4332"
                    : pillScrolled
                    ? "#ffffff"
                    : "#1B4332",
                  transform: pillOpen
                    ? "rotate(-45deg) translateY(0)"
                    : "rotate(0deg) translateY(4px)",
                }}
              />
            </span>
          </button>
        </div>
      </header>

      {/* ====== Full-screen green overlay pop-up (below header) ====== */}
      <div
        className={`fixed inset-0 z-50 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop that slides down from the top */}
        <div
          className="absolute inset-0 bg-[#1B4332]"
          style={{
            transform: open ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)",
          }}
        />

        {/* Content */}
        <div className="relative flex h-full flex-col">
          <nav className="flex flex-1 items-center px-6 sm:px-10 lg:px-16">
            <div className="grid w-full gap-12 lg:grid-cols-[2fr_1fr] lg:gap-20">
              {/* Nav links */}
              <ul className="space-y-2">
                {navLinks.map((link, idx) => (
                  <li
                    key={link.href}
                    style={{
                      transitionDelay: open ? `${250 + idx * 70}ms` : "0ms",
                    }}
                    className={`transition-all duration-500 ${
                      open
                        ? "translate-y-0 opacity-100"
                        : "translate-y-6 opacity-0"
                    }`}
                  >
                    <button
                      onClick={() => go(link.href as PageId)}
                      className="group flex items-baseline gap-5 py-1 text-white"
                    >
                      <span className="kicker text-white/40">
                        0{idx + 1}
                      </span>
                      <span className="font-display text-4xl font-extrabold tracking-tight text-white transition-all duration-300 group-hover:translate-x-2 group-hover:text-white/70 sm:text-5xl lg:text-6xl">
                        {link.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Right column — brand info */}
              <div
                className={`hidden flex-col justify-between border-l border-white/10 pl-12 transition-all duration-700 lg:flex ${
                  open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: open ? "550ms" : "0ms" }}
              >
                <div>
                  <p className="kicker mb-4 text-white/50">Studio</p>
                  <p className="serif-italic text-lg leading-relaxed text-white/85">
                    We bring ideas and visions to life — engineering modern
                    software for ambitious teams across Africa and beyond.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="kicker mb-2 text-white/50">Get in touch</p>
                    <a
                      href={contactInfo.emailHref}
                      className="block font-display text-lg font-semibold text-white transition-colors hover:text-white/70"
                    >
                      {contactInfo.email}
                    </a>
                    <a
                      href={contactInfo.phoneHref}
                      className="block font-display text-lg font-semibold text-white transition-colors hover:text-white/70"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>

                  <div>
                    <p className="kicker mb-3 text-white/50">Follow</p>
                    <ul className="flex flex-wrap gap-x-5 gap-y-2">
                      {socialLinks.map((s) => (
                        <li key={s.label}>
                          <a
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="kicker text-white/70 transition-colors hover:text-white"
                          >
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
