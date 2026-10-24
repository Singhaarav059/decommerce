// Site-wide content: brand, nav groups and the 22-page sitemap.
// Page copy lives in MDX beside this file; this holds only names and routes.

export const brand = {
  name: "decommerce",
  legalName: "Decommerce",
  tagline: "Unified commerce for online, supply chain and in-store.",
  parent: { name: "Demaze Technologies", href: "https://www.demazetech.com/" },
  sibling: { name: "Decignal", href: "https://decignal.com/" },
  siteUrl: "https://decommerce.example",
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
    { label: "About us", href: "/about-us", blurb: "Who builds Decommerce" },
    { label: "Book a demo", href: "/contact-us", blurb: "Talk to the team" },
    { label: "Security", href: "/security", blurb: "How we protect your data" },
    { label: "Infrastructure", href: "/infrastructure", blurb: "What runs the platform" },
    { label: "Partners", href: "/partners", blurb: "Work with Decommerce" },
    { label: "Glossary", href: "/glossary", blurb: "Commerce terms, explained" },
    { label: "AI instructions", href: "/ai-instructions", blurb: "How AI agents should read this site" },
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
