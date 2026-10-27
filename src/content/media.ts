// Frame sequences still on the site: the old hero film (lab page only) and the closing chapter (its dusk film
// between two sharp keyframes, scripts/v7/build.mjs; holds on each keyframe).
// The journey and every other scene are sharp keyframe stills now (scripts/v7).
// `floor` is the scene's floor colour for the phone text panel, lightened where needed so ink and accent text pass contrast (scripts/v3/floor.py).

export const sequences = {
  hero: { pattern: "/assets/seq/hero/d/{i}.webp", mobilePattern: "/assets/seq/hero/m/{i}.webp", count: 48, floor: "#f1f3f1" },
  close: { pattern: "/assets/seq/close/motion/d/{i}.webp", mobilePattern: "/assets/seq/close/motion/m/{i}.webp", count: 64, keys: [0, 63] as number[], floor: "#95a2bd", focus: [70, 50] as [number, number], push: 0.03 },
} as const;
