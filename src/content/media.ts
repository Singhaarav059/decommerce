// Frame sequences for the homepage films (Veo footage → scripts/frames-from-video.sh).
// Sources live in assets-src/vertex; the ledger there records what each cost.

export const sequences = {
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
  /** Homepage chapter 8: tap to pay at the counter (ch8-counter-v2-1080.mp4, from ref-counter) */
  counter: { pattern: "/assets/seq/counter/d/{i}.webp", mobilePattern: "/assets/seq/counter/m/{i}.webp", count: 48 },
  /** Homepage chapter 9: store orbit (orbit-169-1080.mp4) */
  orbit: { pattern: "/assets/seq/orbit/d/{i}.webp", mobilePattern: "/assets/seq/orbit/m/{i}.webp", count: 48 },
  /** Homepage chapter 10: dusk, shutter comes down (ch10-dusk-1080.mp4 reversed) */
  close: { pattern: "/assets/seq/close/d/{i}.webp", mobilePattern: "/assets/seq/close/m/{i}.webp", count: 48 },
  /** Homepage chapter 4: rail track → laptop push-in (assets-src/vertex/ch4-film.mp4) */
  storefront: { pattern: "/assets/seq/storefront/d/{i}.webp", mobilePattern: "/assets/seq/storefront/m/{i}.webp", count: 61 },
} as const;
