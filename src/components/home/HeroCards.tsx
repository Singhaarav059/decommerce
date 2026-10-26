"use client";

import { useRef } from "react";
import { Check } from "@/components/ui/Check";
import { useSequenceProgress } from "@/components/media/ScrollSequence";
import { heroCards as c } from "@/content/home";

/**
 * Three pieces of the product floating over the hero film (wide screens): the example order
 * being routed, the one stock count with a chart line that draws itself, and a sync status.
 * They arrive once the hero window has opened, bob gently, drift up at different speeds as you
 * scroll, and leave as the hero ends. Decorative and labelled as an example.
 */
export function HeroCards() {
  const wrap = useRef<HTMLDivElement>(null);
  useSequenceProgress((p) => {
    const el = wrap.current;
    if (!el) return;
    // arrive once the window has opened onto the film, leave just before the hero ends
    const inn = Math.min(1, Math.max(0, (p - 0.42) / 0.12));
    const out = Math.min(1, Math.max(0, (p - 0.9) / 0.1));
    const o = Math.min(inn, 1 - out);
    el.style.opacity = String(o);
    el.style.visibility = o <= 0 ? "hidden" : "visible";
    el.querySelectorAll<HTMLElement>("[data-depth]").forEach((card) => {
      card.style.translate = `0 ${(-(p - 0.5) * Number(card.dataset.depth)).toFixed(1)}px`;
    });
  });
  return (
    <div ref={wrap} aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block" style={{ opacity: 0, visibility: "hidden" }}>
      {/* the order card */}
      <div data-depth="220" className="absolute top-[24%] right-[6%] w-[290px]">
        <div className="hero-card float-a tag tag-sm bg-paper p-4 pt-6" style={{ animationDelay: "500ms" }}>
          <div className="flex items-center justify-between text-[0.8125rem]">
            <span className="flex items-center gap-2 font-semibold text-ink-2">
              <span className="tag tag-plain size-2.5 bg-copper [--cut:4px]" />
              {c.order.label}
            </span>
            <span className="text-[0.8125rem] text-ink-2">{c.tag}</span>
          </div>
          <p className="display tabular mt-2 text-[1.5rem] leading-none">{c.order.id}</p>
          <p className="mt-1 text-[0.82rem] text-ink-2">{c.order.item}</p>
          <ol className="mt-4 flex items-center gap-1.5 text-[0.8125rem] font-semibold">
            {c.order.steps.map((s, i) => (
              <li key={s} className="flex flex-1 flex-col gap-1.5">
                <span className="h-1 overflow-hidden bg-studio-light">
                  {i < 2 && <span className="hero-fill block h-full origin-left bg-copper" style={{ animationDelay: `${1100 + i * 650}ms` }} />}
                </span>
                <span className={i < 2 ? "text-ink" : "text-ink-2"}>{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex items-center justify-between bg-studio-light px-3 py-2 text-[0.875rem]">
            <span>{c.order.route}</span>
            <span className="font-semibold text-copper">{c.order.distance}</span>
          </div>
        </div>
      </div>
      {/* the stock card */}
      <div data-depth="120" className="absolute top-[54%] right-[24%] w-[300px]">
        <div className="hero-card float-b tag tag-sm bg-paper p-4 pt-6" style={{ animationDelay: "800ms" }}>
          <p className="text-[0.8125rem] font-semibold text-ink-2">{c.stock.label}</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="flex items-baseline gap-2">
              <span className="display tabular text-[2.4rem] leading-none text-copper">{c.stock.value}</span>
              <span className="text-[0.8125rem] text-ink-2">{c.stock.unit}</span>
            </p>
            <svg viewBox="0 0 90 36" className="h-9 w-[90px]">
              <path d="M2 8 L18 10 L32 9 L46 15 L60 18 L74 26 L88 32" fill="none" stroke="var(--copper)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="hero-draw" />
            </svg>
          </div>
          <ul className="mt-3 grid grid-cols-4 gap-1 text-center text-[0.8125rem] text-ink-2">
            {c.stock.channels.map((ch) => (
              <li key={ch} className="min-w-0 truncate bg-studio-light px-1 py-1.5">
                <span className="tabular block text-[0.85rem] font-semibold text-ink">1</span>
                {ch}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* the sync pill */}
      <div data-depth="60" className="absolute right-[7%] bottom-[16%]">
        <div className="hero-card float-c tag tag-xs tag-plain flex items-center gap-2.5 bg-paper py-2 pr-4 pl-3 text-[0.875rem]" style={{ animationDelay: "1100ms" }}>
          <span className="flex size-6 items-center justify-center bg-copper text-[0.8125rem] text-paper"><Check /></span>
          {c.sync}
        </div>
      </div>
    </div>
  );
}
