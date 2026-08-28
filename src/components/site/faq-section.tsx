"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/site-content";

export function FAQSection() {
  return (
    <section className="bg-background py-24 sm:py-32 border-t border-border">
      <div className="editorial">
        {/* Header */}
        <div data-reveal className="mb-16 flex items-center gap-4">
          <span className="h-px w-12 bg-primary" />
          <p className="kicker text-primary">FAQ</p>
        </div>

        <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <h2
            data-reveal
            className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-primary sm:text-6xl lg:text-7xl"
          >
            Questions,
            <br />
            <span className="text-accent">answered</span>.
          </h2>
          <p
            data-reveal
            className="serif-italic max-w-md text-lg leading-relaxed text-foreground/70 sm:text-xl"
          >
            The things we get asked most often. Don&apos;t see your question?
            Just send us a message — we reply within one business day.
          </p>
        </div>

        {/* Accordion */}
        <div data-reveal className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="py-6 text-left font-display text-lg font-bold text-primary hover:no-underline sm:text-xl">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-foreground/70 sm:text-lg">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
