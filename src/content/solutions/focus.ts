import type { SolutionSlug } from "../site";

/** Centre of each anatomy part in its page's still, in percent [x, y] (set by reviewing each still). */
export const solutionFocus: Partial<Record<SolutionSlug, Record<string, [number, number]>>> = {
  storefront: { screen: [28, 35], reader: [69, 48], box: [80, 33], counter: [55, 78] },
  "brand-showcase": { frame: [37, 20], row: [62, 20], wall: [18, 45], bench: [60, 77] },
  b2b: { portal: [79, 30], tiers: [80, 38], pallets: [58, 52], shelves: [90, 30] },
  "quick-commerce": { shelves: [26, 57], dispatch: [44, 70], rider: [58, 77], block: [75, 32] },
  marketplace: { box: [57, 64], shelf: [40, 42], badge: [62, 28], count: [50, 55] },
  oms: { lanes: [28, 35], split: [36, 40], inbox: [78, 57] },
  wms: { bins: [66, 15], scanner: [46, 50], printer: [67, 52], conveyor: [20, 40] },
  tms: { bay: [45, 25], route: [55, 55], stop: [82, 78] },
  pos: { screen: [72, 37], reader: [84, 46], box: [63, 47], counter: [55, 76] },
  clienteling: { tablet: [55, 72], rack: [42, 30], sizes: [60, 66], look: [52, 78] },
  "endless-aisle": { shelf: [18, 70], stack: [35, 58], network: [78, 45] },
  "self-checkout": { screen: [55, 30], scanner: [63, 45], bag: [58, 88] },
};
