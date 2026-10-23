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
} as const;
