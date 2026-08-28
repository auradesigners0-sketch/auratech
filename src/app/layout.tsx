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

export const metadata: Metadata = {
  title: "Auratech — We Innovate. You Elevate.",
  description:
    "Auratech is a software and technology studio crafting modern web, mobile, cloud and AI experiences for ambitious businesses.",
  keywords: [
    "Auratech",
    "software development",
    "web development",
    "mobile apps",
    "cloud solutions",
    "AI",
    "IT consulting",
  ],
  authors: [{ name: "Auratech" }],
  icons: {
    icon: "/logos/auratech-mark.png",
  },
  openGraph: {
    title: "Auratech — We Innovate. You Elevate.",
    description:
      "Software & technology studio crafting modern web, mobile, cloud and AI experiences.",
    siteName: "Auratech",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auratech — We Innovate. You Elevate.",
    description:
      "Software & technology studio crafting modern web, mobile, cloud and AI experiences.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${libreBaskerville.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
