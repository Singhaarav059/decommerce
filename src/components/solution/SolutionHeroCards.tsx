"use client";

import { useRef, useState } from "react";
import { useSequenceProgress } from "@/components/media/ScrollSequence";
import { moduleScreens, type SolutionSlug } from "@/content/site";

/**
 * Over a solution page's film, once the window has opened: an example screen of the module and
 * the "with Decommerce" steps ticking off as the film plays. Wide screens only; labelled Example.
 */
export function SolutionHeroCards({ slug, label, fix, steps }: { slug: SolutionSlug; label: string; fix: string; steps: string[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(-1);
  useSequenceProgress((p) => {
    const el = wrap.current;
    if (!el) return;
    const inn = Math.min(1, Math.max(0, (p - 0.42) / 0.12));
    const out = Math.min(1, Math.max(0, (p - 0.94) / 0.06));
    const o = Math.min(inn, 1 - out);
    el.style.opacity = String(o);
    el.style.visibility = o <= 0 ? "hidden" : "visible";
    const k = Math.floor(((p - 0.5) / 0.4) * steps.length);
    const d = Math.min(steps.length - 1, Math.max(-1, k));
    setDone((v) => (v === d ? v : d));
  });
  const screen = moduleScreens[slug];
  return (
    <div ref={wrap} aria-hidden className="pointer-events-none absolute inset-0 z-[1] hidden lg:block" style={{ opacity: 0, visibility: "hidden" }}>
      <div className="absolute top-[22%] right-[6%] w-[270px]">
        <div className="float-a tone-light rounded-[var(--radius-lg)] bg-paper/95 p-4 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.45)]">
          <div className="flex items-center justify-between text-[0.72rem] text-ink-2">
            <span className="eyebrow">{label}</span>
            <span className="mono">Example</span>
          </div>
          <p className="display mt-2 text-[1.35rem] leading-none">{screen.title}</p>
          <dl className="mt-3 divide-y divide-line text-[0.82rem]">
            {screen.rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 py-1.5">
                <dt className="text-ink-2">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="absolute right-[22%] bottom-[14%] w-[300px]">
        <div className="float-b tone-night rounded-[var(--radius-lg)] bg-night/90 p-5 text-[#f4eee6] shadow-[0_24px_48px_-16px_rgb(0_0_0/0.55)] ring-1 ring-white/10">
          <p className="eyebrow">With Decommerce</p>
          <p className="display mt-2 text-[1.3rem] leading-tight">{fix.replace(/\*/g, "")}</p>
          <ol className="mt-3 space-y-2 text-[0.85rem]">
            {steps.map((s, i) => (
              <li key={s} className={`flex items-center gap-2.5 transition-opacity duration-300 ${i <= done ? "opacity-100" : "opacity-45"}`}>
                <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[0.7rem] transition-colors duration-300 ${i <= done ? "bg-[#f0a774] text-[#1c1712]" : "ring-1 ring-white/30"}`}>{i <= done ? "✓" : i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
