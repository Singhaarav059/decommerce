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
            <h2 className="display text-[clamp(1.8rem,3.6vw,3.4rem)] leading-[1] tracking-[-0.035em]">{j.headline}</h2>
          </div>
          <p className="max-w-[44ch] text-[0.95rem] text-ink-2 max-md:hidden">{j.body}</p>
        </div>
        <div ref={track} className="journey-track mt-6 flex min-h-0 flex-1 gap-4 px-[var(--gutter)] md:gap-6">
          {j.steps.map((s) => (
            <article key={s.title} className="relative flex w-[86vw] shrink-0 flex-col md:w-[64vw] lg:w-[54vw]">
              <div className="tag tag-lg relative min-h-0 flex-1 overflow-hidden bg-studio">
                <Image src={s.image} alt="" fill sizes="(max-width: 768px) 86vw, 60vw" quality={85} className="object-cover object-[50%_42%]" />
              </div>
              {/* the words and the product screen for this step sit under the picture, never on it */}
              <div className="flex items-start gap-5 pt-5 md:gap-6">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[0.875rem] font-semibold">
                    <span aria-hidden className="tag tag-plain size-3 shrink-0 bg-accent [--cut:5px]" />
                    {s.tag}
                  </p>
                  <h3 className="display t-h3 mt-2">{s.title}</h3>
                  <p className="mt-2 max-w-[52ch] text-[0.95rem] text-ink-2">{s.body}</p>
                </div>
                <div className="w-[min(280px,38%)] shrink-0 bg-paper p-4 max-md:hidden">
                  <div className="flex items-center justify-between text-[0.8125rem]">
                    <span className="text-[0.875rem] font-semibold">{s.ui.title}</span>
                    <span className="text-ink-2">Example</span>
                  </div>
                  <dl className="mt-2 text-[0.82rem]">
                    {s.ui.rows.map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-3 py-1.5">
                        <dt className="min-w-0 text-ink-2">{k}</dt>
                        <dd className="shrink-0 text-right font-semibold whitespace-nowrap">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <Link href={s.href} aria-label={`More about ${s.title.toLowerCase()}`} className="tag tag-xs tag-plain flex size-11 shrink-0 items-center justify-center bg-ink text-paper transition-colors hover:bg-accent">
                  →
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-5 w-full max-w-[var(--max-w)] px-[var(--gutter)]">
          <div className="relative h-[3px] overflow-hidden bg-ink/10">
            <span className="journey-bar absolute inset-y-0 left-0 w-full origin-left bg-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}
