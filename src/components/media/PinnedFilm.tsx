"use client";

import type { ReactNode } from "react";
import { filmPane, textColumn } from "@/components/layout/split";
import { FilmStep } from "./FilmStep";
import { ScrollSequence } from "./ScrollSequence";

export type FilmSeq = { pattern: string; mobilePattern?: string; count: number };

/**
 * The standard pinned chapter: a scroll-scrubbed film in its own pane and a
 * text column that steps through `steps` beside it (below it on phones).
 * Each step owns a slice of the film; slices are split evenly unless given.
 */
export function PinnedFilm({
  id,
  seq,
  alt,
  steps,
  phone = "4:3",
  length = 2.6,
  priority = false,
  bg,
  dark = false,
}: {
  id: string;
  seq: FilmSeq;
  alt: string;
  steps: ReactNode[] | { from: number; to: number; node: ReactNode }[];
  phone?: "4:3" | "16:9";
  length?: number;
  priority?: boolean;
  /** Section background (the footage's own backdrop), e.g. for the dusk film. */
  bg?: string;
  /** Light text for a dark backdrop. */
  dark?: boolean;
}) {
  const n = steps.length;
  const slices = steps.map((s, i) =>
    s && typeof s === "object" && "node" in s ? s : { from: i === 0 ? 0 : i / n + 0.03, to: i === n - 1 ? 1 : (i + 1) / n - 0.03, node: s as ReactNode },
  );
  return (
    <div id={id} className="relative">
      <ScrollSequence {...seq} length={length} stillFrame={0} priority={priority} defer alt={alt} bg={bg} frameClassName={filmPane(phone)}>
        <div className={`${textColumn(phone)} ${dark ? "tone-dark" : ""}`}>
          <div className="grid">
            {slices.map((s, i) => (
              <FilmStep key={i} from={s.from} to={s.to}>
                {s.node}
              </FilmStep>
            ))}
          </div>
        </div>
      </ScrollSequence>
    </div>
  );
}
