"use client";

import { useRef, type ReactNode } from "react";
import { useSequenceProgress } from "./ScrollSequence";

/**
 * One text state in a pinned film section's text column, shown between two
 * points of the film (0 to 1). Its lines arrive one after another (label, headline,
 * body…) rising from below, and leave together upwards. Steps stack in the same
 * grid cell, so the column never changes size or overlaps the film.
 */
export function FilmStep({ from, to, children, label }: { from: number; to: number; children: ReactNode; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const first = from <= 0;
  useSequenceProgress((p) => {
    const el = ref.current;
    if (!el) return;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const fadeOut = to >= 1 ? 1 : clamp((to - p) / 0.04);
    let max = 0;
    Array.from(el.children as HTMLCollectionOf<HTMLElement>).forEach((c, k) => {
      const fadeIn = first ? 1 : clamp((p - from - k * 0.014) / 0.05);
      const o = Math.min(fadeIn, fadeOut);
      // ease-out so lines settle softly; arriving lines rise, leaving lines drift up
      const e = 1 - (1 - o) ** 3;
      const y = fadeOut < 1 ? -(1 - e) * 16 : (1 - e) * 28;
      c.style.opacity = o.toFixed(3);
      c.style.transform = o >= 1 ? "" : `translate3d(0,${y.toFixed(1)}px,0)`;
      max = Math.max(max, o);
    });
    el.style.visibility = max < 0.02 ? "hidden" : "visible";
    el.setAttribute("aria-hidden", max < 0.5 ? "true" : "false");
  });
  return (
    <div ref={ref} data-film-step aria-label={label} className={`col-start-1 row-start-1 ${first ? "intro" : "invisible [&>*]:opacity-0"}`}>
      {children}
    </div>
  );
}
