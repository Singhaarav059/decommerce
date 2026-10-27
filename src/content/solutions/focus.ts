import type { SolutionSlug } from "../site";

/** Centre of each anatomy part in its page's end keyframe, in percent [x, y] (set by reviewing each keyframe). */
export const solutionFocus: Partial<Record<SolutionSlug, Record<string, [number, number]>>> = {
  storefront: { screen: [37, 40], rail: [86, 38], desk: [32, 74] },
  "brand-showcase": { look: [47, 53], forms: [85, 44], table: [29, 79], stylist: [68, 41] },
  b2b: { portal: [32, 50], tiers: [32, 50], pallets: [76, 79], shelves: [94, 28] },
  "quick-commerce": { shelves: [13, 40], dispatch: [49, 53], rider: [63, 37], block: [90, 62] },
  marketplace: { product: [67, 52], camera: [76, 45], shelves: [94, 31] },
  oms: { printer: [31, 80], shelves: [22, 31], bag: [58, 66] },
  wms: { light: [94, 37], bins: [79, 69], scanner: [56, 50] },
  tms: { bay: [29, 85], van: [83, 47], boxes: [65, 44] },
  pos: { screen: [42, 53], reader: [34, 75], bag: [59, 56], counter: [38, 85] },
  clienteling: { tablet: [27, 64], rack: [49, 40], sizes: [27, 64], look: [61, 56] },
  "endless-aisle": { shelf: [62, 60], stack: [85, 30], network: [27, 82] },
  "self-checkout": { screen: [63, 40], scanner: [61, 60], bag: [51, 72] },
};
