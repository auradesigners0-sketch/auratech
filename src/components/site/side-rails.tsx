"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Linkedin, Instagram, Facebook, type LucideIcon } from "lucide-react";
import { socialLinks } from "@/lib/site-content";

const socialLinksList: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: MessageCircle, label: "WhatsApp", href: socialLinks.whatsapp },
  { icon: Linkedin, label: "LinkedIn", href: socialLinks.linkedin },
  { icon: Instagram, label: "Instagram", href: socialLinks.instagram },
  { icon: Facebook, label: "Facebook", href: socialLinks.facebook },
];

/**
 * Fixed vertical rails — left = social icons, right = scroll cue.
 * Hidden on small screens. Auto-hides when scrolled past hero.
 *
 * Icon colour is dark green so it reads on the light hero background.
 */
export function SideRails() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const heroHeight = window.innerHeight;
      setVisible(window.scrollY < heroHeight - 120);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-y-0 z-30 hidden transition-opacity duration-500 lg:block ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Left rail — social icons */}
      <ul className="pointer-events-auto absolute left-6 top-1/2 -translate-y-1/2 space-y-5">
        {socialLinksList.map(({ icon: Icon, label, href }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 text-primary/70 transition-all hover:border-primary hover:bg-primary hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </a>
          </li>
        ))}
      </ul>

      {/* Right rail — scroll cue */}
      <div className="pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
        <span className="kicker vertical-rl text-primary/70">Scroll Down</span>
        <span className="block h-12 w-px bg-primary/40">
          <span className="block h-1/3 w-full bg-primary" />
        </span>
      </div>
    </div>
  );
}
