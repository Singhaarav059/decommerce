"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { hero, heroTag as t } from "@/content/home";

type Size = (typeof t.sizes)[number];

// the headline breaks after "behind"
const words = hero.headline.split(" ");
const LINES = [words.slice(0, 3).join(" "), words.slice(3).join(" ")];

/**
 * The homepage opening: the words and the live tag on the page, and beside them one large, sharp
 * moment on the shop floor (nothing laid over it). Meera scans the tag on the overshirt Ananya has
 * put on the counter; sell one on the live tag and the picture moves to the next keyframe, the bag
 * handed over, while every channel's count drops together. Restock and it returns.
 */
export function HomeHero() {
  const [sold, setSold] = useState(false);
  return (
    <section id="ch-store" aria-labelledby="hero-title" className="relative bg-studio">
      <div className="mx-auto grid max-w-[var(--max-w)] gap-x-12 px-[var(--gutter)] pt-[calc(var(--header-h)+clamp(16px,3vh,40px))] pb-10 lg:min-h-[100svh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-[1fr_auto_auto_1fr] lg:pb-[clamp(16px,3vh,40px)]">
        <div className="pt-4 pb-7 lg:row-start-2 lg:pt-0 lg:pb-0">
          <h1 id="hero-title" className="display text-[clamp(2.6rem,4.5vw,4.6rem)] whitespace-nowrap max-sm:whitespace-normal leading-[0.95] tracking-[-0.045em] text-ink" aria-label={hero.headline}>
            {LINES.map((line, l) => (
              <span key={l} aria-hidden className="block overflow-clip pb-[0.06em]">
                <span className="hero-word inline-block" style={{ animationDelay: `${120 + l * 140}ms` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className="intro t-lead mt-5 max-w-[38ch] text-ink-2 lg:mt-7">{hero.body}</p>
          <div className="intro mt-6 flex flex-wrap gap-3 lg:mt-8">
            <ButtonLink href={hero.primary.href} arrow>
              {hero.primary.label}
            </ButtonLink>
            <ButtonLink href={hero.secondary.href} variant="secondary">
              {hero.secondary.label}
            </ButtonLink>
          </div>
        </div>
        <Scene sold={sold} />
        <div className="lg:col-start-1 lg:row-start-3">
          <HangTag onSell={() => setSold(true)} onRestock={() => setSold(false)} />
        </div>
      </div>
    </section>
  );
}

/** The two keyframes of the sale, stacked: the bag fades in over the scan when a sale is made. */
function Scene({ sold }: { sold: boolean }) {
  // the second keyframe waits until the page is idle, so it never competes with the first for bandwidth
  const [later, setLater] = useState(false);
  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const id = ric(() => setLater(true), { timeout: 4000 });
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id);
  }, []);
  return (
    <div className="intro tag tag-xl relative aspect-[4/5] overflow-hidden bg-studio-light max-lg:-mx-[calc(var(--gutter)/2)] lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:aspect-auto lg:h-[calc(100svh-var(--header-h)-clamp(16px,3vh,40px)*2)] lg:min-h-[560px]">
      <div className="hero-drift absolute inset-0">
        <Image src="/assets/hero/beat-a.webp" alt={hero.posterAlt} fill priority sizes="(min-width: 1024px) 55vw, 100vw" quality={85} className="object-cover object-[50%_32%]" />
        {(later || sold) && (
        <Image
          src="/assets/hero/beat-b.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          quality={85}
          className={`object-cover object-[50%_32%] transition-opacity duration-700 ease-[var(--ease-out)] ${sold ? "opacity-100" : "opacity-0"}`}
        />
        )}
      </div>
    </div>
  );
}

/** The live thing: the shirt's tag, with one stock count that every channel reads. Sell one and they all drop together. */
function HangTag({ onSell, onRestock }: { onSell: () => void; onRestock: () => void }) {
  const [size, setSize] = useState<Size>("M");
  const [stock, setStock] = useState(t.start);
  const [tick, setTick] = useState(0);
  const n = stock[size];
  const act = () => {
    setStock((s) => ({ ...s, [size]: n > 0 ? n - 1 : t.start[size] }));
    setTick((k) => k + 1);
    if (n > 0) onSell();
    else onRestock();
  };
  return (
    <div className="intro tag tag-sm relative z-[1] mt-6 w-full max-w-[520px] bg-studio-light p-5 pt-7 text-ink lg:mt-10">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.94rem] font-semibold">
          {t.label} <span className="font-normal text-ink-2">· {t.order}</span>
        </p>
        <div role="radiogroup" aria-label="Size" className="flex gap-1">
          {t.sizes.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={s === size}
              onClick={() => setSize(s)}
              className={`size-9 text-[0.875rem] font-semibold transition-colors ${s === size ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-ink/10"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-4 gap-1" aria-live="polite">
        {t.channels.map((c, i) => (
          <li key={c} className="min-w-0 bg-paper px-2.5 py-2">
            <span className="block truncate text-[0.8125rem] text-ink-2">{c}</span>
            <span key={`${tick}-${size}`} className="display tabular block animate-[slide-up_500ms_var(--ease-out)_both] text-[1.6rem] leading-tight" style={{ animationDelay: `${i * 70}ms` }}>
              {n}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <button type="button" onClick={act} className="tag tag-xs tag-plain flex h-11 items-center gap-3 bg-accent pr-5 pl-6 font-semibold text-paper transition-colors hover:bg-ink">
          {n > 0 ? t.sell : t.restock}
          <span aria-hidden>→</span>
        </button>
        <p className="text-[0.8125rem] text-ink-2">{t.note}</p>
      </div>
    </div>
  );
}
