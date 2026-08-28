"use client";

import Image from "next/image";
import { navLinks, contactInfo, socialLinks as socialLinksData } from "@/lib/site-content";
import { usePage, type PageId } from "./page-context";

const socialLinks = [
  { label: "WhatsApp", href: socialLinksData.whatsapp },
  { label: "LinkedIn", href: socialLinksData.linkedin },
  { label: "Instagram", href: socialLinksData.instagram },
  { label: "Facebook", href: socialLinksData.facebook },
];

export function FooterInfinity() {
  const { setPage } = usePage();

  return (
    <footer className="bg-[#1B4332] text-white">
      {/* Top — large editorial brand statement */}
      <div className="editorial py-20 lg:py-28">
        <div data-reveal className="grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
          {/* Left — brand statement */}
          <div>
            <Image
              src="/logos/auratech-wordmark-light.png"
              alt="Auratech"
              width={1850}
              height={368}
              className="h-9 w-auto"
            />
            <p className="serif-italic mt-8 max-w-md text-xl leading-relaxed text-white/70 sm:text-2xl">
              We bring ideas and visions to life. We innovate — you elevate.
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/50">
              Partnering with ambitious teams across Africa and beyond to build
              software that lasts.
            </p>
          </div>

          {/* Right — sitemap + social */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="kicker mb-5 text-white/40">Sitemap</p>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => setPage(link.href as PageId)}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 bg-white transition-all duration-300 group-hover:w-3" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="kicker mb-5 text-white/40">Follow</p>
              <ul className="space-y-3">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 bg-white transition-all duration-300 group-hover:w-3" />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
