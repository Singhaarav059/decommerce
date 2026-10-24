"use client";

import { useRef } from "react";
import { ScrollSequence, useSequenceProgress } from "@/components/media/ScrollSequence";
import { ButtonLink } from "@/components/ui/Button";
import { Headline } from "@/components/ui/Headline";
import { hero } from "@/content/home";
import { sequences } from "@/content/media";
import { filmPane, textColumn } from "@/components/layout/split";

/** Crossfades a text step in the text column between two points of the film. */
function useStep(ref: React.RefObject<HTMLDivElement | null>, from: number, to: number) {
  useSequenceProgress((p) => {
    const el = ref.current;
    if (!el) return;
    const fadeIn = from <= 0 ? 1 : Math.min(1, Math.max(0, (p - from) / 0.06));
    const fadeOut = to >= 1 ? 1 : Math.min(1, Math.max(0, (to - p) / 0.06));
    const o = Math.min(fadeIn, fadeOut);
    el.style.opacity = String(o);
    el.style.transform = `translateY(${((1 - o) * 10).toFixed(1)}px)`;
    el.style.visibility = o < 0.02 ? "hidden" : "visible";
  });
}

function Pitch() {
  const ref = useRef<HTMLDivElement>(null);
  useStep(ref, 0, 0.62);
  return (
    <div ref={ref} className="col-start-1 row-start-1">
      <p className="eyebrow">{hero.eyebrow}</p>
      <Headline text={hero.headline} className="mt-4 text-[clamp(2.4rem,5.2vw,5.6rem)]" />
      <p className="mt-5 max-w-[38ch] text-ink-2">{hero.body}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={hero.primary.href} arrow>
          {hero.primary.label}
        </ButtonLink>
        <ButtonLink href={hero.secondary.href} variant="secondary">
          {hero.secondary.label}
        </ButtonLink>
      </div>
    </div>
  );
}

function Arrival() {
  const ref = useRef<HTMLDivElement>(null);
  useStep(ref, 0.68, 1);
  return (
    <div ref={ref} aria-hidden className="invisible col-start-1 row-start-1 opacity-0">
      <p className="eyebrow">Inside the store</p>
      <p className="display mt-4 text-[clamp(2rem,3.4vw,3.6rem)]">{hero.arrival}</p>
    </div>
  );
}

/**
 * Homepage chapter 1: a photoreal push-in from the miniature store into its
 * counter, scrubbed by scroll (Veo footage → frames). The film has its own
 * pane; the text column steps beside it (below it on phones). Nothing overlaps.
 */
export function HeroFilm() {
  return (
    <div id="ch-store" className="relative">
      <ScrollSequence {...sequences.hero} length={2.6} stillFrame={0} priority defer alt={hero.posterAlt} frameClassName={filmPane("16:9")}>
        <div className={textColumn("16:9")}>
          <div className="grid">
            <Pitch />
            <Arrival />
          </div>
        </div>
      </ScrollSequence>
    </div>
  );
}
