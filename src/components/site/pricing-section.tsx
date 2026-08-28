"use client";

import { ArrowRight, Check, Star, Plus, RefreshCw, ShieldCheck } from "lucide-react";
import { usePage } from "./page-context";

type Tier = {
  name: string;
  tagline: string;
  price: string;
  cadence: string;
  timeline: string;
  popular?: boolean;
  features: string[];
};

const tiers: Tier[] = [
  {
    name: "Startup",
    tagline: "New businesses, freelancers, small shops",
    price: "TZS 450,000",
    cadence: "one-time",
    timeline: "7–10 working days",
    features: [
      "3-page website (Home, About, Contact)",
      "Domain + 1 year hosting (5 GB)",
      "1 professional email",
      "WhatsApp click-to-chat + contact form",
      "Mobile-responsive + basic SEO",
      "1 revision round",
    ],
  },
  {
    name: "Economical",
    tagline: "Growing businesses, restaurants, schools",
    price: "TZS 950,000",
    cadence: "one-time",
    timeline: "14 working days",
    popular: true,
    features: [
      "6–8 page website with your brand colors",
      "5 emails + 20 GB hosting",
      "WhatsApp Business setup + booking form",
      "Google Business Profile + Analytics",
      "Photo gallery + social media integration",
      "Basic logo + 3 months maintenance",
      "2 revision rounds",
    ],
  },
  {
    name: "Enterprise",
    tagline: "Hotels, e-commerce, NGOs, corporations",
    price: "TZS 2,500,000+",
    cadence: "custom",
    timeline: "21–30 working days",
    features: [
      "Unlimited pages — fully custom design",
      "E-commerce OR booking system + payment gateway",
      "WhatsApp Business API + customer portal",
      "Advanced SEO + Google Ads setup",
      "Professional branding kit + logo",
      "6 months maintenance + staff training",
      "Priority support (48-hr response)",
    ],
  },
];

const addOns = [
  { service: "Extra webpage", price: "TZS 50,000" },
  { service: "Additional professional email", price: "TZS 15,000" },
  { service: "Logo design (standalone)", price: "TZS 100,000–150,000" },
  { service: "Content writing (per website)", price: "TZS 25,000" },
  { service: "Photo editing/retouching (per image)", price: "TZS 5,000" },
  { service: "Additional revision round", price: "TZS 30,000" },
  { service: "Rush delivery (50% faster)", price: "+25% of package price" },
  { service: "Google Ads campaign management", price: "TZS 50,000/month" },
  { service: "Social media management", price: "TZS 50,000/month" },
  { service: "Business card design + printing (500 pcs)", price: "TZS 100,000" },
];

const recurringServices = [
  {
    name: "Maintenance Plan",
    price: "TZS 25,000/month",
    includes: "Updates, backups, security, content changes, 48-hr support",
  },
  {
    name: "Hosting + Domain Renewal",
    price: "TZS 150,000/year",
    includes: "Annual renewal — domain and hosting managed by us",
  },
  {
    name: "Maintenance + Hosting Bundle",
    price: "TZS 350,000/year",
    includes: "Best value — save TZS 50,000 vs monthly",
  },
];

const everyPackageIncludes = [
  "No hidden fees — the price you see is the price you pay",
  "50% deposit, 50% before launch — no surprises",
  "Written agreement protecting both sides",
  "Mobile-first design — built for how Tanzanians browse",
  "Training documentation — PDF guide on your new site",
  "30-day post-launch support — free fixes if anything breaks",
  "You own everything — domain, hosting, content all in your name",
];

