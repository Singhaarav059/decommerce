// Homepage copy: one illustrative order (ORD-1042, a linen overshirt in size M)
// followed through real places. Every number is an example, labelled as one.

export const order = {
  id: "ORD-1042",
  item: "Linen overshirt",
  size: "M",
  sku: "LIN-OVR-M-SND",
  store: "Riverside store",
  distance: "2.4 km",
  eta: "38 min",
} as const;

export const hero = {
  eyebrow: "Unified commerce",
  headline: "One system behind every sale.",
  body: "Website, store, warehouse and marketplaces, run from one catalog, one stock count and one customer record.",
  primary: { label: "Book a demo", href: "/contact-us" },
  secondary: { label: "See it work", href: "#ch-problem" },
  posterAlt: "A sunlit clothing boutique with a curved copper counter, oak shelves of folded knits and an olive tree; the camera moves slowly in.",
  arrival: "Every sale here, online or at the counter, runs through the same catalog and the same stock count.",
};

export type Row = { left: string; right?: string };
export type StoryStep = {
  label: string;
  headline: string;
  body: string;
  rows?: Row[];
  /** Highlight this row index. */
  active?: number;
  links?: { label: string; href: string }[];
};
export type Chapter = { id: string; seq: string; alt: string; steps: StoryStep[] };

