"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollSequence, useSequenceProgress } from "@/components/media/ScrollSequence";
import { ButtonLink } from "@/components/ui/Button";
import { hero, heroTag as t } from "@/content/home";
import { sequences } from "@/content/media";
import { frameUrl, wantsStill } from "@/lib/media";
import { HeroCards } from "./HeroCards";

type Size = (typeof t.sizes)[number];

// the headline breaks after "behind": the wall holds the first line, the second runs on below it
const words = hero.headline.split(" ");
const LINES = [words.slice(0, 3).join(" "), words.slice(3).join(" ")];

/**
 * The homepage opening, full bleed: the sunlit boutique, its travertine wall carrying the
 * headline, and the shirt's hang tag hanging into the room on its string. The tag is the one
 * live thing: pick a size, sell one at the counter, and every channel's count drops together.
 * Scrolling walks the camera into the store; the words and the tag lift away and the product
 * cards arrive. Reduced motion or save-data: the same first screen over a still photograph.
 */
export function HomeHero() {
  const [still, setStill] = useState(false);
  useEffect(() => {
    if (!wantsStill()) return;
    const raf = requestAnimationFrame(() => setStill(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  const seq = sequences.hero;

  if (still)
    return (
      <section id="ch-store" aria-label={hero.posterAlt} className="relative h-[100svh] min-h-[640px] overflow-hidden">
        <picture>
          <source media="(max-width: 767px)" srcSet={frameUrl(seq.mobilePattern, 0)} />
          <img src={frameUrl(seq.pattern, 0)} alt="" fetchPriority="high" className="absolute inset-0 size-full object-cover" />
        </picture>
        <Front />
      </section>
    );

  return (
    <div id="ch-store" className="relative">
      <ScrollSequence {...seq} length={2.2} stillFrame={0} priority defer alt={hero.posterAlt} bg={seq.floor} frameClassName="absolute inset-0">
        <Lift>
          <Front />
        </Lift>
        <HeroCards />
      </ScrollSequence>
    </div>
  );
}

/** Lifts the first screen away as the film starts: up, and out, in the first third of the scroll. */
function Lift({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useSequenceProgress((p) => {
    const el = ref.current;
    if (!el) return;
    const k = Math.min(1, p / 0.34);
    el.style.opacity = String(1 - k);
    el.style.transform = `translate3d(0,${(-60 * k).toFixed(1)}px,0)`;
    el.style.pointerEvents = k > 0.5 ? "none" : "auto";
    el.style.visibility = k >= 1 ? "hidden" : "visible";
  });
  return (
    <div ref={ref} className="absolute inset-0 z-[2] will-change-transform">
      {children}
    </div>
  );
}

function Front() {
  return (
    <>
      <div aria-hidden className="scrim absolute inset-0 hidden md:block" />
      <div className="relative mx-auto flex h-full max-w-[var(--max-w)] flex-col px-[var(--gutter)] pt-[var(--header-h)] pb-6 md:justify-center md:pb-8">
        {/* phones: the words sit on a solid band of the page colour above the photograph */}
        <div className="max-md:-mx-[var(--gutter)] max-md:bg-studio max-md:px-[var(--gutter)] max-md:pt-6 max-md:pb-7">
          <h1 className="display text-[clamp(2.4rem,6.4vw,7rem)] leading-[0.94] tracking-[-0.045em] text-ink" aria-label={hero.headline}>
            {LINES.map((line, l) => (
              <span key={l} aria-hidden className="block overflow-clip pb-[0.06em]">
                <span className="hero-word inline-block" style={{ animationDelay: `${120 + l * 140}ms` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className="intro t-lead mt-5 max-w-[38ch] text-ink md:mt-8">{hero.body}</p>
          <div className="intro mt-6 flex flex-wrap gap-3 md:mt-8">
            <ButtonLink href={hero.primary.href} arrow>
              {hero.primary.label}
            </ButtonLink>
            <ButtonLink href={hero.secondary.href} variant="secondary">
              {hero.secondary.label}
            </ButtonLink>
          </div>
        </div>
        <HangTag />
      </div>
    </>
  );
}

/** The live thing: the shirt's tag on its string, with one stock count every channel reads. */
function HangTag() {
  const [size, setSize] = useState<Size>("M");
  const [stock, setStock] = useState(t.start);
  const [tick, setTick] = useState(0);
  const n = stock[size];
  const act = () => {
    setStock((s) => ({ ...s, [size]: n > 0 ? n - 1 : t.start[size] }));
    setTick((k) => k + 1);
  };
  return (
    <div className="hang mt-auto w-full md:absolute md:top-0 md:right-[max(var(--gutter),calc((100vw-var(--max-w))/2+var(--gutter)))] md:mt-0 md:w-[340px]">
      {/* the string the tag hangs from */}
      <span aria-hidden className="mx-auto hidden h-[calc(var(--header-h)+10vh)] w-[3px] bg-ink/70 md:block" />
      <div className="tag tag-lg bg-copper p-5 pt-8 text-paper md:p-7 md:pt-20">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-semibold">{t.label}</p>
          <p className="text-[0.8125rem] text-paper/85">{t.order}</p>
        </div>
        <div className="mt-3 flex items-end justify-between gap-4 md:mt-4">
          <p className="flex items-baseline gap-3">
            <span key={`${size}-${n}`} className="display tabular animate-[slide-up_500ms_var(--ease-out)_both] text-[clamp(3rem,6vw,5.2rem)] leading-[0.85]">
              {n}
            </span>
            <span className="max-w-[10ch] text-[0.875rem] leading-tight text-paper/90">{t.unit(size)}</span>
          </p>
          <div role="radiogroup" aria-label="Size" className="flex gap-1">
            {t.sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={s === size}
                onClick={() => setSize(s)}
                className={`size-10 text-[0.94rem] font-semibold transition-colors ${s === size ? "bg-paper text-ink" : "bg-paper/15 text-paper hover:bg-paper/30"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-5 grid grid-cols-4 gap-1 md:grid-cols-2">
          {t.channels.map((c, i) => (
            <li key={c} className="flex min-w-0 flex-col bg-ink/20 px-2.5 py-2 md:flex-row md:items-baseline md:justify-between">
              <span className="truncate text-[0.8125rem] text-paper">{c}</span>
              <span key={`${tick}-${size}`} className="tabular animate-[slide-up_500ms_var(--ease-out)_both] font-semibold" style={{ animationDelay: `${i * 70}ms` }}>
                {n}
              </span>
            </li>
          ))}
        </ul>
        <button type="button" onClick={act} className="tag tag-xs tag-plain mt-4 flex h-12 w-full items-center justify-between bg-paper px-5 font-semibold text-ink transition-colors hover:bg-ink hover:text-paper">
          {n > 0 ? t.sell : t.restock}
          <span aria-hidden>→</span>
        </button>
        <p className="mt-3 text-[0.8125rem] text-paper/85">{t.note}</p>
      </div>
    </div>
  );
}
