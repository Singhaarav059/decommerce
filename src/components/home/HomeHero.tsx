"use client";

import Image from "next/image";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { hero, heroTag as t } from "@/content/home";

type Size = (typeof t.sizes)[number];

// the headline breaks after "behind": the wall holds the first line, the second runs on below it
const words = hero.headline.split(" ");
const LINES = [words.slice(0, 3).join(" "), words.slice(3).join(" ")];

/**
 * The homepage opening, full bleed: the flagship cut open like a dollhouse (website studio,
 * stockroom, shop floor, the van at the kerb), every part threaded to one glowing hang tag. The
 * picture is a still (sharp at any size); the life is drawn over it: light pulses flow along the
 * threads into the tag, and selling one on the live tag sends a pulse from the counter into the
 * tag and back out to every channel as their counts drop together. The plain wall on the left
 * carries the words. Reduced motion: the still alone.
 */
export function HomeHero() {
  const [burst, setBurst] = useState(0);
  return (
    <section id="ch-store" aria-label={hero.posterAlt} className="relative overflow-hidden bg-studio lg:h-[100svh] lg:min-h-[680px]">
      {/* wide screens: the cutaway fills the screen behind the words */}
      <div className="hero-drift absolute inset-0 hidden lg:block">
        <Image src={HERO.src} alt="" fill priority sizes="100vw" quality={80} className="object-cover" />
        <Pulses burst={burst} align="xMidYMid" />
      </div>
      <Front
        onSell={() => setBurst((b) => b + 1)}
        picture={
          // phones and tablets: the building in its own frame between the words and the tag (the overlay
          // is laid out exactly like the cover-fitted picture, right-aligned)
          <div className="relative -mx-[var(--gutter)] aspect-[8/9] overflow-hidden md:aspect-[4/3] lg:hidden">
            <Image src={HERO.src} alt="" fill priority sizes="100vw" quality={80} className="object-cover object-right" />
            <Pulses burst={burst} align="xMaxYMid" />
          </div>
        }
      />
    </section>
  );
}

// the picture and where its threads run, in its own pixels (assets-src/style3/HERO-4k2.png)
const HERO = { src: "/assets/hero/cutaway.webp", w: 5504, h: 3072 };
const TAG = { x: 4205, y: 1577 };
const THREADS = {
  website: "M3792 490 C4000 520 4120 1200 4183 1514",
  stockroom: "M3701 1354 Q3950 1400 4155 1528",
  counter: "M3390 2120 Q3800 1850 4142 1624",
  customer: "M3853 2133 Q4080 1900 4178 1652",
  van: "M4712 2216 Q4330 2050 4238 1652",
  courier: "M5119 2202 Q4750 1750 4266 1624",
} as const;
const reverse = (d: string) => {
  // turn "M a C b c d" or "M a Q b c" into the same curve drawn from the far end
  const n = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
  const pts = [];
  for (let i = 0; i < n.length; i += 2) pts.push(`${n[i]} ${n[i + 1]}`);
  const cmd = d.includes("C") ? "C" : "Q";
  pts.reverse();
  return `M${pts[0]} ${cmd}${pts.slice(1).join(" ")}`;
};

/** Light on the threads: a steady flow into the tag, and on each sale a burst from the counter out to every channel. */
function Pulses({ burst, align }: { burst: number; align: string }) {
  const ids = Object.keys(THREADS) as (keyof typeof THREADS)[];
  return (
    <svg aria-hidden viewBox={`0 0 ${HERO.w} ${HERO.h}`} preserveAspectRatio={`${align} slice`} className="hero-pulses absolute inset-0 size-full">
      <defs>
        <radialGradient id={`pulse-glow-${align}`}>
          <stop offset="0" stopColor="#eafff2" />
          <stop offset="0.35" stopColor="#7be3a6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#3fbf7a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* the steady flow: one pulse per thread, staggered */}
      {ids.map((k, i) => (
        <circle key={k} r="44" fill={`url(#pulse-glow-${align})`} className="pulse-flow" style={{ offsetPath: `path("${THREADS[k]}")`, animationDelay: `${i * 0.7}s` }} />
      ))}
      {/* the tag breathes as pulses arrive */}
      <circle cx={TAG.x} cy={TAG.y} r="150" fill={`url(#pulse-glow-${align})`} className="tag-breathe" />
      {burst > 0 && (
        <g key={burst}>
          <circle r="70" fill={`url(#pulse-glow-${align})`} className="pulse-in" style={{ offsetPath: `path("${THREADS.counter}")` }} />
          <circle cx={TAG.x} cy={TAG.y} r="260" fill={`url(#pulse-glow-${align})`} className="tag-flash" />
          {ids
            .filter((k) => k !== "counter")
            .map((k) => (
              <circle key={k} r="60" fill={`url(#pulse-glow-${align})`} className="pulse-out" style={{ offsetPath: `path("${reverse(THREADS[k])}")` }} />
            ))}
        </g>
      )}
    </svg>
  );
}

function Front({ onSell, picture }: { onSell: () => void; picture: React.ReactNode }) {
  return (
    <>
      <div aria-hidden className="scrim absolute inset-0 hidden lg:block" />
      <div className="relative mx-auto flex h-full max-w-[var(--max-w)] flex-col px-[var(--gutter)] pt-[var(--header-h)] pb-10 lg:justify-center lg:pb-8">
        {/* everything sits on the plain wall: the left 42% of the frame */}
        <div className="lg:max-w-[min(40vw,600px)]">
        <div className="max-lg:pt-6 max-lg:pb-7">
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
        {picture}
        <HangTag onSell={onSell} />
        </div>
      </div>
    </>
  );
}

/** The live thing: the shirt's tag, with one stock count that every channel reads. Sell one and they all drop together. */
function HangTag({ onSell }: { onSell: () => void }) {
  const [size, setSize] = useState<Size>("M");
  const [stock, setStock] = useState(t.start);
  const [tick, setTick] = useState(0);
  const n = stock[size];
  const act = () => {
    setStock((s) => ({ ...s, [size]: n > 0 ? n - 1 : t.start[size] }));
    setTick((k) => k + 1);
    if (n > 0) onSell();
  };
  return (
    <div className="intro tag tag-sm relative z-[1] -mt-10 w-full max-w-[520px] bg-accent p-5 pt-7 text-paper lg:mt-10">
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
