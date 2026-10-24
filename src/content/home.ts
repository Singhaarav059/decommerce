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

export const hero = {
  eyebrow: "Unified commerce",
  headline: "One system behind every sale.",
  body: "Website, store, warehouse and marketplaces, run from one catalog, one stock count and one customer record.",
  primary: { label: "Book a demo", href: "/contact-us" },
  secondary: { label: "See it work", href: "#ch-islands" },
  posterAlt: "A miniature luxury clothing store with a curved glass front, terrazzo floor and copper counter; the camera glides inside to the counter.",
  arrival: "One store. Behind it, the website, the warehouse and every marketplace, all on one system.",
};

export const islands = {
  eyebrow: "The problem",
  headline: "Four systems, four answers.",
  body: "Your website says 4. Your store sold the last one an hour ago.",
  zones: [
    { id: "web", name: "Website", stock: 4 },
    { id: "store", name: "Store", stock: 1 },
    { id: "warehouse", name: "Warehouse", stock: 0 },
    { id: "marketplace", name: "Marketplace", stock: 6 },
  ],
  unit: "in stock",
  alt: "Four separate miniature rooms float apart: a warehouse, a market stall, an office and a boutique; then they stand together as one connected store.",
  item: `Stock of one ${order.item.toLowerCase()} in size ${order.size}`,
};

export const unify = {
  eyebrow: "The fix",
  headline: "One catalog, one stock count, everywhere.",
  body: "Every channel reads the same number at the same moment. Sell it in the store and the website knows before the next visitor loads the page.",
  stock: 5,
};

export const storefront = {
  catalog: {
    eyebrow: "Storefront",
    headline: "Your catalog is already a store.",
    body: "Every garment on the rail has a size, a price and a stock count in Decommerce, the same record the till and the warehouse use.",
  },
  alt: "A bronze clothing rail of linen shirts, knits and coats in a travertine boutique, then a laptop on the counter showing the same garments as a web shop.",
  eyebrow: "Storefront",
  headline: "A store website that builds itself from your catalog.",
  body: "Choose a theme and the site fills itself: products, prices and stock come straight from the catalog your stores use.",
  links: [
    { label: "Storefront", href: "/storefront" },
    { label: "Brand showcase", href: "/storefront/brand-showcase" },
  ],
};

export const orderLands = {
  eyebrow: "The order",
  headline: `${order.id} finds the nearest shelf.`,
  body: `A ${order.item.toLowerCase()} in size ${order.size}, ordered online. Order management checks three locations and routes it to the store ${order.distance} away, because it has the item and the shortest trip.`,
  locations: [
    { id: "wh", name: "Central warehouse", detail: "In stock · 18 km", chosen: false },
    { id: "st", name: order.store, detail: `In stock · ${order.distance}`, chosen: true },
    { id: "st2", name: "Old Town store", detail: "Out of size M", chosen: false },
  ],
  links: [{ label: "Order management", href: "/oms" }],
  alt: "A miniature city district with a steel warehouse and three boutiques; the camera moves toward the boutique nearest the customer.",
  arrive: { label: "The order", headline: `${order.id} arrives online.`, body: `One ${order.item.toLowerCase()}, size ${order.size}, ordered from the website for delivery today.` },
  check: { label: "Checking stock", headline: "Three places could ship it." },
  route: { label: "Routed", headline: `${order.store} ships it.`, body: `It has the size and the shortest trip: ${order.distance} to the customer's door. Split shipments and returns follow the same rules.` },
};

export const pack = {
  eyebrow: "Pick and pack",
  headline: "Bins light up in pick order.",
  body: "The picker scans the overshirt, the label prints itself and the box rolls onto the conveyor. No searching aisles.",
  steps: ["Bin B-14 lights up", "Scan LIN-OVR-M-SND", "Label prints", "Box onto the conveyor"],
  links: [{ label: "Warehouse management", href: "/wms" }],
  alt: "A packing station: a picker in a linen apron scans a kraft box and slides it onto the roller conveyor.",
};

export const delivery = {
  eyebrow: "Out for delivery",
  captions: [
    { at: [0.04, 0.3] as [number, number], eyebrow: "Dispatch", text: "The box leaves the store on the first van out." },
    { at: [0.36, 0.66] as [number, number], eyebrow: "On the road", text: "The route is planned around every other stop on the van." },
    { at: [0.72, 1] as [number, number], eyebrow: "Doorstep", text: "Delivered. The customer saw the ETA count down the whole way." },
  ],
  alt: "A small delivery van drives through a miniature city and stops at a house with a copper door.",
  headlines: ["On the first van out.", "One route for every stop.", "Delivered, on time."],
  eta: ["Arriving in 38 min", "Arriving in 14 min", "Delivered"],
  links: [
    { label: "Transport management", href: "/tms" },
    { label: "Quick commerce", href: "/quick-commerce" },
  ],
};

export const inStore = {
  eyebrow: "In the store, too",
  headline: "The same system at the counter.",
  panels: [
    { id: "pos", title: "Point of sale", body: "Tap to pay, receipt prints, stock updates everywhere.", href: "/pos" },
    { id: "aisle", title: "Endless aisle", body: "Out of a size? The shelf goes on: order it from another location to the customer's home.", href: "/endless-aisle" },
    { id: "kiosk", title: "Self-checkout", body: "Scan, pay and bag in one step, no queue.", href: "/self-checkout" },
  ],
  more: { label: "Clienteling", href: "/clienteling" },
  alt: "At a travertine counter a customer taps a card on the terminal and a cashier packs a linen shirt into an orange box.",
  pay: { label: "In the store, too", headline: "Tap, paid, packed.", body: "The same customer, the same catalog and the same stock count at the counter. The sale updates the website before the box is closed." },
  modules: { label: "At the counter", headline: "Every in‑store tool on one system." },
};

export const proof = {
  eyebrow: "Who builds it",
  headline: "Built by the team behind Demaze.",
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

export const proofAlt = "The miniature store turns slowly on the studio floor.";

export const close = {
  alt: "The miniature store at dusk, lights glowing, as a steel shutter comes down over the glass front.",
  film: { label: "Closing time", headline: "Every channel, settled at the end of the day.", body: "Stock, orders and takings agree across the website, the stores and the warehouse. Nothing to reconcile tonight." },
  eyebrow: "Book a demo",
  headline: "See it run on your catalog.",
  body: "Tell us what you sell and where. We'll show you a working store with a sample of your own products.",
};
