// Integrations: how Decommerce sits on top of what a retailer already runs. Categories only;
// named connectors are listed once the owner confirms which exist (LAUNCH.md).

export const integrations = {
  meta: {
    title: "Integrations",
    description: "Decommerce connects to the ERP, accounting, payments, couriers and marketplaces you already use, so you can move one step at a time.",
  },
  eyebrow: "Integrations",
  headline: "Works with what you run today.",
  body: "You don't have to rip anything out. Decommerce connects to the systems you keep and takes over from the ones you retire, one step at a time, with no downtime.",
  steps: [
    { title: "Connect", body: "We link your ERP, accounting, existing website, warehouses and couriers to Decommerce." },
    { title: "Sync", body: "Products, stock, prices, orders and customers stay in step between Decommerce and every connected system." },
    { title: "Migrate", body: "Move channels and data across at your own pace, one module and one location at a time." },
    { title: "Consolidate", body: "Retire the tools Decommerce replaces, so there are fewer systems to pay for and reconcile." },
  ],
  categories: [
    { name: "ERP", body: "Products, prices and purchase orders flow in; sales and stock movements flow back." },
    { name: "Accounting", body: "Daily takings, refunds and payouts posted for your finance team." },
    { name: "Payments", body: "Card, wallet and gift card payments online and at the till, through your payment provider." },
    { name: "Couriers and 3PL", body: "Labels, tracking and delivery updates from your delivery partners." },
    { name: "Marketplaces", body: "Listings, stock and orders shared with the marketplaces you sell on." },
    { name: "Existing website", body: "Keep your current site and let Decommerce run catalog, stock and orders behind it." },
    { name: "Store hardware", body: "Card readers, scanners, receipt and label printers, kiosks and tablets." },
    { name: "Messaging", body: "Order and delivery updates by email and SMS through your provider." },
  ],
  apis: { title: "APIs and webhooks", body: "For anything without a ready connection, Decommerce has APIs and webhooks for catalog, stock, orders and customers, and our team builds the link with you." },
  faq: [
    { q: "Do we have to replace our ERP?", a: "No. Decommerce runs alongside your ERP and keeps products, stock and orders in sync with it." },
    { q: "Can we keep our current website?", a: "Yes. Decommerce can sit behind an existing website, running catalog, stock and orders while your site stays the front end." },
    { q: "What if a system we use isn't listed?", a: "Tell us what it is. If there is no ready connection, our team builds one with you using the Decommerce APIs." },
    { q: "Is there downtime when we switch?", a: "No planned downtime. Each module goes live next to what you run today before anything is switched off." },
  ],
};
