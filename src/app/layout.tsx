import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { brand } from "@/content/site";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { openingHeadScript } from "@/lib/opening";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Mono is for eyebrows and order codes only: keep it off the critical path.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: brand.legalName,
              url: brand.siteUrl,
              description: brand.tagline,
              parentOrganization: { "@type": "Organization", name: brand.parent.name, url: brand.parent.href },
            }),
          }}
        />
        <SmoothScroll />
        {children}
        {/* cookieless page-view analytics; the script only exists on Vercel, so skip it elsewhere */}
        {process.env.VERCEL === "1" && <Analytics />}
      </body>
    </html>
  );
}
