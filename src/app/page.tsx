"use client";

import { PageProvider, usePage } from "@/components/site/page-context";
import { ScrollRevealer } from "@/components/site/scroll-revealer";
import { SiteHeader } from "@/components/site/site-header";
import { SideRails } from "@/components/site/side-rails";
import { HeroInfinity } from "@/components/site/hero-infinity";
import { AboutInfinity } from "@/components/site/about-infinity";
import { VisionMission } from "@/components/site/vision-mission";
import { ServicesInfinity } from "@/components/site/services-infinity";
import { ProcessSection } from "@/components/site/process-section";
import { PricingSection } from "@/components/site/pricing-section";
import { PortfolioInfinity } from "@/components/site/portfolio-infinity";
import { TestimonialsInfinity } from "@/components/site/testimonials-infinity";
import { ClientsInfinity } from "@/components/site/clients-infinity";
import { ContactInfinity } from "@/components/site/contact-infinity";
import { FAQSection } from "@/components/site/faq-section";
import { FooterInfinity } from "@/components/site/footer-infinity";
import { CaseStudy } from "@/components/site/case-study";
import { BlogInfinity } from "@/components/site/blog-infinity";
import { FloatingWhatsApp } from "@/components/site/floating-whatsapp";
import { CursorFollower } from "@/components/site/cursor-follower";

function PageRouter() {
  const { page } = usePage();

  let content: React.ReactNode;
  switch (page) {
    case "about":
      content = (
        <>
          <main className="flex-1">
            {/* pt to clear the fixed transparent header */}
            <div className="h-24" aria-hidden="true" />
            <AboutInfinity />
            <VisionMission />
          </main>
          <FooterInfinity />
        </>
      );
      break;
    case "services":
      content = (
        <>
          <main className="flex-1">
            <div className="h-24" aria-hidden="true" />
            <ServicesInfinity />
            <ProcessSection />
            <PricingSection />
          </main>
          <FooterInfinity />
        </>
      );
      break;
    case "work":
      content = (
        <>
          <main className="flex-1">
            <div className="h-24" aria-hidden="true" />
            <PortfolioInfinity />
          </main>
          <FooterInfinity />
        </>
      );
      break;
    case "contact":
      content = (
        <>
          <main className="flex-1">
            <div className="h-24" aria-hidden="true" />
            <ContactInfinity />
            <FAQSection />
          </main>
          <FooterInfinity />
        </>
      );
      break;
    case "case-study":
      content = (
        <>
          <CaseStudy />
          <FooterInfinity />
        </>
      );
      break;
    case "blog":
      content = (
        <>
          <BlogInfinity />
          <FooterInfinity />
        </>
      );
      break;
    case "home":
    default:
      content = (
        <>
          <SideRails />
          <main className="flex-1">
            <HeroInfinity />
            <AboutInfinity />
            <ServicesInfinity />
            <PortfolioInfinity />
            <TestimonialsInfinity />
            <ClientsInfinity />
            <ContactInfinity />
          </main>
          <FooterInfinity />
        </>
      );
  }

  // key={page} forces React to remount on page change so the
  // page-enter animation replays each navigation
  return (
    <div key={page} className="page-enter">
      {content}
    </div>
  );
}

export default function Home() {
  return (
    <PageProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <ScrollRevealer />
        <PageRouter />
        <FloatingWhatsApp />
        <CursorFollower />
      </div>
    </PageProvider>
  );
}
