"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Headline } from "./Headline";

export type BandStep = { title: string; body: string; result?: string };

/** Stage fills, darkest first: the order reads dark to light, all in the one green hue. */
const FILLS = [
  { bg: "bg-[#10261b]", ink: "text-paper", soft: "text-paper/80" },
  { bg: "bg-[#1d4434]", ink: "text-paper", soft: "text-paper/80" },
  { bg: "bg-accent", ink: "text-paper", soft: "text-paper/85" },
  { bg: "bg-[#d6e6db]", ink: "text-ink", soft: "text-ink-2" },
  { bg: "bg-[#ecf3ee]", ink: "text-ink", soft: "text-ink-2" },
];

/**
 * The one design for every "how it works" sequence: one row of tinted panels with no gaps, dark
 * to light in step order. The open step takes most of the width with its text and a photograph;
 * the others are slivers showing only their name. On wide screens the section pins and scrolling
 * walks through the steps (choosing a sliver scrolls to it); phones stack the panels as bars
 * that open on tap. Reduced motion: no pin, tap to open.
 */
export function StepsBand({
  id,
  headline,
  lead,
  steps,
  backdrop,
  images,
  resultLabel = "You have",
  headerAside,
  tone = "studio",
}: {
  id?: string;
  index?: string;
  eyebrow?: string;
  headline: string;
  lead?: string;
  steps: BandStep[];
  backdrop: string;
  /** One photograph per step for the open panel; falls back to the backdrop. */
  images?: string[];
  resultLabel?: string;
  headerAside?: ReactNode;
  tone?: "studio" | "soft";
}) {
  const [open, setOpen] = useState(0);
  const [pinned, setPinned] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const n = steps.length;

  useEffect(() => {
    const mq = matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const sync = () => setPinned(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // pinned: the scroll position through the section picks the open step
  useEffect(() => {
    const el = ref.current;
    if (!pinned || !el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(0.999, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      setOpen(Math.floor(p * n));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
    };
  }, [pinned, n]);

  const choose = (i: number) => {
    const el = ref.current;
    if (!pinned || !el) return setOpen(i);
    const top = el.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + ((i + 0.5) / n) * (el.offsetHeight - innerHeight), behavior: "smooth" });
  };

  return (
    <section ref={ref} id={id} className={`relative ${tone === "soft" ? "bg-studio-light" : "bg-studio"}`} style={pinned ? { height: `${100 + n * 55}svh` } : undefined}>
      <div className={pinned ? "sticky top-0 flex h-[100svh] flex-col justify-center" : ""}>
        <div className={`mx-auto w-full max-w-[var(--max-w)] px-[var(--gutter)] ${pinned ? "pt-[calc(var(--header-h)+8px)] pb-8" : "py-[var(--section-gap)]"}`}>
          <header className="max-w-[880px]">
            <Headline as="h2" reveal text={headline} className="t-h2 lg:max-w-[20ch]" />
            {lead && <p className="t-lead mt-6 max-w-[56ch] text-ink-2">{lead}</p>}
            {headerAside && <div className="mt-6">{headerAside}</div>}
          </header>
          <ol className="rv mt-10 flex flex-col overflow-hidden md:mt-12 lg:h-[min(500px,50svh)] lg:flex-row">
            {steps.map((s, i) => {
              const f = FILLS[i % FILLS.length];
              const on = i === open;
              return (
                <li
                  key={s.title}
                  className={`${f.bg} ${f.ink} relative min-w-0 overflow-hidden transition-[flex-grow] duration-[600ms] ease-[var(--ease-in-out)] lg:basis-0 ${on ? "lg:grow-[7]" : "lg:grow"} ${i === 0 ? "tag tag-lg tag-plain" : ""}`}
                >
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => choose(i)}
                    className={`flex w-full items-center gap-4 px-6 text-left lg:absolute lg:inset-0 lg:items-end lg:px-0 ${on ? "py-5 lg:pointer-events-none lg:opacity-0" : "h-16 lg:h-auto lg:py-0"}`}
                  >
                    <span className={`tabular text-[0.94rem] ${f.soft} lg:hidden`}>{i + 1}</span>
                    <span className="display text-[1.125rem] lg:absolute lg:bottom-6 lg:left-1/2 lg:w-max lg:origin-left lg:-rotate-90 lg:text-[1.25rem] lg:whitespace-nowrap lg:[translate:-0.6em_0]">{s.title}</span>
                  </button>
                  <div className={`grid transition-[grid-template-rows,opacity] duration-[600ms] ease-[var(--ease-out)] lg:absolute lg:inset-0 lg:flex ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 lg:pointer-events-none"}`} inert={!on}>
                    <div className="flex min-h-0 overflow-hidden lg:w-full">
                      <div className="flex w-full flex-col gap-6 p-6 pt-0 lg:w-1/2 lg:justify-between lg:p-10">
                        <h3 className={`display hidden text-[clamp(2rem,3vw,2.6rem)] leading-none lg:block ${i === 0 ? "lg:pt-10" : ""}`}>{s.title}</h3>
                        <div>
                          <p className="max-w-[36ch] text-[1.06rem] leading-relaxed lg:text-[1.125rem]">{s.body}</p>
                          {s.result && (
                            <p className={`mt-5 max-w-[36ch] text-[0.94rem] leading-relaxed ${f.soft}`}>
                              <span className={`font-semibold ${f.ink}`}>{resultLabel}: </span>
                              {s.result}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="tag tag-lg relative m-4 ml-0 hidden w-1/2 overflow-hidden lg:block">
                        <Image src={images?.[i] ?? backdrop} alt="" fill sizes="30vw" quality={75} style={{ objectPosition: "50% 45%" }} className={`object-cover transition-transform duration-[1800ms] ease-[var(--ease-out)] ${on ? "scale-100" : "scale-110"}`} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          {/* where you are in the sequence: one filled bar per step */}
          {pinned && (
            <div aria-hidden className="mt-5 grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
              {steps.map((s, i) => (
                <span key={s.title} className={`h-1 transition-colors duration-500 ${i <= open ? "bg-accent" : "bg-ink/10"}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
