import counts from "./media.json";
import type { SolutionSlug } from "../site";

/** Media for one solution page (built by scripts/solutions/build.mjs). */
export function solutionMedia(slug: SolutionSlug) {
  const base = `/assets/sol/${slug}`;
  const count = (counts as Record<string, { count: number }>)[slug]?.count ?? 61;
  // the film is the broken clip then the fixed clip; the fixed part starts just after the crossfade
  const fixedFrom = Math.round(count * 0.52);
  return {
    seq: { pattern: `${base}/seq/d/{i}.webp`, mobilePattern: `${base}/seq/m/{i}.webp`, count },
    fixedFrom,
    still: `${base}/still.webp`,
    broken: `${base}/broken.webp`,
    /** Three frames of the fixed clip for the capability tabs. */
    tabFrames: [0, 0.5, 1].map((t) => `${base}/seq/d/${String(Math.round(fixedFrom + t * (count - 1 - fixedFrom))).padStart(3, "0")}.webp`),
  };
}
