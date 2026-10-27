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
  secondary: { label: "What we do", href: "#what-we-do" },
  posterAlt: "On the shop floor of a white and sage flagship, Ananya lays an ivory linen overshirt on the counter and Meera scans the sage hang tag on its collar.",
  arrival: "Every sale here, online or at the counter, runs through the same catalog and the same stock count.",
};

/** The hang tag on the hero: one shirt, one stock count that every channel reads. Try it. Illustrative. */
export const heroTag = {
  label: "Linen overshirt, Ivory",
  order: "ORD-1042",
  sizes: ["S", "M", "L"] as const,
  start: { S: 3, M: 2, L: 4 } as Record<"S" | "M" | "L", number>,
  unit: (size: string) => `in stock in size ${size}`,
  channels: ["Website", "Store", "Warehouse", "Marketplace"],
  sell: "Sell one at the counter",
  restock: "Restock",
  note: "Example. Every channel reads the same count.",
  hint: "Try it",
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
    alt: "A shop assistant lifts the last size M linen overshirt from an oak shelf and carries it away to a customer.",
    steps: [
      {
        label: "The problem",
        headline: "The last size M just sold.",
        body: "In most shops the till, the website and the marketplaces each keep their own count. The store has just sold its last overshirt in size M, but the website still says 4, so tonight someone buys a shirt that isn't there.",
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
    alt: "At a stainless steel packing table a picker scans the label on a kraft box, closes it and slides it onto a roller conveyor.",
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
    alt: "A courier carries a parcel from a parked van to a pale stone townhouse, hands it to the customer at her door and walks back to the van.",
    steps: [
      {
        label: "Out for delivery",
        headline: "One route for every stop.",
        body: "The van's stops are ordered into one efficient loop, and the customer follows a live arrival time instead of an all-day window.",
        rows: [{ left: order.id, right: "Arriving in 12 min" }],
      },
      {
        label: "Delivered",
        headline: "Into her hands, on time.",
        body: "The courier hands it over at the door and confirms on the same system, so the store, the website and the customer all see it delivered at once.",
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
    alt: "At a white terrazzo counter a customer taps her card on the terminal, keeps it, and the cashier hands over a paper shopping bag.",
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
  /** set huge behind the rail, so the garments hang in front of it */
  backdrop: "online.",
  eyebrow: "Storefront",
  headline: "Your rail, online.",
  body: "Every garment on the rail is already in your catalog with its sizes, price and stock. Decommerce turns that catalog into your shop website. Try it: scroll or drag along the rail and open a piece.",
  links: [
    { label: "Storefront", href: "/storefront" },
    { label: "Brand showcase", href: "/storefront/brand-showcase" },
  ],
};

/** Product cards floating over the hero film (illustrative data for the example order). */
export const heroCards = {
  tag: "Example",
  order: { label: "New order", id: "ORD-1042", item: "Linen overshirt · Size M", steps: ["Ordered", "Routed", "Packed"], route: "Riverside store", distance: "2.4 km" },
  stock: { label: "Stock · Linen overshirt M", value: "1", unit: "left across 4 channels", channels: ["Store", "Website", "Warehouse", "Marketplace"] },
  sync: "Website, store, warehouse and marketplace in sync",
};

/** The live system bento: example data only (the ORD-1042 story and its neighbours). */
export const live = {
  tag: "Example",
  orders: {
    title: "Orders today",
    rows: [
      { id: "ORD-1038", channel: "Store", where: "Old Town", status: "Delivered" },
      { id: "ORD-1039", channel: "Marketplace", where: "Central warehouse", status: "Packed" },
      { id: "ORD-1040", channel: "Website", where: "Riverside", status: "Delivered" },
      { id: "ORD-1041", channel: "Website", where: "Central warehouse", status: "Out for delivery" },
      { id: "ORD-1042", channel: "Website", where: "Riverside", status: "Routed" },
    ],
  },
  mix: { title: "Orders by channel this week", bars: [["Website", 46], ["Store", 31], ["Marketplace", 17], ["Wholesale", 6]] as [string, number][] },
  stock: { title: "Linen overshirt · M", channels: ["Store", "Website", "Warehouse", "Marketplace"], from: 3, sale: "Sold at the store counter" },
  route: { title: "Route 7", stop: "ORD-1042", eta: "12 min", note: "Riverside store to customer, 2.4 km" },
  till: { title: "Till 2", item: "Linen overshirt · M", paid: "Paid by tap", receipt: "Receipt sent to phone" },
  customer: { title: "Customer", initials: "AK", name: "Returning customer", size: "Usual size M", last: "Linen overshirt, today", seen: ["Website", "Store"] },
  sync: { title: "Channels", rows: ["Website", "Store", "Warehouse", "Marketplace"], note: "in sync" },
};

/** The problem as a motion graphic: four systems' counts for one shirt, pulled into one. */
export const collapse = {
  eyebrow: "The problem",
  before: { headline: "Four systems. Four different answers.", body: "Most shops run the website, the till, the warehouse and each marketplace on separate software. Each keeps its own count of the same shirt, and they disagree." },
  after: { headline: "One system. One answer.", body: "Decommerce keeps one stock count. The sale at the counter is the only number that matters, and every channel shows it at once." },
  systems: [
    { name: "Website", count: "4", note: "Still selling it" },
    { name: "Store till", count: "0", note: "Last one just sold" },
    { name: "Warehouse", count: "0", note: "Counted last night" },
    { name: "Marketplace", count: "6", note: "Synced yesterday" },
  ],
  one: { label: "One stock count", item: "Linen overshirt · M", count: "0", channels: ["Website", "Store", "Warehouse", "Marketplace"] },
  hint: "Illustrative counts for one shirt in size M.",
};

/** Follow one order: the horizontal journey. One sharp still per step (scripts/v7, scenes j-*). */
export const journey = {
  eyebrow: "Follow one order",
  headline: "ORD-1042, from click to doorstep.",
  body: "One linen overshirt in size M, ordered online on a quiet afternoon. Every step below runs on the same system.",
  steps: [
    { tag: "Paid online", title: "Ordered online", body: "The customer buys the last size M on the website. The order lands in Decommerce with the stock it reserves.", image: "/assets/journey/online.webp", ui: { title: "ORD-1042", rows: [["Item", "Linen overshirt · M"], ["Channel", "Website"], ["Payment", "Paid"]] }, href: "/storefront" },
    { tag: "2.4 km route", title: "Routed in a second", body: "Every store and warehouse is checked. Riverside has the size and the shortest trip, so it ships.", image: "/assets/journey/order.webp", ui: { title: "Routing", rows: [["Central warehouse", "18 km"], ["Riverside store", "2.4 km, chosen"], ["Old Town store", "No size M"]] }, href: "/oms" },
    { tag: "Scan confirmed", title: "Picked and packed", body: "The handheld shows the shelf, the scan confirms the item, the label prints and the box rolls to dispatch.", image: "/assets/journey/pack.webp", ui: { title: "Pick list", rows: [["Shelf", "B-14"], ["Scan", "LIN-OVR-M-SND"], ["Label", "Printed"]] }, href: "/wms" },
    { tag: "Handed over", title: "Into her hands", body: "The van follows one efficient route. The courier hands the parcel over at the door and confirms on the same system.", image: "/assets/journey/delivery.webp", ui: { title: "Delivery", rows: [["Route", "7 · stop 3"], ["ETA", "12 min"], ["Status", "Delivered"]] }, href: "/tms" },
    { tag: "Store shows 0", title: "And at the counter", body: "Back in the store the count already reads zero, so nobody sells a shirt that is not there. The next customer taps to pay.", image: "/assets/journey/counter.webp", ui: { title: "Same stock count", rows: [["Website", "0"], ["Store", "0"], ["Marketplace", "0"]] }, href: "/pos" },
  ],
};

/** Under the hero: Demaze's own numbers (the only figures on the site that are not examples). */
export const trust = {
  label: "Built and run by Demaze Technologies",
  stats: [
    { value: "45+", label: "projects delivered" },
    { value: "35+", label: "people on the team" },
    { value: "6", label: "years building software" },
  ],
};

/** Who Decommerce is for: three kinds of retailer and what each usually starts with. */
export const audiences = {
  eyebrow: "Who it's for",
  headline: "Built for brands and retailers of every size.",
  body: "Start with what your business needs today. The same platform carries you from one website to many stores and channels.",
  startLabel: "Usually starts with",
  more: "See the module",
  demo: "Book a demo",
  groups: [
    {
      title: "Growing brands",
      body: "Sell online and in your first stores without stitching tools together.",
      points: ["Storefront on your catalog", "Point of sale for your first stores", "One stock count from day one"],
      image: "/assets/sol/storefront/beats/d/001.webp",
      href: "/storefront",
    },
    {
      title: "Multi-channel retailers",
      body: "Keep website, stores and marketplaces on one catalog and one stock count.",
      points: ["Marketplace listings from one catalog", "Order routing across locations", "Returns from any channel"],
      image: "/assets/sol/marketplace/beats/d/001.webp",
      href: "/oms",
    },
    {
      title: "Large retailers and wholesalers",
      body: "Run many stores, warehouses and trade accounts with systems built for scale.",
      points: ["Warehouse and delivery management", "B2B portal with contract prices", "A named team and support"],
      image: "/assets/sol/b2b/beats/d/001.webp",
      href: "/wms",
    },
  ],
};

/** How Decommerce compares with the usual alternatives. Qualitative only. */
export const compare = {
  eyebrow: "How it compares",
  headline: "One platform, set up and run with you.",
  body: "Most retailers piece their commerce together. Here is how that compares with running it all on Decommerce.",
  columns: ["Website builder and plugins", "Separate systems per channel", "Decommerce"],
  rows: [
    { area: "Channels", cells: ["Website only", "Each channel on its own tool", "Website, stores, warehouse, delivery and marketplaces"] },
    { area: "Stock", cells: ["Synced by plugins, often late", "A different count in each system", "One stock count everywhere"] },
    { area: "In-store", cells: ["Usually not covered", "A separate till system", "Point of sale, clienteling, endless aisle, self-checkout"] },
    { area: "Delivery", cells: ["Couriers only", "A separate logistics tool", "Order routing, warehouse and delivery built in"] },
    { area: "Setup", cells: ["You do it yourself", "Several vendors and projects", "One team migrates, connects and trains"] },
    { area: "After launch", cells: ["Forums and tickets", "Each vendor separately", "The same team runs and improves it with you"] },
  ],
};

/** Ask an AI assistant about Decommerce (prefilled question). */
export const askAi = {
  title: "Curious if Decommerce is right for you?",
  body: "Let an AI assistant do the research. Each button opens it with a question about Decommerce.",
  prompt: "What is Decommerce (unified commerce from Demaze Technologies)? What does it cover across online, supply chain and in-store, and what kind of retailer is it a good fit for?",
};

/** The ribbon under the hero. */
export const ribbon = ["One catalog", "One stock count", "One customer record", "Storefront", "Order management", "Warehouse", "Delivery", "Point of sale", "Clienteling", "Marketplaces"];

/** Right after the hero: what Decommerce actually is. A service, not a website. */
export const service = {
  team: { image: "/assets/company/team-setup.webp", alt: "Two members of the Decommerce team at a round table with a retailer, walking her through the stock dashboard on a laptop while a colleague looks on." },
  idea: {
    eyebrow: "The idea",
    headline: "One stock count, read by every channel at the same moment.",
    steps: ["The last size M sells at the store counter.", "The one stock count drops to zero.", "Website, warehouse and marketplace show zero at once. Nobody oversells."],
  },
  eyebrow: "What we do",
  headline: "Not a website. A system we run.",
  body: "Decommerce is software plus the team that puts it to work. We connect your website, stores, warehouse and marketplaces to one catalog, move your data across, train your staff and stay with you after launch.",
  pillars: [
    {
      title: "The platform",
      body: "Twelve modules for selling online, moving stock and serving customers in the store, all reading one catalog, one stock count and one customer record.",
      points: ["Storefront, B2B and marketplaces", "Orders, warehouse and delivery", "Till, kiosks and clienteling"],
    },
    {
      title: "The setup",
      body: "We do the switching for you: products, prices, stock and customers move across, and the tools you keep are connected rather than replaced.",
      points: ["Catalog and data migration", "Payment, courier and marketplace connections", "Staff training in the store and warehouse"],
    },
    {
      title: "The running",
      body: "After go-live the same team stays on. We watch the system, ship updates, and tune routing, stock and pricing rules as your season shows what works.",
      points: ["One team that knows your business", "Updates without downtime", "Changes as you add stores or channels"],
    },
  ],
};

/** A statement whose words light up as it scrolls through. */
export const statement = "Customers see one shop. So should you.";

/** After the problem film: where separate systems cost a retailer, and what changes. */
export const costs = {
  eyebrow: "Where it costs you",
  headline: "Six places sales leak.",
  body: "Most retailers grow one channel at a time, so each one gets its own software. Each system keeps its own copy of the truth, and staff spend their evenings making the copies agree.",
  columns: { area: "Where it shows", without: "With separate systems", with: "With Decommerce" },
  toggle: { without: "Separate systems", with: "With Decommerce", hint: "Illustrative figures for one linen overshirt in size M." },
  rows: [
    {
      area: "Stock",
      without: "Each channel counts its own stock, so the website sells items the store has already sold.",
      with: "One stock count. A sale anywhere updates every channel at the same moment.",
      visual: { kind: "counts", labels: ["Store", "Web", "Warehouse", "Market"], without: ["0", "4", "0", "6"], with: ["0", "0", "0", "0"] },
    },
    {
      area: "Orders",
      without: "Online orders ship from a fixed warehouse, even when a store nearby has the item.",
      with: "Each order goes to the location that can deliver it fastest, store or warehouse.",
      visual: { kind: "big", without: "18 km", with: "2.4 km", note: { without: "from the central warehouse", with: "from the Riverside store" } },
    },
    {
      area: "Customers",
      without: "The till, the website and the loyalty tool each know a different part of the customer.",
      with: "One customer record, so staff see every purchase and preference at the counter.",
      visual: { kind: "big", without: "3", with: "1", note: { without: "partial profiles of one person", with: "complete profile" } },
    },
    {
      area: "Prices",
      without: "Prices and promotions are typed into each system and drift apart.",
      with: "Set a price once and it applies everywhere it should.",
      visual: { kind: "big", without: "3", with: "1", note: { without: "prices for the same shirt", with: "price, everywhere" } },
    },
    {
      area: "Reporting",
      without: "Numbers are exported, merged in spreadsheets and argued over.",
      with: "One set of numbers for stores, website and warehouse, every morning.",
      visual: { kind: "word", without: "Spreadsheets", with: "Every morning" },
    },
    {
      area: "New channels",
      without: "Adding a marketplace or a store means another integration project.",
      with: "A new channel reads the same catalog and stock from its first day.",
      visual: { kind: "word", without: "A new project", with: "Day one" },
    },
  ],
};

/** The 12 modules as one index. */
export const modules = {
  eyebrow: "The platform",
  headline: "Twelve modules. One catalog underneath.",
  body: "Start with the module that hurts most today and add the rest when you are ready. Every module reads the same products, stock and customers, so nothing needs re-entering.",
  count: (n: number) => `${n} modules`,
};

/** How an engagement runs, step by step, and what the client has at the end of each step. */
export const engagement = {
  eyebrow: "How we work with you",
  headline: "From first call to a running system.",
  body: "Every engagement follows the same four steps. You keep selling the whole time: modules go live one at a time next to what you run today.",
  steps: [
    { title: "Discover", body: "We map how you sell today: channels, stores, warehouses, stock rules and the gaps between them.", result: "A written map of your current setup and a plan for which module goes first." },
    { title: "Design", body: "We design one catalog and one stock model around your real products, sizes, locations and prices.", result: "Your catalog, stock and pricing modelled in Decommerce and demoed on your own data." },
    { title: "Build and connect", body: "Modules go live one at a time. We migrate data, connect payments, couriers and marketplaces, and train staff.", result: "Each module live in production, with your team trained to use it." },
    { title: "Run and improve", body: "We stay on through the first season and beyond, watching the numbers and tuning the rules.", result: "A named team, regular reviews and changes as your business grows." },
  ],
};

export const homeFaq = {
  eyebrow: "Questions",
  headline: "What retailers ask us first.",
  items: [
    { q: "Do we have to replace everything at once?", a: "No. Most retailers start with one module, usually orders or the till, and add the rest over time. Decommerce connects to the systems you keep." },
    { q: "Can we keep our current website or ERP?", a: "Yes. Decommerce can sit behind an existing website or alongside an ERP, sharing catalog, stock and orders with them." },
    { q: "Is this a website builder?", a: "No. The storefront is one of twelve modules. Decommerce is the system behind every channel, delivered and run by our team." },
    { q: "Who owns our data?", a: "You do. Your products, customers and orders stay yours, and you can export them at any time." },
    { q: "How long does it take to go live?", a: "It depends on how many modules and locations you start with. We agree a dated plan at the end of the Discover step, before any build work starts." },
    { q: "What happens after launch?", a: "The team that set you up stays on: monitoring, updates, support for your staff and changes as you add stores or channels." },
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
    { title: "Discover", body: "We map how you sell today: channels, stock, stores and the gaps between them." },
    { title: "Design", body: "One catalog and one stock model, designed around your real products." },
    { title: "Build", body: "Modules go live one at a time, so nothing stops selling while you switch." },
    { title: "Launch", body: "We stay on through the first season and tune what the data shows." },
  ],
  alt: "A slow pan across the bright white boutique: rails of sage and white clothes, pale wood shelves, olive trees and the counter.",
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