export const chapters: Record<string, Chapter> = {
  problem: {
    id: "ch-problem",
    seq: "problem",
    alt: "A shop assistant lifts the last folded linen overshirt from an oak shelf and carries it away to a customer.",
    steps: [
      {
        label: "The problem",
        headline: "The last one just sold.",
        body: "In most shops the till, the website and the marketplaces each keep their own count. The store is out, but the website still says 4, so tonight someone buys a shirt that isn't there.",
        rows: [
          { left: "Store", right: "0" },
          { left: "Website", right: "4" },
          { left: "Warehouse", right: "0" },
          { left: "Marketplace", right: "6" },
        ],
      },
      {
        label: "The fix",
        headline: "One stock count, everywhere.",
        body: "With Decommerce the sale at the counter updates every channel at the same moment. Nobody can buy what isn't on a shelf, and nobody has to reconcile the numbers at night.",
        rows: [
          { left: "Store", right: "0" },
          { left: "Website", right: "0" },
          { left: "Warehouse", right: "0" },
          { left: "Marketplace", right: "0" },
        ],
      },
    ],
  },
  order: {
    id: "ch-order",
    seq: "order",
    alt: "A boutique with a curved glass front on a quiet sunlit street; the camera moves slowly toward its lit window.",
    steps: [
      {
        label: "The order",
        headline: `${order.id} arrives online.`,
        body: `A customer orders one ${order.item.toLowerCase()} in size ${order.size} from the website, for delivery today. ${order.sku}, illustrative.`,
      },
      {
        label: "Order management",
        headline: "Every location is checked in a second.",
        body: "Decommerce looks at every store and warehouse that holds the shirt, how far each is from the customer and how busy it is.",
        rows: [
          { left: "Central warehouse", right: "In stock · 18 km" },
          { left: order.store, right: `In stock · ${order.distance}` },
          { left: "Old Town store", right: "Out of size M" },
        ],
      },
      {
        label: "Routed",
        headline: `${order.store} ships it.`,
        body: `It has the size and the shortest trip, ${order.distance} to the customer's door, so the order goes straight to its packing bench.`,
        rows: [
          { left: "Central warehouse", right: "In stock · 18 km" },
          { left: order.store, right: `In stock · ${order.distance}` },
          { left: "Old Town store", right: "Out of size M" },
        ],
        active: 1,
        links: [{ label: "Order management", href: "/oms" }],
      },
    ],
  },
  pack: {
    id: "ch-pack",
    seq: "pack",
    alt: "At a stainless steel packing table a picker scans a kraft box and slides it onto a roller conveyor.",
    steps: [
      {
        label: "Pick and pack",
        headline: "The right box, first time.",
        body: "The picker's handheld shows exactly which shelf the overshirt sits on. Scanning it checks the item against the order before anything is packed.",
        rows: [
          { left: "1. Shelf B-14 shown on the handheld", right: "Now" },
          { left: "2. Scan confirms LIN-OVR-M-SND" },
          { left: "3. Label prints itself" },
          { left: "4. Box onto the conveyor" },
        ],
        active: 0,
      },
      {
        label: "Pick and pack",
        headline: "Packed and on its way.",
        body: "The label prints as the last item is scanned and the box rolls to dispatch. No re-typing, and the customer is told it has shipped.",
        rows: [
          { left: "1. Shelf B-14 shown on the handheld", right: "Done" },
          { left: "2. Scan confirms LIN-OVR-M-SND", right: "Done" },
          { left: "3. Label prints itself", right: "Done" },
          { left: "4. Box onto the conveyor", right: "Now" },
        ],
        active: 3,
        links: [{ label: "Warehouse management", href: "/wms" }],
      },
    ],
  },
  delivery: {
    id: "ch-delivery",
    seq: "delivery",
    alt: "A courier steps out of a parked delivery van and leaves a kraft box on the step of a house with a copper door.",
    steps: [
      {
        label: "Out for delivery",
        headline: "One route for every stop.",
        body: "The van's stops are ordered into one efficient loop, and the customer follows a live arrival time instead of an all-day window.",
        rows: [{ left: order.id, right: "Arriving in 12 min" }],
      },
      {
        label: "Delivered",
        headline: "On the doorstep, on time.",
        body: "The courier confirms the drop on the same system, so the store, the website and the customer all see it delivered at once.",
        rows: [{ left: order.id, right: "Delivered" }],
        links: [
          { label: "Transport management", href: "/tms" },
          { label: "Quick commerce", href: "/quick-commerce" },
        ],
      },
    ],
  },
  counter: {
    id: "ch-instore",
    seq: "counter",
    alt: "At a copper and travertine counter a customer taps a card on the terminal and the cashier hands over a paper shopping bag.",
    steps: [
      {
        label: "In the store, too",
        headline: "Tap, paid, done.",
        body: "The same system runs the counter. The customer taps to pay, the receipt goes to their phone, and the website's count drops before they reach the door.",
      },
      {
        label: "At the counter",
        headline: "Every in‑store tool on one system.",
        body: "Point of sale, finding a size in another store, scan-and-go kiosks and customer profiles all read the same catalog and the same stock.",
        rows: [
          { left: "Point of sale" },
          { left: "Endless aisle" },
          { left: "Self-checkout" },
          { left: "Clienteling" },
        ],
        links: [
          { label: "Point of sale", href: "/pos" },
          { label: "Endless aisle", href: "/endless-aisle" },
          { label: "Self-checkout", href: "/self-checkout" },
          { label: "Clienteling", href: "/clienteling" },
        ],
      },
    ],
  },
};

export const storefront = {
  eyebrow: "Storefront",
  headline: "Your rail, online.",
  body: "Every garment on the rail is already in your catalog with its sizes, price and stock. Decommerce turns that catalog into your shop website. Try it: drag the rail and open a piece.",
  links: [
    { label: "Storefront", href: "/storefront" },
    { label: "Brand showcase", href: "/storefront/brand-showcase" },
  ],
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
  alt: "A slow pan across the sunlit boutique: clothing rails, oak shelves, an olive tree and the copper counter.",
};

export const close = {
  eyebrow: "Book a demo",
  headline: "See it run on your catalog.",
  body: "Tell us what you sell and where. We'll show you a working store with a sample of your own products.",
  alt: "The boutique at dusk, lights glowing behind its glass front as the camera pulls back along the dark street.",
  film: {
    label: "Closing time",
    headline: "Every channel settled at the end of the day.",
    body: "Stock, orders and takings already agree across the website, the stores and the warehouse. Nothing to reconcile tonight.",
  },
};
