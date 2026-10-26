"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import { costs } from "@/content/home";

type Side = "without" | "with";

/**
 * The problem in full, as a ledger you can switch: six places where separate systems cost a
 * retailer, each with its figure. Switching to "With Decommerce" turns every row copper
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
        <div role="group" aria-label="Compare" className="mt-8 inline-grid grid-cols-2 gap-1">
          {(["without", "with"] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={side === s}
              onClick={() => pick(s)}
              className={`tag tag-xs tag-plain h-11 px-5 text-[0.94rem] font-semibold whitespace-nowrap transition-colors duration-300 ${side === s ? (s === "with" ? "bg-accent text-paper" : "bg-ink text-paper") : "bg-studio-light text-ink-2 hover:text-ink"}`}
            >
              {costs.toggle[s]}
            </button>
          ))}
        </div>
      }
    >
      {/* a ledger of six rows; switching to "with" turns every row copper and the figures settle */}
      <div ref={board} className={`tag tag-lg tag-plain transition-colors duration-700 ${on ? "text-paper" : "text-ink"}`}>
        <ul className="grid gap-[3px]">
          {costs.rows.map((r, i) => {
            const v = r.visual;
            return (
              <li key={r.area} className={`grid items-center gap-4 px-6 py-8 md:py-10 transition-colors duration-700 ease-[var(--ease-out)] md:grid-cols-12 md:gap-8 md:px-10 ${on ? "bg-accent" : "bg-studio-light"}`} style={{ transitionDelay: `${i * 60}ms` }}>
                <h3 className="display t-h3 md:col-span-3">{r.area}</h3>
                <div key={side} className="animate-[slide-up_600ms_var(--ease-out)_both] md:col-span-4" style={{ animationDelay: `${i * 70}ms` }}>
                  {v.kind === "counts" && v.labels && (
                    <div className="flex gap-5">
                      {v.labels.map((l, k) => (
                        <div key={l}>
                          <p className="display tabular text-[clamp(2rem,3vw,2.6rem)] leading-none">{v[side][k]}</p>
                          <p className={`mt-1 text-[0.8125rem] ${on ? "text-paper/85" : "text-ink-2"}`}>{l}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {v.kind === "big" && v.note && (
                    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="display text-[clamp(2.4rem,3.6vw,3.2rem)] leading-none whitespace-nowrap">{v[side]}</span>
                      <span className={`text-[1.06rem] ${on ? "text-paper/90" : "text-ink-2"}`}>{v.note[side]}</span>
                    </p>
                  )}
                  {v.kind === "word" && <p className="display text-[clamp(1.8rem,2.6vw,2.3rem)] leading-none">{v[side]}</p>}
                </div>
                <p key={`${side}-t`} className={`animate-[slide-up_600ms_var(--ease-out)_both] text-[1.03rem] leading-relaxed md:col-span-5 ${on ? "text-paper/90" : "text-ink-2"}`} style={{ animationDelay: `${i * 70 + 60}ms` }}>
                  {r[side]}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="mt-4 text-[0.875rem] text-ink-2">{costs.toggle.hint}</p>
    </Section>
  );
}
