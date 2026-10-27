// Frame sequences still on the site: the old hero film (lab page only) and the closing chapter's dusk keyframes.
// The journey and every other scene are sharp keyframe stills now (scripts/v7).
// `floor` is the scene's floor colour for the phone text panel, lightened where needed so ink and accent text pass contrast (scripts/v3/floor.py).

export const sequences = {
  hero: { pattern: "/assets/seq/hero/d/{i}.webp", mobilePattern: "/assets/seq/hero/m/{i}.webp", count: 48, floor: "#f1f3f1" },
  close: { pattern: "/assets/seq/close/beats/d/{i}.webp", mobilePattern: "/assets/seq/close/beats/m/{i}.webp", count: 2, floor: "#95a2bd", blend: true, focus: [70, 50] as [number, number], push: 0.04 },
} as const;
