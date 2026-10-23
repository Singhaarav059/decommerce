import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { brand } from "@/content/site";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { openingHeadScript } from "@/lib/opening";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: {
    default: `${brand.legalName}: one system behind every sale`,
    template: `%s · ${brand.legalName}`,
  },
  description: brand.tagline,
};

export const viewport: Viewport = {
  themeColor: "#F5F2ED",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <Script id="opening-skip" strategy="beforeInteractive">
          {openingHeadScript}
        </Script>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
