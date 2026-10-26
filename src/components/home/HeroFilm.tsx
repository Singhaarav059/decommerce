"use client";

import { PinnedFilm } from "@/components/media/PinnedFilm";
import { ButtonLink } from "@/components/ui/Button";
import { Headline } from "@/components/ui/Headline";
import { hero } from "@/content/home";
import { sequences } from "@/content/media";
import { HeroCards } from "./HeroCards";

/** Homepage chapter 1: a slow dolly into the boutique at golden hour; the pitch sits on the sunlit wall. */
export function HeroFilm() {
  return (
    <PinnedFilm
      id="ch-store"
      seq={sequences.hero}
      floor={sequences.hero.floor}
      alt={hero.posterAlt}
      priority
      overlay={<HeroCards />}
      length={1.7}
      steps={[
        {
          from: 0,
          to: 0.6,
          node: (
            <>
              <p className="eyebrow">{hero.eyebrow}</p>
              <Headline text={hero.headline} className="t-hero mt-3 md:mt-5" />
              <p className="mt-3 max-w-[38ch] t-step text-ink-2 md:mt-6">{hero.body}</p>
              <div className="mt-5 flex flex-wrap gap-3 md:mt-9">
                <ButtonLink href={hero.primary.href} arrow>
                  {hero.primary.label}
                </ButtonLink>
                <ButtonLink href={hero.secondary.href} variant="secondary">
                  {hero.secondary.label}
                </ButtonLink>
              </div>
            </>
          ),
        },
        {
          from: 0.66,
          to: 1,
          node: (
            <>
              <p className="eyebrow">Inside the store</p>
              <p className="display mt-3 max-w-[18ch] text-[clamp(1.6rem,3.4vw,3.6rem)] md:mt-5">{hero.arrival}</p>
            </>
          ),
        },
      ]}
    />
  );
}
