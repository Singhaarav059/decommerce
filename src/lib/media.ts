// Shared media helpers for alpha video and frame sequences.

/** Safari plays HEVC-with-alpha but not VP9 alpha; everyone else gets WebM VP9. */
export function prefersHevcAlpha(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /^((?!chrome|android|crios|fxios).)*safari/i.test(ua) || /iP(hone|ad|od)/.test(ua);
}

export function pickAlphaSource(src: { webm: string; hevc: string }) {
  return prefersHevcAlpha() ? src.hevc : src.webm;
}

/** Visitors asking for less data or motion get posters instead of moving media. */
export function wantsStill(): boolean {
  if (typeof window === "undefined") return true;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return matchMedia("(prefers-reduced-motion: reduce)").matches || !!conn?.saveData;
}

/** "/seq/delivery/{i}.webp" + 7 → "/seq/delivery/007.webp" */
export function frameUrl(pattern: string, i: number, pad = 3) {
  return pattern.replace("{i}", String(i).padStart(pad, "0"));
}

/** Load order that makes any scroll position look right early: ends first, then halving strides. */
export function progressiveOrder(count: number): number[] {
  const seen = new Set<number>();
  const order: number[] = [];
  const push = (i: number) => {
    if (i >= 0 && i < count && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  push(0);
  push(count - 1);
  for (let stride = 2 ** Math.floor(Math.log2(Math.max(1, count))); stride >= 1; stride /= 2) {
    for (let i = 0; i < count; i += stride) push(i);
  }
  return order;
}
