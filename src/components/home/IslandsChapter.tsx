"use client";

import { FilmStep } from "@/components/media/FilmStep";
import { ScrollSequence } from "@/components/media/ScrollSequence";
import { Headline } from "@/components/ui/Headline";
import { filmPane, textColumn } from "@/components/layout/split";
import { islands, unify } from "@/content/home";
import { sequences } from "@/content/media";

/** The four channels with a stock count each: mismatched in the problem, all equal in the fix. */
function StockList({ fixed }: { fixed: boolean }) {
  return (
    <dl className="mt-5 max-w-sm border-t border-line md:mt-7">
      {islands.zones.map((z) => (
        <div key={z.id} className="flex items-baseline justify-between border-b border-line py-1.5 md:py-2.5">
          <dt className="text-ink-2">{z.name}</dt>
          <dd className="tabular text-[1.35rem] font-medium">{fixed ? unify.stock : z.stock}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Homepage chapters 2–3 in one pinned film: four separate floating rooms
 * (four systems, four stock counts), then one joined store (one count).
 * Footage: Veo camera moves on two stills, crossfaded at the step change.
 */
export function IslandsChapter() {
  return (
    <div id="ch-islands" className="relative">
      <ScrollSequence {...sequences.islands} length={2.8} stillFrame={0} defer alt={islands.alt} frameClassName={filmPane("4:3")}>
        <div className={textColumn("4:3")}>
          <div className="grid">
            <FilmStep from={0} to={0.47}>
              <p className="eyebrow">{islands.eyebrow}</p>
              <Headline as="h2" text={islands.headline} className="mt-4 text-[clamp(2.2rem,4.2vw,4.2rem)]" />
              <p className="mt-4 max-w-[40ch] text-ink-2">{islands.body}</p>
              <StockList fixed={false} />
              <p className="mt-3 text-[0.9rem] text-ink-2">{islands.item}, illustrative.</p>
            </FilmStep>
            <FilmStep from={0.53} to={1}>
              <p id="ch-unify" className="eyebrow">
                {unify.eyebrow}
              </p>
              <Headline as="h2" text={unify.headline} className="mt-4 text-[clamp(2.2rem,4.2vw,4.2rem)]" />
              <p className="mt-4 max-w-[40ch] text-ink-2">{unify.body}</p>
              <StockList fixed />
            </FilmStep>
          </div>
        </div>
      </ScrollSequence>
    </div>
  );
}
