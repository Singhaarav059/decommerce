import data from "./media.json";
import type { SolutionSlug } from "../site";

/** Media for one solution page (keyframe beats from scripts/v7/build.mjs; the rest from scripts/v6/build.mjs). */
export function solutionMedia(slug: SolutionSlug) {
  const base = `/assets/sol/${slug}`;
  const { count, floor, beats, focus, motion, keys } = (data as Record<string, { count: number; floor: string; beats?: boolean; focus?: number[]; motion?: number; keys?: number[] }>)[slug];
  // scripts/v7/build.mjs: footage between sharp keyframes where the motion clips exist (holds on each keyframe),
  // otherwise the keyframes alone, dissolving into each other
  const dir = motion ? `${base}/motion` : beats ? `${base}/beats` : `${base}/seq`;
  return {
    seq: {
      pattern: `${dir}/d/{i}.webp`,
      mobilePattern: `${dir}/m/{i}.webp`,
      count: motion ?? count,
      keys: motion ? keys : undefined,
      blend: !!beats && !motion,
      focus: (focus ?? [50, 50]) as [number, number],
      push: beats ? 0.04 : 0,
    },
    /** The scene's floor colour: the phone text panel under every scene on the page. */
    floor,
    /** The finished scene (last frame of the film). */
    end: `${base}/end.webp`,
    /** A close-up of the same place. */
    detail: `${base}/detail.webp`,
    thumb: `${base}/thumb.webp`,
  };
}