export function PricingSection() {
  const { setPage } = usePage();

  return (
    <section className="bg-secondary py-24 sm:py-32 border-t border-border">
      <div className="editorial">
        {/* Header */}
        <div data-reveal className="mb-16 flex items-center gap-4">
          <span className="h-px w-12 bg-primary" />
          <p className="kicker text-primary">Pricing</p>
        </div>

        <div className="mb-20 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <h2
            data-reveal
            className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-primary sm:text-6xl lg:text-7xl"
          >
            Website &
            <br />
            <span className="text-accent">digital</span> packages.
          </h2>
          <p
            data-reveal
            className="serif-italic max-w-md text-lg leading-relaxed text-foreground/70 sm:text-xl"
          >
            Complete solutions for Tanzanian businesses. All prices in Tanzanian
            Shillings (TZS), inclusive of standard taxes.
          </p>
        </div>

        {/* === Tier cards === */}
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {tiers.map((tier, idx) => (
            <PricingCard
              key={tier.name}
              tier={tier}
              index={idx}
              onClick={() => setPage("contact")}
            />
          ))}
        </div>

        {/* === What you get with every package === */}
        <div data-reveal className="mt-20 rounded-2xl bg-background p-8 sm:p-12">
          <div className="mb-8 flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-accent" />
            <h3 className="font-display text-2xl font-bold text-primary sm:text-3xl">
              What you get with every package
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {everyPackageIncludes.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={3} />
                <span className="text-sm text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* === Optional Add-ons === */}
        <div data-reveal className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <Plus className="h-6 w-6 text-accent" />
            <h3 className="font-display text-2xl font-bold text-primary sm:text-3xl">
              Optional add-ons
            </h3>
          </div>
          <p className="mb-6 text-sm text-foreground/60">
            Add any of these to any package above.
          </p>
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary/50">
                <tr>
                  <th className="px-5 py-3 font-semibold text-foreground/60">Service</th>
                  <th className="px-5 py-3 text-right font-semibold text-foreground/60">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {addOns.map((addon) => (
                  <tr key={addon.service} className="hover:bg-secondary/30">
                    <td className="px-5 py-3 text-foreground/80">{addon.service}</td>
                    <td className="px-5 py-3 text-right font-medium text-primary">{addon.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* === Recurring services === */}
        <div data-reveal className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <RefreshCw className="h-6 w-6 text-accent" />
            <h3 className="font-display text-2xl font-bold text-primary sm:text-3xl">
              Recurring services — your ongoing support
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {recurringServices.map((svc) => (
              <div
                key={svc.name}
                className="rounded-xl border border-border bg-background p-6"
              >
                <p className="font-display text-lg font-bold text-foreground">{svc.name}</p>
                <p className="mt-2 font-display text-2xl font-extrabold text-accent">{svc.price}</p>
                <p className="mt-2 text-sm text-foreground/60">{svc.includes}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-primary/5 p-5">
            <p className="kicker mb-2 text-primary">All maintenance clients receive</p>
            <p className="text-sm text-foreground/70">
              Weekly automatic backups · 24/7 uptime monitoring · Security scanning ·
              Free content updates · Priority WhatsApp support · Quarterly site health report
            </p>
          </div>
        </div>

        {/* === CTA === */}
        <div data-reveal className="mt-16 text-center">
          <p className="serif-italic mb-6 text-lg text-foreground/70 sm:text-xl">
            Not sure which package fits?
          </p>
          <button
            onClick={() => setPage("contact")}
            className="group inline-flex items-center gap-2 bg-primary px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-primary/90"
          >
            Book a free 30-min consultation
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
          <p className="mt-4 text-xs text-foreground/50">
            Free consultation — no obligation. We discuss your needs and recommend the right package.
          </p>
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  tier,
  index,
  onClick,
}: {
  tier: Tier;
  index: number;
  onClick: () => void;
}) {
  const popular = tier.popular;
  return (
    <div
      data-reveal="scale-up"
      style={{ transitionDelay: `${index * 100}ms` }}
      className={`group relative flex flex-col p-6 transition-all duration-300 sm:p-8 ${
        popular
          ? "bg-primary text-white lg:-translate-y-4 lg:shadow-xl"
          : "bg-card text-foreground border border-border hover:border-primary/40 lift-on-hover"
      }`}
    >
      {/* "Most Popular" ribbon */}
      {popular && (
        <span className="absolute right-0 top-6 inline-flex -mr-2 items-center gap-1 bg-accent px-3 py-1 kicker text-accent-foreground">
          <Star className="h-3 w-3 fill-current" />
          Most Popular
        </span>
      )}

      {/* Tier name */}
      <h3
        className={`font-display text-2xl font-bold ${
          popular ? "text-white" : "text-primary"
        }`}
      >
        {tier.name}
      </h3>

      {/* Tagline */}
      <p
        className={`mt-2 text-xs leading-relaxed ${
          popular ? "text-white/70" : "text-foreground/50"
        }`}
      >
        {tier.tagline}
      </p>

      {/* Price */}
      <div className="mt-5 flex items-baseline gap-2">
        <span
          className={`font-display text-3xl font-extrabold ${
            popular ? "text-accent" : "text-primary"
          } sm:text-4xl`}
        >
          {tier.price}
        </span>
      </div>
      <p
        className={`mt-1 text-xs ${
          popular ? "text-white/60" : "text-foreground/50"
        }`}
      >
        {tier.cadence}
      </p>

      {/* Timeline */}
      <div
        className={`mt-4 flex items-center gap-2 border-t pt-4 text-sm font-medium ${
          popular ? "border-white/20 text-white/80" : "border-border text-foreground/60"
        }`}
      >
        <span
          className={`flex h-2 w-2 rounded-full ${
            popular ? "bg-accent" : "bg-accent"
          }`}
        />
        Delivery: {tier.timeline}
      </div>

      {/* Features */}
      <ul className="mt-6 flex-1 space-y-2.5">
        {tier.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              strokeWidth={3}
            />
            <span
              className={`text-xs leading-relaxed ${
                popular ? "text-white/90" : "text-foreground/80"
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onClick}
        className={`group/btn mt-8 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition-all duration-300 ${
          popular
            ? "bg-accent text-accent-foreground hover:bg-accent/90"
            : "border border-primary text-primary hover:bg-primary hover:text-white"
        }`}
      >
        Start a Project
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
}
