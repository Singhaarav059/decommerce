// Frame sequences for the homepage films: one continuous Veo shot per section
// (assets-src/vertex/v3-<key>.mp4, stills in assets-src/stills/v3) → scripts/frames-from-video.sh.
// `floor` is the scene's floor colour for the phone text panel, lightened where needed so ink and copper text pass contrast (scripts/v3/floor.py).

export const sequences = {
  hero: { pattern: "/assets/seq/hero/d/{i}.webp", mobilePattern: "/assets/seq/hero/m/{i}.webp", count: 48, floor: "#ccb9a8" },
  problem: { pattern: "/assets/seq/problem/d/{i}.webp", mobilePattern: "/assets/seq/problem/m/{i}.webp", count: 48, floor: "#dec5ad" },
  order: { pattern: "/assets/seq/order/d/{i}.webp", mobilePattern: "/assets/seq/order/m/{i}.webp", count: 48, floor: "#d1c0b7" },
  pack: { pattern: "/assets/seq/pack/d/{i}.webp", mobilePattern: "/assets/seq/pack/m/{i}.webp", count: 48, floor: "#cfb8a0" },
  delivery: { pattern: "/assets/seq/delivery/d/{i}.webp", mobilePattern: "/assets/seq/delivery/m/{i}.webp", count: 48, floor: "#cdb9ae" },
  counter: { pattern: "/assets/seq/counter/d/{i}.webp", mobilePattern: "/assets/seq/counter/m/{i}.webp", count: 48, floor: "#d7c4af" },
  proof: { pattern: "/assets/seq/proof/d/{i}.webp", mobilePattern: "/assets/seq/proof/m/{i}.webp", count: 33, floor: "#cfb9a5" },
  close: { pattern: "/assets/seq/close/d/{i}.webp", mobilePattern: "/assets/seq/close/m/{i}.webp", count: 45, floor: "#052444" },
} as const;
