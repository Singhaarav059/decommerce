"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { FULL_PANE, FULL_TEXT } from "@/components/layout/split";
import { Scene } from "@/components/layout/Scene";
import { frameUrl, wantsStill } from "@/lib/media";
import { FilmStep } from "./FilmStep";
import { ScrollSequence } from "./ScrollSequence";

export type FilmSeq = { pattern: string; mobilePattern?: string; count: number };

/**
 * The standard pinned chapter: a scroll-scrubbed full-screen film of a real
 * place, with a text column that steps through `steps` in the calm part of the
 * shot (below the film on phones, on a panel of the scene's floor colour).
 * Each step owns a slice of the film; slices are split evenly unless given.
 */
export function PinnedFilm({
  id,
  seq,
  alt,
  steps,
  floor = "#eef1ee",
  length = 2.6,
  priority = false,
  night = false,
  overlay,
}: {
  id: string;
  seq: FilmSeq;
  alt: string;
  steps: ReactNode[] | { from: number; to: number; node: ReactNode }[];
  /** The scene's floor colour: the phone text panel and the blend into it. */
  floor?: string;
  length?: number;
  priority?: boolean;
  /** Light text for a night scene. */
  night?: boolean;
  /** Extra layer over the film (desktop), e.g. floating product cards; it can follow the scroll with useSequenceProgress. */
  overlay?: ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  // phones: give the film whatever height the tallest step leaves (never under 26% of the screen)
  useEffect(() => {
    const w = wrap.current, t = text.current;
    if (!w || !t) return;
    const mq = matchMedia("(max-width: 767px)");
    const fit = () => {
      if (!mq.matches) return w.style.removeProperty("--film-h");
      const stage = w.querySelector<HTMLElement>("[data-stage]")?.clientHeight ?? innerHeight;
      const h = Math.max(stage * 0.26, Math.min(stage * 0.58, stage - t.offsetHeight - 28));
      w.style.setProperty("--film-h", `${Math.round(h)}px`);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(t);
    mq.addEventListener("change", fit);
    addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", fit);
      removeEventListener("resize", fit);
    };
  }, []);
  // reduced motion / save-data: no pinning; the finished scene with every step listed
  const [still, setStill] = useState(false);
  useEffect(() => {
    if (!wantsStill()) return;
    const raf = requestAnimationFrame(() => setStill(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  const n = steps.length;
  const slices = steps.map((s, i) =>
    s && typeof s === "object" && "node" in s ? s : { from: i === 0 ? 0 : i / n + 0.012, to: i === n - 1 ? 1 : (i + 1) / n - 0.012, node: s as ReactNode },
  );
  if (still)
    return (
      <Scene id={id} src={frameUrl(seq.pattern, seq.count - 1)} floor={floor} label={alt} priority={priority} light={!night}>
        <div className={`grid gap-14 ${night ? "tone-night" : ""}`}>
          {slices.map((s, i) => (
            <div key={i}>{s.node}</div>
          ))}
        </div>
      </Scene>
    );
  return (
    <div ref={wrap} id={id} className={`relative ${night ? "" : "tone-light"}`} style={{ "--floor": floor } as CSSProperties}>
      <ScrollSequence {...seq} length={length} stillFrame={0} priority={priority} defer alt={alt} bg={floor} frameClassName={FULL_PANE}>
        {/* desktop: a wash of the floor colour under the text column, so copy reads over any frame */}
        <div aria-hidden className={`scrim pointer-events-none absolute inset-0 hidden md:block ${night ? "night" : ""}`} />
        {overlay}
        <div className={`${FULL_TEXT} ${night ? "tone-night" : ""}`}>
          <div ref={text} className="grid">
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
