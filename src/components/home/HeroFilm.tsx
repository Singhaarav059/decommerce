"use client";

import { HeroWindow } from "@/components/media/HeroWindow";
import { ButtonLink } from "@/components/ui/Button";
import { hero } from "@/content/home";
import { sequences } from "@/content/media";
import { HeroCards } from "./HeroCards";

/** Homepage opening: the headline over the night floor, the boutique film opening beneath it, then the product at work. */
export function HeroFilm() {
  return (
    <HeroWindow
      id="ch-store"
      seq={sequences.hero}
      alt={hero.posterAlt}
      priority
      length={2.6}
      eyebrow={hero.eyebrow}
      headline={hero.headline}
      media={{ after: 1, srcs: ["/assets/sol/pos/end.webp"] }}
      body={hero.body}
      actions={
        <>
          <ButtonLink href={hero.primary.href} arrow>
            {hero.primary.label}
          </ButtonLink>
          <ButtonLink href={hero.secondary.href} variant="secondary">
            {hero.secondary.label}
          </ButtonLink>
        </>
      }
      overlay={<HeroCards />}
      caption={
        <p className="tag tag-sm tag-plain max-w-[34ch] bg-paper px-5 py-4 pl-6 text-[0.95rem] leading-snug text-ink">
          <span className="mb-1 block font-semibold">Inside the store</span>
          {hero.arrival}
        </p>
      }
    />
  );
}
