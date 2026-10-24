import type { AlphaClip } from "@/components/media/AlphaVideo";

// Registry of rendered media. Placeholder entries are Blender renders from
// scripts/blender; swap the files, keep the keys.

export const clips = {
  /** Placeholder for the AI character loops (cashier, picker, shopper, rider). */
  walker: {
    webm: "/assets/video/placeholder-walker.webm",
    hevc: "/assets/video/placeholder-walker.mov",
    poster: "/assets/video/placeholder-walker.webp",
    width: 540,
    height: 960,
  },
} satisfies Record<string, AlphaClip>;

export const sequences = {
  labOrbit: { pattern: "/assets/seq/lab-orbit/d/{i}.webp", mobilePattern: "/assets/seq/lab-orbit/m/{i}.webp", count: 60 },
  /** Homepage hero: Veo push-in from ref-diorama (assets-src/vertex/hero-pushin-169-1080.mp4) via scripts/frames-from-video.sh */
  hero: { pattern: "/assets/seq/hero/d/{i}.webp", mobilePattern: "/assets/seq/hero/m/{i}.webp", count: 48 },
  /** Homepage chapters 2–3: islands arc + joined-store move, crossfaded (assets-src/vertex/ch23-film.mp4) */
  islands: { pattern: "/assets/seq/islands/d/{i}.webp", mobilePattern: "/assets/seq/islands/m/{i}.webp", count: 61 },
  /** Homepage chapter 5: city district push-in (ch5-city-1080.mp4) */
  order: { pattern: "/assets/seq/order/d/{i}.webp", mobilePattern: "/assets/seq/order/m/{i}.webp", count: 48 },
  /** Homepage chapter 6: picker scans and ships (ch6-pack-1080.mp4, from ref-packing) */
  pack: { pattern: "/assets/seq/pack/d/{i}.webp", mobilePattern: "/assets/seq/pack/m/{i}.webp", count: 48 },
  /** Homepage chapter 7: van to the doorstep (ch7-van-film.mp4, Lite draft trimmed + upscaled) */
  van: { pattern: "/assets/seq/van/d/{i}.webp", mobilePattern: "/assets/seq/van/m/{i}.webp", count: 50 },
  /** Homepage chapter 8: tap to pay at the counter (ch8-counter-1080.mp4, from ref-counter) */
  counter: { pattern: "/assets/seq/counter/d/{i}.webp", mobilePattern: "/assets/seq/counter/m/{i}.webp", count: 48 },
  /** Homepage chapter 9: store orbit (orbit-169-1080.mp4) */
  orbit: { pattern: "/assets/seq/orbit/d/{i}.webp", mobilePattern: "/assets/seq/orbit/m/{i}.webp", count: 48 },
  /** Homepage chapter 10: dusk, shutter comes down (ch10-dusk-1080.mp4 reversed) */
  close: { pattern: "/assets/seq/close/d/{i}.webp", mobilePattern: "/assets/seq/close/m/{i}.webp", count: 48 },
  /** Homepage chapter 4: rail track → laptop push-in (assets-src/vertex/ch4-film.mp4) */
  storefront: { pattern: "/assets/seq/storefront/d/{i}.webp", mobilePattern: "/assets/seq/storefront/m/{i}.webp", count: 61 },
  /** Homepage chapter 7, captured from scenes/delivery by scripts/capture-sequence.mjs */
  delivery: { pattern: "/assets/seq/delivery/d/{i}.webp", mobilePattern: "/assets/seq/delivery/m/{i}.webp", count: 72 },
} as const;

/** Stills captured from the live scenes by scripts/posters.mjs (desktop 16:10-ish, mobile portrait). */
export type PosterSet = { desktop: string; mobile: string };
export const posters = {
  world: { desktop: "/assets/posters/world-d.webp", mobile: "/assets/posters/world-m.webp" },
  orders: { desktop: "/assets/posters/orders-d.webp", mobile: "/assets/posters/orders-m.webp" },
  packing: { desktop: "/assets/posters/packing-d.webp", mobile: "/assets/posters/packing-m.webp" },
  rooms: { desktop: "/assets/posters/rooms-d.webp", mobile: "/assets/posters/rooms-m.webp" },
  laptop: { desktop: "/assets/posters/laptop-d.webp", mobile: "/assets/posters/laptop-m.webp" },
  pos: { desktop: "/assets/posters/pos-d.webp", mobile: "/assets/posters/pos-m.webp" },
  aisle: { desktop: "/assets/posters/aisle-d.webp", mobile: "/assets/posters/aisle-m.webp" },
  kiosk: { desktop: "/assets/posters/kiosk-d.webp", mobile: "/assets/posters/kiosk-m.webp" },
} satisfies Record<string, PosterSet>;


/** Poster of a solution page's hero scene (captured by scripts/posters.mjs --solutions). */
export function solutionPoster(slug: string): PosterSet {
  return { desktop: `/assets/posters/sol-${slug}-d.webp`, mobile: `/assets/posters/sol-${slug}-m.webp` };
}
