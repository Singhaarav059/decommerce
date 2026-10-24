"use client";

import { FilmStep } from "@/components/media/FilmStep";
import { ScrollSequence } from "@/components/media/ScrollSequence";
import { ButtonLink } from "@/components/ui/Button";
import { Headline } from "@/components/ui/Headline";
import { filmPane, textColumn } from "@/components/layout/split";
import { hero } from "@/content/home";
import { sequences } from "@/content/media";

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
            <FilmStep from={0} to={0.62}>
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
            </FilmStep>
            <FilmStep from={0.68} to={1}>
              <p className="eyebrow">Inside the store</p>
              <p className="display mt-4 text-[clamp(2rem,3.4vw,3.6rem)]">{hero.arrival}</p>
            </FilmStep>
          </div>
        </div>
      </ScrollSequence>
    </div>
  );
}
