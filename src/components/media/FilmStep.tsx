"use client";

import { useRef, type ReactNode } from "react";
import { useSequenceProgress } from "./ScrollSequence";

/**
 * One text state in a pinned film section's text column, shown between two
 * points of the film (0–1) with a short fade. Steps stack in the same grid
 * cell, so the column never changes size or overlaps the film.
 */
export function FilmStep({ from, to, children, label }: { from: number; to: number; children: ReactNode; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const first = from <= 0;
  useSequenceProgress((p) => {
    const el = ref.current;
    if (!el) return;
    const fadeIn = first ? 1 : Math.min(1, Math.max(0, (p - from) / 0.05));
    const fadeOut = to >= 1 ? 1 : Math.min(1, Math.max(0, (to - p) / 0.05));
    const o = Math.min(fadeIn, fadeOut);
    el.style.opacity = String(o);
    el.style.transform = `translateY(${((1 - o) * 10).toFixed(1)}px)`;
    el.style.visibility = o < 0.02 ? "hidden" : "visible";
    el.setAttribute("aria-hidden", o < 0.5 ? "true" : "false");
  });
  return (
    <div ref={ref} data-film-step aria-label={label} className={`col-start-1 row-start-1 ${first ? "" : "invisible opacity-0"}`}>
      {children}
    </div>
  );
}
