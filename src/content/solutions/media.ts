import data from "./media.json";
import type { SolutionSlug } from "../site";

/** Media for one solution page (keyframe beats from scripts/v7/build.mjs; the rest from scripts/v6/build.mjs). */
export function solutionMedia(slug: SolutionSlug) {
  const base = `/assets/sol/${slug}`;
  const { count, floor, beats, focus } = (data as Record<string, { count: number; floor: string; beats?: boolean; focus?: number[] }>)[slug];
  // keyframe beats (scripts/v7/build.mjs) hold sharp and dissolve into each other; older scenes are footage
  const dir = beats ? `${base}/beats` : `${base}/seq`;
  return {
    seq: {
      pattern: `${dir}/d/{i}.webp`,
      mobilePattern: `${dir}/m/{i}.webp`,
      count,
      blend: !!beats,
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
