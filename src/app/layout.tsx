import type { Metadata } from "next";
import { Montserrat, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Dynamic base URL — uses NEXTAUTH_URL so it works on both local + production
const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Auratech — We Innovate. You Elevate.",
    template: "%s | Auratech",
  },
  description:
    "Auratech is a software studio in Dar es Salaam, Tanzania. We build websites, mobile apps, cloud systems, and AI solutions for ambitious businesses across Africa.",
  keywords: [
    "Auratech",
    "software development Tanzania",
    "web development Dar es Salaam",
    "mobile app development",
    "website design Tanzania",
    "cloud solutions",
    "AI solutions",
    "IT consulting Africa",
    "custom software",
    "e-commerce Tanzania",
  ],
  authors: [{ name: "Auratech" }],
  creator: "Auratech",
  publisher: "Auratech",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logos/auratech-mark.png",
    apple: "/logos/auratech-mark.png",
  },
  openGraph: {
    title: "Auratech — We Innovate. You Elevate.",
    description:
      "Software studio in Tanzania crafting modern web, mobile, cloud and AI experiences for ambitious businesses.",
    url: siteUrl,
    siteName: "Auratech",
    images: [
      {
        url: "/logos/auratech-wordmark.png",
        width: 1200,
        height: 630,
        alt: "Auratech — We Innovate. You Elevate.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auratech — We Innovate. You Elevate.",
    description:
      "Software studio in Tanzania crafting modern web, mobile, cloud and AI experiences.",
    images: ["/logos/auratech-wordmark.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  // Security + performance headers
  other: {
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
  },
};

// Structured data for Google (JSON-LD) — helps with local SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Auratech",
  description:
    "Software studio crafting modern web, mobile, cloud and AI experiences.",
  url: siteUrl,
  logo: `${siteUrl}/logos/auratech-mark.png`,
  sameAs: [
    "https://www.instagram.com/auratechtz",
    "https://wa.me/255613400250",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+255717043283",
    contactType: "customer service",
    areaServed: "Africa",
    availableLanguage: ["English", "Swahili"],
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dar es Salaam",
    addressCountry: "Tanzania",
  },
};

// Google Analytics — only loads if GA_MEASUREMENT_ID is set in env vars
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Google Analytics — only renders if GA_ID is set */}
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${montserrat.variable} ${libreBaskerville.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
