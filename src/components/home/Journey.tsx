"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { journey as j } from "@/content/home";
import { useScrollVar } from "@/lib/useScrollVar";

/**
 * Follow one order, sideways: the section pins and vertical scrolling slides five panels
 * across the screen, each a frame of the store films with the matching product screen
 * floating on it. A copper bar at the foot shows how far along ORD-1042 is.
 */
export function Journey() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useScrollVar(ref);
  // how far the track has to travel: its full width minus one screen
  useEffect(() => {
    const el = ref.current, t = track.current;
    if (!el || !t) return;
    const fit = () => el.style.setProperty("--travel", `${Math.max(0, t.scrollWidth - innerWidth)}px`);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(t);
    addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      removeEventListener("resize", fit);
    };
  }, []);
  return (
    <section ref={ref} id="journey" aria-label={j.headline} className="journey relative h-[420svh] bg-studio-light" style={{ "--c": 0, "--travel": "0px" } as CSSProperties}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-[calc(var(--header-h)+8px)] pb-6">
        <div className="mx-auto flex w-full max-w-[var(--max-w)] flex-wrap items-end justify-between gap-4 px-[var(--gutter)]">
          <div>
            <p className="eyebrow">
              <span className="tabular text-copper">03</span>
              {j.eyebrow}
            </p>
            <h2 className="display mt-3 text-[clamp(1.8rem,3.6vw,3.4rem)] leading-[1] tracking-[-0.035em]">{j.headline}</h2>
          </div>
          <p className="max-w-[44ch] text-[0.95rem] text-ink-2 max-md:hidden">{j.body}</p>
        </div>
        <div ref={track} className="journey-track mt-6 flex min-h-0 flex-1 gap-4 px-[var(--gutter)] md:gap-6">
          {j.steps.map((s) => (
            <article key={s.n} className="relative flex w-[86vw] shrink-0 flex-col overflow-hidden rounded-[var(--radius-xl)] bg-paper shadow-[var(--shadow-md)] ring-1 ring-black/5 md:w-[64vw] lg:w-[54vw]">
              <div className="relative min-h-0 flex-1">
                <Image src={s.image} alt="" fill sizes="(max-width: 768px) 86vw, 60vw" quality={80} className="object-cover object-[72%_50%]" />
                {/* the product screen for this step */}
                <div className="tone-light absolute right-4 bottom-4 w-[min(300px,78%)] rounded-[var(--radius-lg)] bg-paper/95 p-4 shadow-[var(--shadow-md)]">
                  <div className="flex items-center justify-between text-[0.7rem]">
                    <span className="eyebrow">{s.ui.title}</span>
                    <span className="mono text-ink-2">Example</span>
                  </div>
                  <dl className="mt-2 divide-y divide-line text-[0.82rem]">
                    {s.ui.rows.map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-3 py-1.5">
                        <dt className="min-w-0 text-ink-2">{k}</dt>
                        <dd className="shrink-0 text-right font-semibold whitespace-nowrap">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <span className="display mono absolute top-4 left-4 rounded-full bg-night/80 px-3 py-1 text-[0.8rem] text-[#f4eee6]">{s.n} / 05</span>
              </div>
              <div className="flex items-start justify-between gap-6 p-5 md:p-6">
                <div>
                  <h3 className="display t-h3">{s.title}</h3>
                  <p className="mt-2 max-w-[52ch] text-[0.95rem] text-ink-2">{s.body}</p>
                </div>
                <Link href={s.href} aria-label={`More about ${s.title.toLowerCase()}`} className="flex size-10 shrink-0 items-center justify-center rounded-full text-copper shadow-[inset_0_0_0_1.5px_var(--line-strong)] transition-colors hover:bg-copper hover:text-paper">
                  →
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-5 w-full max-w-[var(--max-w)] px-[var(--gutter)]">
          <div className="relative h-[3px] overflow-hidden rounded-full bg-line-strong">
            <span className="journey-bar absolute inset-y-0 left-0 w-full origin-left rounded-full bg-copper" />
          </div>
        </div>
      </div>
    </section>
  );
}
