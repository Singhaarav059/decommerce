import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Schibsted_Grotesk } from "next/font/google";
import { brand } from "@/content/site";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

// One family for everything: headlines, body, labels and figures. No italics.
const grotesk = Schibsted_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal"],
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
  themeColor: "#CEC5BD",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${grotesk.variable} antialiased`}
    >
      <body className="min-h-dvh">
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
