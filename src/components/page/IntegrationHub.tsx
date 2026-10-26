"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { integrations as it } from "@/content/integrations";

/**
 * Decommerce in the middle and the kinds of system it connects to around it, set over a photo of
 * the back room behind a dark scrim, in a frame cut as a hang tag. Every couple of seconds one
 * system syncs: its tag and spoke turn copper, a pulse runs along the spoke, and the feed below
 * names what moved (illustrative). Still under reduced motion. Phones: a grid of tags and the feed.
 */
export function IntegrationHub() {
  const cats = it.categories;
  const n = cats.length;
  const [on, setOn] = useState(0);
  const [log, setLog] = useState<number[]>([0]);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (document.hidden) return;
      setOn((a) => {
        const next = (a + 3) % n; // hop around the ring rather than step to the neighbour
        setLog((l) => [next, ...l].slice(0, 3));
        return next;
      });
    }, 2200);
    return () => clearInterval(t);
  }, [n]);

  return (
    <div className="tag tag-xl relative isolate overflow-hidden bg-night text-paper">
      <Image src={it.stage.image} alt="" fill sizes="(max-width: 1024px) 100vw, 55vw" quality={70} className="-z-10 object-cover" style={{ objectPosition: "85% 50%" }} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[rgb(20_16_12/0.78)]" />

      <div className="px-5 pt-24 pb-6 md:px-10 md:pt-16 md:pb-8">
        {/* wide screens: the ring */}
        <div aria-hidden className="relative mx-auto hidden aspect-square w-full max-w-[520px] md:block">
          <svg viewBox="-50 -50 100 100" className="absolute inset-0 size-full">
            <circle r="38" fill="none" stroke="rgb(255 255 255 / 0.28)" strokeWidth="0.3" strokeDasharray="1 1.4" />
            {cats.map((c, i) => {
              const a = (i / n) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(a) * 38, y = Math.sin(a) * 38;
              const lit = i === on;
              return (
                <g key={c.name}>
                  <line x1="0" y1="0" x2={x} y2={y} stroke={lit ? "var(--copper-bright)" : "rgb(255 255 255 / 0.28)"} strokeWidth={lit ? 0.7 : 0.3} style={{ transition: "stroke 400ms, stroke-width 400ms" }} />
                  {lit && <circle key={`p${log.length}-${on}`} r="1.3" fill="var(--copper-bright)" className="hub-pulse" style={{ offsetPath: `path("M ${x.toFixed(2)} ${y.toFixed(2)} L 0 0")`, animationIterationCount: 1, animationDuration: "1.4s" }} />}
                </g>
              );
            })}
          </svg>
          <div className="tag tag-lg tag-plain absolute top-1/2 left-1/2 flex size-[32%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center bg-copper px-3 text-center text-paper">
            <span className="display text-[1.3rem] leading-none">decommerce.</span>
            <span className="mt-2 text-[0.8125rem] leading-snug text-paper/85">one catalog · one stock count</span>
          </div>
          {cats.map((c, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            const lit = i === on;
            return (
              <span
                key={c.name}
                className={`tag tag-xs tag-plain absolute -translate-x-1/2 -translate-y-1/2 py-2 pr-3.5 pl-4 text-[0.875rem] font-semibold whitespace-nowrap transition-[background-color,color,scale] duration-400 ${lit ? "scale-105 bg-copper text-paper" : "bg-paper text-ink"}`}
                style={{ left: `${50 + Math.cos(a) * 38}%`, top: `${50 + Math.sin(a) * 38}%` }}
              >
                {c.name}
              </span>
            );
          })}
        </div>

        {/* phones: a grid of tags */}
        <ul aria-hidden className="grid grid-cols-2 gap-2 md:hidden">
          {cats.map((c, i) => (
            <li key={c.name} className={`tag tag-xs tag-plain py-2.5 pr-3 pl-4 text-[0.94rem] font-semibold transition-colors ${i === on ? "bg-copper text-paper" : "bg-paper text-ink"}`}>
              {c.name}
            </li>
          ))}
        </ul>

        {/* the feed: what just moved, newest first */}
        <div className="mt-6 bg-paper/10 p-4 md:mt-4">
          <p className="text-[0.8125rem] text-paper/80">{it.stage.feed}</p>
          <ul className="mt-2 space-y-1.5" aria-live="off">
            {log.map((i, k) => (
              <li key={`${i}-${k}-${log.length}`} className={`flex items-baseline justify-between gap-4 text-[0.94rem] ${k === 0 ? "animate-[slide-up_500ms_var(--ease-out)_both] text-paper" : "text-paper/70"}`}>
                <span className="min-w-0 truncate">{cats[i].event}</span>
                <span className="shrink-0 text-[0.8125rem] font-semibold">{cats[i].name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
