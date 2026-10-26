"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollSequence, useSequenceProgress } from "@/components/media/ScrollSequence";
import { ButtonLink } from "@/components/ui/Button";
import { hero, heroTag as t } from "@/content/home";
import { sequences } from "@/content/media";
import { frameUrl, wantsStill } from "@/lib/media";

type Size = (typeof t.sizes)[number];

// the headline breaks after "behind": the wall holds the first line, the second runs on below it
const words = hero.headline.split(" ");
const LINES = [words.slice(0, 3).join(" "), words.slice(3).join(" ")];

/**
 * The homepage opening, full bleed: the flagship cut open like a dollhouse (shop floor, stockroom,
 * website studio, the van at the kerb), every part threaded to one glowing hang tag. The plain wall
 * on the left carries the headline and the live tag: pick a size, sell one, and every channel's
 * count drops together. Scrolling pushes in on the building as everyone works and the threads
 * pulse; the words lift away. Reduced motion or save-data: the same first screen over a still.
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
      <div aria-hidden className="scrim absolute inset-0 hidden lg:block" />
      <div className="relative mx-auto flex h-full max-w-[var(--max-w)] flex-col px-[var(--gutter)] pt-[var(--header-h)] pb-6 lg:justify-center lg:pb-8">
        {/* everything sits on the plain wall: the left 42% of the frame */}
        <div className="flex flex-1 flex-col lg:block lg:max-w-[min(40vw,600px)] lg:flex-none">
        {/* phones and tablets: the words sit on a solid band of the page colour above the film */}
        <div className="max-lg:-mx-[var(--gutter)] max-lg:bg-studio max-lg:px-[var(--gutter)] max-lg:pt-6 max-lg:pb-7">
          <h1 className="display text-[clamp(2.4rem,4.6vw,5.6rem)] leading-[0.95] tracking-[-0.045em] text-ink" aria-label={hero.headline}>
            {LINES.map((line, l) => (
              <span key={l} aria-hidden className="block overflow-clip pb-[0.06em]">
                <span className="hero-word inline-block" style={{ animationDelay: `${120 + l * 140}ms` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className="intro t-lead mt-5 max-w-[38ch] text-ink lg:mt-8">{hero.body}</p>
          <div className="intro mt-6 flex flex-wrap gap-3 lg:mt-8">
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
      </div>
    </>
  );
}

/** The live thing: the shirt's tag, with one stock count that every channel reads. Sell one and they all drop together. */
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
    <div className="intro tag tag-sm mt-auto w-full max-w-[520px] bg-accent p-5 pt-7 text-paper lg:mt-10">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.94rem] font-semibold">
          {t.label} <span className="font-normal text-paper/85">· {t.order}</span>
        </p>
        <div role="radiogroup" aria-label="Size" className="flex gap-1">
          {t.sizes.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={s === size}
              onClick={() => setSize(s)}
              className={`size-9 text-[0.875rem] font-semibold transition-colors ${s === size ? "bg-paper text-ink" : "bg-paper/15 text-paper hover:bg-paper/30"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-4 gap-1">
        {t.channels.map((c, i) => (
          <li key={c} className="min-w-0 bg-ink/20 px-2.5 py-2">
            <span className="block truncate text-[0.8125rem] text-paper">{c}</span>
            <span key={`${tick}-${size}`} className="display tabular block animate-[slide-up_500ms_var(--ease-out)_both] text-[1.6rem] leading-tight" style={{ animationDelay: `${i * 70}ms` }}>
              {n}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <button type="button" onClick={act} className="tag tag-xs tag-plain flex h-11 items-center gap-3 bg-paper pr-5 pl-6 font-semibold text-ink transition-colors hover:bg-ink hover:text-paper">
          {n > 0 ? t.sell : t.restock}
          <span aria-hidden>→</span>
        </button>
        <p className="text-[0.8125rem] text-paper/90">{t.note}</p>
      </div>
    </div>
  );
}
