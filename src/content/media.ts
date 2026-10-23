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

