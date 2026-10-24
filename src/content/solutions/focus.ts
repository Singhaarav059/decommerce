import type { SolutionSlug } from "../site";

/** Centre of each anatomy part in its page's end still, in percent [x, y] (set by reviewing each still). */
export const solutionFocus: Partial<Record<SolutionSlug, Record<string, [number, number]>>> = {
  storefront: { screen: [74, 43], rail: [52, 35], desk: [88, 66] },
  "brand-showcase": { look: [83, 40], forms: [64, 38], table: [74, 85], stylist: [92, 47] },
  b2b: { portal: [94, 47], tiers: [94, 47], pallets: [57, 62], shelves: [72, 25] },
  "quick-commerce": { shelves: [52, 52], dispatch: [69, 70], rider: [81, 42], block: [86, 35] },
  marketplace: { product: [66, 60], camera: [76, 50], shelves: [93, 40] },
  oms: { printer: [64, 56], shelves: [62, 30], bag: [75, 53] },
  wms: { light: [70, 49], bins: [80, 30], scanner: [76, 46] },
  tms: { bay: [62, 80], van: [68, 52], boxes: [70, 50] },
  pos: { screen: [72, 46], reader: [81, 52], bag: [49, 51], counter: [55, 75] },
  clienteling: { tablet: [70, 48], rack: [83, 40], sizes: [70, 48], look: [81, 55] },
  "endless-aisle": { shelf: [64, 45], stack: [60, 32], network: [73, 49] },
  "self-checkout": { screen: [61, 40], scanner: [62, 62], bag: [52, 72] },
};
