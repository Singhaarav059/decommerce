// Site-wide content: brand, nav groups and the 22-page sitemap.
// Page copy lives in MDX beside this file; this holds only names and routes.

export const brand = {
  name: "decommerce",
  legalName: "Decommerce",
  tagline: "Unified commerce for online, supply chain and in-store.",
  parent: { name: "Demaze Technologies", href: "https://www.demazetech.com/" },
  sibling: { name: "Decignal", href: "https://decignal.com/" },
  // canonical origin: NEXT_PUBLIC_SITE_URL if set, else Vercel's production domain (follows a custom domain once one is added)
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://decommerce-lime.vercel.app"),
  demoEmail: "hello@decommerce.example",
} as const;

export type SolutionSlug =
  | "storefront"
  | "brand-showcase"
  | "b2b"
  | "quick-commerce"
  | "marketplace"
  | "oms"
  | "wms"
  | "tms"
  | "pos"
  | "clienteling"
  | "endless-aisle"
  | "self-checkout";

export type NavItem = {
  label: string;
  href: string;
  blurb: string;
  slug?: SolutionSlug;
  /** Photograph shown when the item is previewed in the menu (solutions use their own scene). */
  image?: string;
};

export type NavGroup = { label: string; items: NavItem[] };

export const solutionGroups: NavGroup[] = [
  {
    label: "Online",
    items: [
      { slug: "storefront", label: "Storefront", href: "/storefront", blurb: "Launch and run your own store website" },
      { slug: "brand-showcase", label: "Brand showcase", href: "/storefront/brand-showcase", blurb: "Styled looks, shoppable as one outfit" },
      { slug: "b2b", label: "B2B commerce", href: "/b2b", blurb: "Buyer portals with tiered wholesale prices" },
      { slug: "quick-commerce", label: "Quick commerce", href: "/quick-commerce", blurb: "Fast delivery from dark stores" },
      { slug: "marketplace", label: "Marketplace", href: "/marketplace", blurb: "One listing, many sales channels" },
    ],
  },
  {
    label: "Supply chain",
    items: [
      { slug: "oms", label: "Order management", href: "/oms", blurb: "Route every order to the right location" },
      { slug: "wms", label: "Warehouse management", href: "/wms", blurb: "Pick, pack and track every bin" },
      { slug: "tms", label: "Transport management", href: "/tms", blurb: "Plan routes and track deliveries" },
    ],
  },
  {
    label: "In-store",
    items: [
      { slug: "pos", label: "Point of sale", href: "/pos", blurb: "A fast till with tap-to-pay" },
      { slug: "clienteling", label: "Clienteling", href: "/clienteling", blurb: "Know every customer at the counter" },
      { slug: "endless-aisle", label: "Endless aisle", href: "/endless-aisle", blurb: "Sell what the shelf doesn't hold" },
      { slug: "self-checkout", label: "Self-checkout", href: "/self-checkout", blurb: "Scan, pay and go in one step" },
    ],
  },
];

export const companyGroup: NavGroup = {
  label: "Company",
  items: [
    { label: "About us", href: "/about-us", image: "/assets/company/scene-about-us.webp", blurb: "Who builds Decommerce" },
    { label: "Book a demo", href: "/contact-us", image: "/assets/company/scene-contact-us.webp", blurb: "Talk to the team" },
    { label: "Security", href: "/security", image: "/assets/company/scene-security.webp", blurb: "How we protect your data" },
    { label: "Infrastructure", href: "/infrastructure", image: "/assets/company/scene-infrastructure.webp", blurb: "What runs the platform" },
    { label: "Partners", href: "/partners", image: "/assets/company/scene-partners.webp", blurb: "Work with Decommerce" },
    { label: "Glossary", href: "/glossary", image: "/assets/company/scene-office.webp", blurb: "Commerce terms, explained" },
    { label: "AI instructions", href: "/ai-instructions", image: "/assets/company/scene-office.webp", blurb: "How AI agents should read this site" },
  ],
};

export const legalLinks: NavItem[] = [
  { label: "Privacy policy", href: "/privacy-policy", blurb: "" },
  { label: "Terms and conditions", href: "/terms-and-conditions", blurb: "" },
];

export const allSolutions: NavItem[] = solutionGroups.flatMap((g) => g.items);

export function solutionBySlug(slug: SolutionSlug): NavItem {
  const item = allSolutions.find((s) => s.slug === slug);
  if (!item) throw new Error(`Unknown solution: ${slug}`);
  return item;
}

export const allRoutes: string[] = [
  "/",
  ...allSolutions.map((s) => s.href),
  ...companyGroup.items.map((i) => i.href),
  ...legalLinks.map((l) => l.href),
];

/** One line under each group's name in the menu. */
export const navIntro: Record<string, string> = {
  Online: "Your own site, wholesale portal, fast delivery and marketplaces, all on one catalog.",
  "Supply chain": "Orders routed, picked, packed and delivered from one live stock count.",
  "In-store": "The till, the customer record and the endless aisle at the counter.",
  Company: "The people and principles behind the platform.",
};

/** Where an item's preview photograph lives. */
export const navImage = (i: NavItem) => i.image ?? (i.slug ? `/assets/sol/${i.slug}/end.webp` : "/assets/company/scene-office.webp");

export const footerCta = {
  eyebrow: "Book a demo",
  headline: "See it run on your catalog.",
  body: "Tell us what you sell and where. We'll show you a working store with a sample of your own products.",
  primary: { label: "Book a demo", href: "/contact-us" },
};

/** How every module is rolled out: the service around the software ({x} is the module's name in a sentence). */
export const rollout = {
  eyebrow: "How we set it up",
  headline: "We set it up, connect it and stay with you.",
  steps: [
    { title: "Map", body: "We look at how {x} works for you today, who uses it and what it has to connect to." },
    { title: "Configure", body: "We set up {x} on your catalog, stock and locations, then demo it on your own data." },
    { title: "Go live", body: "It runs next to what you use today while we train your staff, then you switch over." },
    { title: "Run", body: "The team that set it up supports it after launch and tunes it with you each season." },
  ],
  included: ["Data migration", "Payment, courier and channel connections", "Staff training", "Support after launch"],
};
