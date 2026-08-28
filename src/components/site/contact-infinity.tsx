"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, ArrowRight, Loader2, Check, AlertCircle, ChevronDown, MessageCircle } from "lucide-react";
import { contactInfo } from "@/lib/site-content";

type Status = "idle" | "loading" | "success" | "error";

const PROJECT_TYPES = ["Web Development", "Mobile App", "Custom System", "Cloud / DevOps", "Cybersecurity", "AI / Data", "Other"];
const BUDGET_RANGES = ["Below TZS 400K", "TZS 400K – 800K", "TZS 800K – 1.5M", "TZS 1.5M – 2.5M", "Above TZS 2.5M", "Not sure yet"];

/**
 * ContactInfinity — full-width deep-green section with a 2-col layout:
 *   LEFT  = headline + form (on a subtle lighter panel)
 *   RIGHT = contact info list + "available" status pill
 *
 * Background fills the entire viewport width; inner content is constrained
 * to the .editorial max-width.
 */
export function ContactInfinity() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          email,
          projectType: projectType || undefined,
          budget: budget || undefined,
          message: message || undefined,
          source: "contact-form",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed");
      }
      setStatus("success");
      setName("");
      setEmail("");
      setProjectType("");
      setBudget("");
      setMessage("");
      setTimeout(() => setStatus("idle"), 10000);
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 10000);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-background py-20 pb-28 sm:py-24 sm:pb-32 lg:py-28"
    >
      {/* === Full-width background decorations === */}
      {/* Subtle grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-40" aria-hidden="true" />
      {/* Lime glow orb — top-left */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />
      {/* Lime glow orb — bottom-right */}
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl"
        aria-hidden="true"
      />
      {/* Oversized decorative numeral */}
      <div
        className="pointer-events-none absolute -right-8 top-12 hidden select-none font-display text-[16rem] font-extrabold leading-none text-primary/[0.05] xl:block"
        aria-hidden="true"
      >
        04
      </div>

      {/* === Inner content — constrained width === */}
      <div className="editorial relative z-10">
        {/* Header strip */}
        <div data-reveal className="mb-12 flex items-center gap-4">
          <span className="h-px w-12 bg-primary" />
          <p className="kicker text-primary">Get in touch</p>
        </div>

        {/* === 2-column layout === */}
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          {/* === LEFT: headline + form panel === */}
          <div data-reveal>
            <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-primary sm:text-5xl lg:text-[3.5rem]">
              Let&apos;s build
              <br />
              something <span className="text-accent">remarkable</span>.
            </h2>

            <p className="serif-italic mt-5 max-w-md text-base leading-relaxed text-foreground/70 sm:text-lg">
              Have a project in mind? Tell us about it — we typically reply
              within one business day.
            </p>

            {/* Form — underline-style inputs directly on the deep-green card.
                No boxed inputs, no white panel. Clean and minimal. */}
            <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-7">
              {/* Name + Email — two-up on sm+ */}
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-3 block">
                    <span className="kicker text-foreground/60">Your name</span>
                    <span className="ml-2 text-[10px] text-foreground/40">(optional)</span>
                  </label>
                  <div className="flex items-center border-b-2 border-border transition-colors focus-within:border-primary">
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      disabled={status === "loading"}
                      className="flex-1 bg-transparent py-3 text-base text-foreground placeholder:text-foreground/40 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-3 block">
                    <span className="kicker text-foreground/60">Your email</span>
                    <span className="ml-2 text-[10px] text-primary">*</span>
                  </label>
                  <div className="flex items-center border-b-2 border-border transition-colors focus-within:border-primary">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      disabled={status === "loading"}
                      className="flex-1 bg-transparent py-3 text-base text-foreground placeholder:text-foreground/40 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Project Type + Budget */}
              <div className="grid gap-7 sm:grid-cols-2">
                <SelectField
                  id="projectType"
                  label="Project type"
                  placeholder="Select…"
                  value={projectType}
                  onChange={setProjectType}
                  options={PROJECT_TYPES}
                  disabled={status === "loading"}
                />
                <SelectField
                  id="budget"
                  label="Budget range"
                  placeholder="Select…"
                  value={budget}
                  onChange={setBudget}
                  options={BUDGET_RANGES}
                  disabled={status === "loading"}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="mb-3 block">
                  <span className="kicker text-foreground/60">Tell us about your project</span>
                  <span className="ml-2 text-[10px] text-foreground/40">(optional)</span>
                </label>
                <div className="border-b-2 border-border transition-colors focus-within:border-primary">
                  <textarea
                    id="message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What are you building? What problem are you trying to solve?"
                    disabled={status === "loading"}
                    className="w-full resize-none bg-transparent py-3 text-base text-foreground placeholder:text-foreground/40 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit + status */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={status === "loading" || !email}
                  className="group inline-flex items-center justify-center gap-2 bg-accent px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary transition-all duration-300 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                {status === "idle" && (
                  <p className="text-xs text-foreground/40">
                    We respect your inbox. No spam, ever.
                  </p>
                )}
                {status === "success" && (
                  <p className="flex items-center gap-2 text-sm font-medium text-accent">
                    <Check className="h-4 w-4" />
                    Thank you — we&apos;ll be in touch within one business day.
                  </p>
                )}
                {status === "error" && (
                  <p className="flex items-center gap-2 text-sm font-medium text-[#FF6B6B]">
                    <AlertCircle className="h-4 w-4" />
                    Something went wrong. Try again or email us directly.
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* === RIGHT: contact info + status === */}
          <div data-reveal className="lg:pt-2">
            {/* Available pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="kicker text-accent">Available for new projects · Q3 2026</span>
            </div>

            {/* Contact info list */}
            <ul className="divide-y divide-border border-t border-border">
              <ContactItem
                icon={Mail}
                label="Email"
                value={contactInfo.email}
                href={contactInfo.emailHref}
              />
              <ContactItem
                icon={Phone}
                label="Phone"
                value={contactInfo.phone}
                href={contactInfo.phoneHref}
              />
              <ContactItem
                icon={MapPin}
                label="Studio"
                value={contactInfo.address}
              />
              <ContactItem
                icon={Clock}
                label="Hours"
                value={contactInfo.hours}
              />
            </ul>

            {/* WhatsApp quick CTA */}
            <a
              href={contactInfo.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 flex items-center justify-between rounded-xl border border-accent/30 bg-accent/5 p-5 transition-all hover:bg-accent/10"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <p className="kicker text-accent">Prefer to chat?</p>
                  <p className="font-display text-base font-semibold text-foreground">
                    Message us on WhatsApp
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}

/* === SelectField — underline-style to match the text inputs === */
function SelectField({
  id,
  label,
  placeholder,
  value,
  onChange,
  options,
  disabled,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-3 block">
        <span className="kicker text-foreground/60">{label}</span>
      </label>
      <div className="relative flex items-center border-b-2 border-border transition-colors focus-within:border-primary">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`flex-1 appearance-none bg-transparent py-3 pr-8 text-base focus:outline-none disabled:opacity-50 ${
            value ? "text-foreground" : "text-foreground/40"
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-secondary text-foreground">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-0 h-4 w-4 text-foreground/40"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/* === Contact info row === */
function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="group flex items-start gap-4 py-5 transition-all duration-300 hover:pl-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-accent/30 text-accent transition-colors group-hover:bg-accent group-hover:text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="kicker mb-1 text-foreground/50">{label}</p>
        <p className="font-display text-base font-semibold text-foreground sm:text-lg">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <li>
      {href ? <a href={href}>{content}</a> : content}
    </li>
  );
}
