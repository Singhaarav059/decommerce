"use client";

import { ScrollSequence, useSequenceProgress } from "@/components/media/ScrollSequence";
import { ButtonLink } from "@/components/ui/Button";
import { Headline } from "@/components/ui/Headline";
import { hero } from "@/content/home";
import { sequences } from "@/content/media";
import { useRef } from "react";

/** Fades the hero copy out over the first part of the push-in. */
function HeroCopy() {
  const ref = useRef<HTMLDivElement>(null);
  useSequenceProgress((p) => {
    const el = ref.current;
    if (!el) return;
    const fade = Math.min(1, Math.max(0, (p - 0.08) / 0.22));
    el.style.opacity = String(1 - fade);
    el.style.transform = `translateY(${(-fade * 24).toFixed(1)}px)`;
    el.style.pointerEvents = fade > 0.6 ? "none" : "";
  });
  return (
    <div
      ref={ref}
      className="absolute inset-x-0 top-[calc(var(--header-h)+3svh)] z-10 mx-auto max-w-[var(--max-w)] px-[var(--gutter)] will-change-transform md:top-1/2 md:-translate-y-1/2 lg:pl-[calc(var(--gutter)+150px)]"
    >
      <div className="md:max-w-[520px] md:rounded-[var(--radius-lg)] md:bg-stone-50 md:p-9">
        {/* on phones the copy sits on the film backdrop, not the stone card: use the darker ink */}
        <p className="eyebrow max-md:!text-ink-soft">{hero.eyebrow}</p>
        <Headline text={hero.headline} className="mt-4 max-w-[11ch] text-[clamp(2.9rem,7vw,6.2rem)]" />
        <p className="mt-5 max-w-[38ch] text-[1.05rem] leading-relaxed text-ink-soft md:text-lg">{hero.body}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href={hero.primary.href} arrow>
            {hero.primary.label}
          </ButtonLink>
          <ButtonLink href={hero.secondary.href} variant="secondary">
            {hero.secondary.label}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

/** Shows once the camera is inside the store. */
function Arrival() {
  const ref = useRef<HTMLDivElement>(null);
  useSequenceProgress((p) => {
    const el = ref.current;
    if (!el) return;
    const show = Math.min(1, Math.max(0, (p - 0.72) / 0.14));
    el.style.opacity = String(show);
    el.style.transform = `translateY(${((1 - show) * 16).toFixed(1)}px)`;
  });
  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-x-0 top-[calc(var(--header-h)+3svh)] z-10 mx-auto max-w-[var(--max-w)] px-[var(--gutter)] opacity-0 md:top-auto md:bottom-[8svh] lg:pl-[calc(var(--gutter)+150px)]"
    >
      <p className="inline-block max-w-sm rounded-[var(--radius-md)] bg-stone-50 p-5 text-lg leading-snug">{hero.arrival}</p>
    </div>
  );
}

/**
 * Homepage chapter 1: a photoreal push-in from the miniature store into its
 * counter, scrubbed by scroll (Veo footage → frames). Phones get the same
 * film in a 4:3 band under the headline, on the footage's own backdrop colour.
 */
export function HeroFilm() {
  return (
    <div id="ch-store" className="relative">
      <ScrollSequence
        {...sequences.hero}
        length={2.4}
        stillFrame={0}
        priority
        defer
        alt={hero.posterAlt}
        bg={sequences.hero.bg}
        frameClassName="absolute inset-x-0 bottom-[6svh] aspect-[4/3] [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)] md:inset-0 md:aspect-auto md:[mask-image:none]"
      >
        <HeroCopy />
        <Arrival />
      </ScrollSequence>
    </div>
  );
}
