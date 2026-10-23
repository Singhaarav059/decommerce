// Homepage copy: ten chapters following one illustrative order, ORD-1042.
// Every number in here is an example and is labelled as one on the page.

export const order = {
  id: "ORD-1042",
  item: "Linen overshirt",
  size: "M",
  sku: "LIN-OVR-M-SND",
  store: "Riverside store",
  distance: "2.4 km",
  eta: "38 min",
} as const;

export type Step = { eyebrow: string; headline: string; body?: string };

export const chapters = [
  { id: "ch-store", label: "The store" },
  { id: "ch-islands", label: "Four islands" },
  { id: "ch-unify", label: "One count" },
  { id: "ch-storefront", label: "Storefront" },
  { id: "ch-order", label: "The order" },
  { id: "ch-pack", label: "Pick and pack" },
  { id: "ch-delivery", label: "Delivery" },
  { id: "ch-instore", label: "In the store" },
  { id: "ch-proof", label: "How we work" },
  { id: "ch-close", label: "Book a demo" },
] as const;

export const opening = { label: "Opening", skip: "Skip" };

export const hero = {
  eyebrow: "Unified commerce",
  headline: "One system behind *every sale*.",
  body: "Website, store, warehouse and marketplaces, run from one catalog, one stock count and one customer record.",
  primary: { label: "Book a demo", href: "/contact-us" },
  secondary: { label: "See it work", href: "#ch-islands" },
  posterAlt: "A miniature store: a counter with a card terminal, a rail of linen shirts, shelves of kraft boxes and an olive tree, lit by low sun.",
};

export const islands = {
  eyebrow: "02 · The problem",
  headline: "Four systems, four *answers*.",
  body: "Your website says 4. Your store sold the last one an hour ago.",
  zones: [
    { id: "web", name: "Website", stock: 4 },
    { id: "store", name: "Store", stock: 1 },
    { id: "warehouse", name: "Warehouse", stock: 0 },
    { id: "marketplace", name: "Marketplace", stock: 6 },
  ],
  unit: "in stock",
  item: `${order.item}, size ${order.size}`,
};

export const unify = {
  eyebrow: "03 · The fix",
  headline: "One catalog, one stock count, *everywhere*.",
  body: "Every channel reads the same number at the same moment. Sell it in the store and the website knows before the next visitor loads the page.",
  stock: 5,
};

export const storefront = {
  eyebrow: "04 · Storefront",
  headline: "A store website that *builds itself* from your catalog.",
  body: "Pick a look from the rail. Products, prices and stock come straight from the same catalog your stores use.",
  rackHint: "Drag the rail or use the arrows. Tap a hanger to try it on.",
  links: [
    { label: "Storefront", href: "/storefront" },
    { label: "Brand showcase", href: "/storefront/brand-showcase" },
  ],
};

export const orderLands = {
  eyebrow: "05 · The order",
  headline: `${order.id} finds the *nearest* shelf.`,
  body: `A ${order.item.toLowerCase()} in size ${order.size}, ordered online. Order management checks three locations and routes it to the store ${order.distance} away, because it has the item and the shortest trip.`,
  locations: [
    { id: "wh", name: "Central warehouse", detail: "In stock · 18 km", chosen: false },
    { id: "st", name: order.store, detail: `In stock · ${order.distance}`, chosen: true },
    { id: "st2", name: "Old Town store", detail: "Out of size M", chosen: false },
  ],
  hotspots: [
    { id: "split", label: "Split shipment", detail: "If no single location has every item, the order ships from two and the customer sees one tracking page.", x: 22, y: 30 },
    { id: "returns", label: "Returns anywhere", detail: "A return can go back to any store, which restocks it into the same shared count.", x: 74, y: 64 },
  ],
  links: [{ label: "Order management", href: "/oms" }],
};

export const pack = {
  eyebrow: "06 · Pick and pack",
  headline: "Bins light up in *pick order*.",
  body: "The picker scans the overshirt, the label prints itself and the box rolls onto the conveyor. No searching aisles.",
  steps: ["Bin B-14 lights up", "Scan LIN-OVR-M-SND", "Label prints", "Box onto the conveyor"],
  links: [{ label: "Warehouse management", href: "/wms" }],
};

export const delivery = {
  eyebrow: "07 · Out for delivery",
  captions: [
    { at: [0.04, 0.3] as [number, number], eyebrow: "Dispatch", text: "The box leaves the store on the first van out." },
    { at: [0.36, 0.66] as [number, number], eyebrow: "On the road", text: "The route is planned around every other stop on the van." },
    { at: [0.72, 1] as [number, number], eyebrow: "Doorstep", text: "Delivered. The customer saw the ETA count down the whole way." },
  ],
  alt: "A kraft box rides a conveyor into a van, which crosses a miniature city to a doorstep.",
  links: [
    { label: "Transport management", href: "/tms" },
    { label: "Quick commerce", href: "/quick-commerce" },
  ],
};

export const inStore = {
  eyebrow: "08 · In the store, too",
  headline: "The same system at the *counter*.",
  panels: [
    { id: "pos", scene: "pos", title: "Point of sale", body: "Tap to pay, receipt prints, stock updates everywhere.", href: "/pos" },
    { id: "aisle", scene: "aisle", title: "Endless aisle", body: "Out of a size? The shelf goes on: order it from another location to the customer's home.", href: "/endless-aisle" },
    { id: "kiosk", scene: "kiosk", title: "Self-checkout", body: "Scan, pay and bag in one step, no queue.", href: "/self-checkout" },
  ],
  more: { label: "Clienteling", href: "/clienteling" },
};

export const proof = {
  eyebrow: "09 · Who builds it",
  headline: "Built by the team behind *Demaze*.",
  body: "Decommerce comes from Demaze Technologies, the team that also builds Decignal. These are Demaze's own numbers.",
  stats: [
    { value: 45, suffix: "+", label: "Projects delivered" },
    { value: 35, suffix: "+", label: "People on the team" },
    { value: 6, suffix: "", label: "Years building software" },
  ],
  process: [
    { n: "01", title: "Discover", body: "We map how you sell today: channels, stock, stores and the gaps between them." },
    { n: "02", title: "Design", body: "One catalog and one stock model, designed around your real products." },
    { n: "03", title: "Build", body: "Modules go live one at a time, so nothing stops selling while you switch." },
    { n: "04", title: "Launch", body: "We stay on through the first season and tune what the data shows." },
  ],
};

export const close = {
  eyebrow: "10 · Book a demo",
  headline: "See it run on *your* catalog.",
  body: "Tell us what you sell and where. We'll show you a working store with a sample of your own products.",
};
