import data from "./media.json";
import type { SolutionSlug } from "../site";

/** Media for one solution page (built by scripts/v3/sol-build.mjs from scripts/v3/sol-shots.json). */
export function solutionMedia(slug: SolutionSlug) {
  const base = `/assets/sol/${slug}`;
  const { count, floor } = (data as Record<string, { count: number; floor: string }>)[slug];
  return {
    seq: { pattern: `${base}/seq/d/{i}.webp`, mobilePattern: `${base}/seq/m/{i}.webp`, count },
    /** The scene's floor colour: the phone text panel under every scene on the page. */
    floor,
    /** The finished scene (last frame of the film). */
    end: `${base}/end.webp`,
    /** A close-up of the same place. */
    detail: `${base}/detail.webp`,
    thumb: `${base}/thumb.webp`,
  };
}
