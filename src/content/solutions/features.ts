// What each module includes (the feature grid on solution pages) and the kinds of systems it
// connects to. Capabilities only, no figures. Owner to confirm availability per module (LAUNCH.md).
import type { SolutionSlug } from "../site";

export type Feature = { title: string; body: string };

export const features: Record<SolutionSlug, Feature[]> = {
  storefront: [
    { title: "Store built from your catalog", body: "Products, sizes, prices and photos come straight from the one catalog, so the site is never out of date." },
    { title: "Live stock on every page", body: "Shoppers see what is really available across your stores and warehouse, down to the size." },
    { title: "Checkout and payments", body: "A short checkout with cards, wallets and gift cards through your payment provider." },
    { title: "Search and filters", body: "Shoppers find by size, colour, fabric and price, using the attributes already in your catalog." },
    { title: "Delivery or collect in store", body: "Each order can ship from the nearest location or wait at a store for collection." },
    { title: "SEO and fast pages", body: "Clean URLs, structured data and quick pages on phones, built in rather than added later." },
  ],
  "brand-showcase": [
    { title: "Looks from your catalog", body: "Stylists put pieces together into outfits using products that already exist in the catalog." },
    { title: "Shop the whole look", body: "Customers add every piece in their size to the bag in one step." },
    { title: "Same looks online and in store", body: "A look styled once appears on the website and on the store tablet." },
    { title: "Stock-aware looks", body: "Pieces that sell out are flagged so a look never shows something nobody can buy." },
    { title: "Campaign pages", body: "Group looks into a seasonal edit or a lookbook without a developer." },
    { title: "Performance by look", body: "See which looks are viewed, added and bought, and which pieces carry them." },
  ],
  b2b: [
    { title: "Buyer accounts", body: "Each wholesale customer gets its own login, buyers and delivery addresses." },
    { title: "Price tiers and contract prices", body: "Tiered or negotiated prices per account, set once and applied automatically." },
    { title: "Bulk and quick order", body: "Order by size grid or SKU list, including full cases and minimum quantities." },
    { title: "Approvals and credit", body: "Orders can need sign-off, and accounts can buy on agreed credit terms." },
    { title: "Reorders", body: "Repeat a past order in one step, adjusted to what is in stock today." },
    { title: "Same stock as retail", body: "Wholesale and retail draw on one stock count, so neither oversells the other." },
  ],
  "quick-commerce": [
    { title: "Delivery zones", body: "Define the streets each dark store serves and how fast it can deliver to them." },
    { title: "Fast picking", body: "Pickers get an ordered list for each basket so it is ready in minutes." },
    { title: "Rider assignment", body: "Orders go to the nearest free rider, with the route on their phone." },
    { title: "Live tracking for customers", body: "Customers follow the rider and see a real arrival time." },
    { title: "Dark store stock", body: "Each dark store keeps its own count inside the one system, refilled from the warehouse." },
    { title: "Slot and capacity control", body: "Pause or slow orders when a store is busy so promises stay realistic." },
  ],
  marketplace: [
    { title: "List once", body: "Publish a product to several marketplaces from the same catalog entry." },
    { title: "Shared stock count", body: "Marketplaces sell from the one stock count, so the last item is never sold twice." },
    { title: "Orders in one place", body: "Marketplace orders arrive in Decommerce with all the others and follow the same routing." },
    { title: "Prices per channel", body: "Set a different price or promotion per marketplace where you need to." },
    { title: "Listing health", body: "Catch missing attributes or rejected listings before they cost sales." },
    { title: "Returns and settlements", body: "Track marketplace returns and match what each channel owes you." },
  ],
  oms: [
    { title: "One order queue", body: "Website, store, wholesale and marketplace orders in one place, with one status for each." },
    { title: "Rule-based routing", body: "Send each order to the location that can fulfil it best: nearest with stock, cheapest or least busy." },
    { title: "Split shipments", body: "When no single location has everything, the order splits and the customer is told." },
    { title: "Returns anywhere", body: "Take a return in any store or by post, whatever channel it was bought on." },
    { title: "Bundles and partial orders", body: "Handle sets, bundles and part-fulfilled orders without manual work." },
    { title: "Invoices and labels", body: "Invoices and shipping labels are created automatically as orders move." },
  ],
  wms: [
    { title: "Bin locations", body: "Every item has a bin, so pickers walk straight to it." },
    { title: "Guided picking", body: "Pick lists in walking order on a handheld, with the next bin shown." },
    { title: "Scan to confirm", body: "Every item is scanned against the order before it is packed." },
    { title: "Packing and labels", body: "The right box, a packing slip and a shipping label at the packing station." },
    { title: "Receiving and put-away", body: "Deliveries are checked in against purchase orders and put away into bins." },
    { title: "Cycle counts", body: "Count a few bins a day instead of closing for a full stocktake." },
  ],
  tms: [
    { title: "Route planning", body: "Stops are ordered into efficient routes for each van." },
    { title: "Dispatch", body: "Assign routes to drivers and vans and change them as the day moves." },
    { title: "Driver app", body: "Drivers see their stops, navigate and confirm each delivery." },
    { title: "Live ETA for customers", body: "Customers get a real arrival time instead of an all-day window." },
    { title: "Proof of delivery", body: "Delivery is confirmed at the door, visible to the store and the customer at once." },
    { title: "Carriers and 3PL", body: "Hand some orders to courier partners and track them alongside your own vans." },
  ],
  pos: [
    { title: "Fast sale screen", body: "Big, simple buttons, scanning, discounts and gift cards." },
    { title: "Tap, chip and phone payments", body: "Through card readers from your payment partner." },
    { title: "Returns from any channel", body: "Return anything bought online or in another store." },
    { title: "Customer at the till", body: "Look up a customer, see their history and save the sale to them." },
    { title: "Works offline", body: "Sales continue when the internet drops and sync when it is back." },
    { title: "Store and shift reports", body: "Takings, cash-up and best sellers per till, per shift, per store." },
  ],
  clienteling: [
    { title: "Customer profiles", body: "Sizes, preferences and everything bought online and in store, on the associate's tablet." },
    { title: "Recommendations", body: "Suggest pieces that fit what the customer already owns and likes." },
    { title: "Appointments", body: "Book styling sessions and have pieces ready in the right sizes." },
    { title: "Wishlists and outreach", body: "Save pieces for a customer and let them know when they arrive." },
    { title: "Sell from the tablet", body: "Take the sale or order from another store without walking to the till." },
    { title: "Consent built in", body: "Contact preferences are respected and recorded on the customer record." },
  ],
  "endless-aisle": [
    { title: "Search every location", body: "Find a size or colour in any store or the warehouse from the shop floor." },
    { title: "Order for delivery", body: "Order it to the customer's home or to this store for collection." },
    { title: "Pay in store", body: "The customer pays at the till or on the associate's device." },
    { title: "Credit to the right store", body: "The store that made the sale gets the credit, whoever ships it." },
    { title: "Order status", body: "Associates and customers can follow the order until it arrives." },
    { title: "Fewer lost sales", body: "See which items were ordered because the shelf was empty, to plan stock better." },
  ],
  "self-checkout": [
    { title: "Scan and pay", body: "Customers scan, pay and bag at a kiosk in one step." },
    { title: "Same prices and promotions", body: "Kiosks use the same prices and offers as the tills." },
    { title: "Staff assist", body: "Kiosks call an associate for age checks, help or security tags." },
    { title: "Mixed payment", body: "Cards, phones and gift cards at the kiosk." },
    { title: "Receipts by email", body: "Customers can take a paper receipt or get it on their phone." },
    { title: "Same stock count", body: "Every kiosk sale updates the one stock count at once." },
  ],
};

/** The kinds of systems each module usually connects to (categories, not named products). */
export const connects: Record<SolutionSlug, string[]> = {
  storefront: ["Payment providers", "Couriers", "Analytics", "Email and SMS"],
  "brand-showcase": ["Your storefront", "Store tablets", "Photo library"],
  b2b: ["ERP", "Accounting", "Payment providers", "Couriers"],
  "quick-commerce": ["Rider apps", "Maps", "Payment providers"],
  marketplace: ["Marketplaces", "Couriers", "Accounting"],
  oms: ["ERP", "Warehouses and 3PL", "Couriers", "Marketplaces"],
  wms: ["Handheld scanners", "Label printers", "ERP", "Couriers"],
  tms: ["Courier partners", "Maps", "Driver phones"],
  pos: ["Card readers", "Receipt printers", "Scanners", "Accounting"],
  clienteling: ["Store tablets", "Email and SMS", "Appointment calendars"],
  "endless-aisle": ["Store tablets", "Payment providers", "Couriers"],
  "self-checkout": ["Kiosk hardware", "Card readers", "Receipt printers"],
};
