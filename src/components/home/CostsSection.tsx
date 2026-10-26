"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import { costs } from "@/content/home";

type Side = "without" | "with";

/**
 * The problem in full, as a board you can switch: six places where separate systems cost a
 * retailer, each with a small figure. Switching to "With Decommerce" turns the board copper
 * and every figure settles. It switches once by itself the first time
 * the board is in view, so the difference is seen even without a click.
 */
export function CostsSection() {
  // part of section 02 (the problem): no number of its own
  const [side, setSide] = useState<Side>("without");
  const board = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  useEffect(() => {
    const el = board.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        t = window.setTimeout(() => !touched.current && setSide("with"), 1800);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);
  const pick = (s: Side) => {
    touched.current = true;
    setSide(s);
  };
  const on = side === "with";
  return (
    <Section
      id="where-it-costs"
      eyebrow={costs.eyebrow}
      headline={costs.headline}
      lead={costs.body}
      headerAside={
        <div role="group" aria-label="Compare" className="relative mt-8 inline-grid grid-cols-2 rounded-full bg-paper p-1 shadow-[var(--shadow-sm)]">
          <span aria-hidden className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-ink transition-transform duration-500 ease-[var(--ease-out)] ${on ? "translate-x-full" : ""}`} />
          {(["without", "with"] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={side === s}
              onClick={() => pick(s)}
              className={`relative z-[1] h-10 rounded-full px-5 text-[0.9rem] font-semibold whitespace-nowrap transition-colors duration-300 ${side === s ? "text-paper" : "text-ink-2 hover:text-ink"}`}
            >
              {costs.toggle[s]}
            </button>
          ))}
        </div>
      }
    >
      <div
        ref={board}
        className={`rounded-[var(--radius-xl)] p-2 transition-colors duration-700 ease-[var(--ease-out)] md:p-3 ${on ? "bg-copper" : "bg-studio-light/70"}`}
      >
        <ul className="grid gap-2 md:grid-cols-2 md:gap-3 lg:grid-cols-3">
          {costs.rows.map((r, i) => {
            const v = r.visual;
            return (
              <li key={r.area} className={`flex min-h-[15rem] flex-col rounded-[var(--radius-lg)] p-6 transition-colors duration-700 bg-paper`}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="display t-h3">{r.area}</h3>
                  <span className="tabular text-[0.8rem] font-semibold text-copper">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div key={side} className="mt-6 animate-[slide-up_600ms_var(--ease-out)_both]" style={{ animationDelay: `${i * 70}ms` }}>
                  {v.kind === "counts" && v.labels && (
                    <div className="grid grid-cols-4 gap-1.5">
                      {v.labels.map((l, k) => (
                        <div key={l} className="rounded-[var(--radius-sm)] p-2 text-center shadow-[inset_0_0_0_1px_var(--line)]">
                          <p className="display tabular text-[1.6rem]">{v[side][k]}</p>
                          <p className="mt-1 truncate text-[0.72rem] text-ink-2">{l}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {v.kind === "big" && v.note && (
                    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className={`display whitespace-nowrap text-[clamp(2.6rem,4vw,3.4rem)] leading-none ${on ? "text-copper" : ""}`}>{v[side]}</span>
                      <span className="text-[0.9rem] text-ink-2">{v.note[side]}</span>
                    </p>
                  )}
                  {v.kind === "word" && <p className={`display text-[clamp(1.8rem,2.6vw,2.3rem)] leading-none ${on ? "text-copper" : ""}`}>{v[side]}</p>}
                </div>
                <p key={`${side}-t`} className="mt-auto animate-[slide-up_600ms_var(--ease-out)_both] pt-6 text-[0.98rem] leading-relaxed text-ink-2" style={{ animationDelay: `${i * 70 + 60}ms` }}>
                  {r[side]}
                </p>
              </li>
            );
          })}
        </ul>
        <p className={`px-4 pt-3 pb-2 text-[0.8rem] transition-colors duration-700 ${on ? "text-paper" : "text-ink-2"}`}>{costs.toggle.hint}</p>
      </div>
    </Section>
  );
}
