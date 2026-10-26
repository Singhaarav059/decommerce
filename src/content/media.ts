// Frame sequences for the homepage films: one continuous Veo shot per section
// (assets-src/vertex/v6-<key>.mp4, stills in assets-src/stills/v6) → scripts/v6/build.mjs.
// `floor` is the scene's floor colour for the phone text panel, lightened where needed so ink and accent text pass contrast (scripts/v3/floor.py).

export const sequences = {
  hero: { pattern: "/assets/seq/hero/d/{i}.webp", mobilePattern: "/assets/seq/hero/m/{i}.webp", count: 48, floor: "#f1f3f1" },
  problem: { pattern: "/assets/seq/problem/d/{i}.webp", mobilePattern: "/assets/seq/problem/m/{i}.webp", count: 48, floor: "#c9baaa" },
  order: { pattern: "/assets/seq/order/d/{i}.webp", mobilePattern: "/assets/seq/order/m/{i}.webp", count: 48, floor: "#c7bec2" },
  pack: { pattern: "/assets/seq/pack/d/{i}.webp", mobilePattern: "/assets/seq/pack/m/{i}.webp", count: 48, floor: "#e6e0e5" },
  delivery: { pattern: "/assets/seq/delivery/d/{i}.webp", mobilePattern: "/assets/seq/delivery/m/{i}.webp", count: 48, floor: "#e4e1e2" },
  counter: { pattern: "/assets/seq/counter/d/{i}.webp", mobilePattern: "/assets/seq/counter/m/{i}.webp", count: 48, floor: "#bebbbf" },
  proof: { pattern: "/assets/seq/proof/d/{i}.webp", mobilePattern: "/assets/seq/proof/m/{i}.webp", count: 48, floor: "#bfbcb9" },
  close: { pattern: "/assets/seq/close/d/{i}.webp", mobilePattern: "/assets/seq/close/m/{i}.webp", count: 48, floor: "#14202d" },
} as const;
