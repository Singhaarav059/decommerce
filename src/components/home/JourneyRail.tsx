"use client";

import { useEffect, useState } from "react";
import { order } from "@/content/home";

// Which part of which chapter is each stage of the order's journey: [chapter id, from, to] in chapter progress.
const STAGES: { label: string; at: [string, number, number] }[] = [
  { label: "Ordered", at: ["ch-order", 0, 0.34] },
  { label: "Routed", at: ["ch-order", 0.34, 1] },
  { label: "Packed", at: ["ch-pack", 0, 1] },
  { label: "On its way", at: ["ch-delivery", 0, 0.5] },
  { label: "Delivered", at: ["ch-delivery", 0.5, 1] },
];

/**
 * A small floating tracker that follows ORD-1042 through the homepage chapters,
 * so the order, pack and delivery films read as one journey. It sits bottom right, clear of
 * the text column (wide screens only).
 */
export function JourneyRail() {
  const [stage, setStage] = useState(-1);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      let found = -1;
      STAGES.forEach((s, i) => {
        const el = document.getElementById(s.at[0]);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const len = r.height - innerHeight;
        const p = len > 0 ? -r.top / len : -1;
        if (p >= s.at[1] && p < s.at[2] && r.top <= 0 && r.bottom >= innerHeight * 0.5) found = i;
      });
      setStage((v) => (v === found ? v : found));
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
  }, []);
  const on = stage >= 0;
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed right-[var(--gutter)] bottom-6 z-[var(--z-progress)] hidden transition-[opacity,translate] duration-500 ease-[var(--ease-out)] lg:block ${on ? "opacity-100" : "translate-y-4 opacity-0"}`}
    >
      <div className="flex items-center gap-4 rounded-full border border-line bg-paper py-2 pr-5 pl-2 shadow-[var(--shadow-md)]">
        <span className="tabular rounded-full bg-ink px-3 py-1.5 text-[0.8rem] font-semibold text-paper">{order.id}</span>
        <ol className="flex items-center gap-1.5">
          {STAGES.map((s, i) => (
            <li key={s.label} className="flex items-center gap-1.5">
              {i > 0 && <span className={`h-px w-5 transition-colors duration-500 ${i <= stage ? "bg-copper" : "bg-line-strong"}`} />}
              <span className={`flex items-center gap-1.5 text-[0.8rem] transition-colors duration-300 ${i === stage ? "font-semibold text-ink" : i < stage ? "text-copper" : "text-ink-2/85"}`}>
                <span className={`size-1.5 rounded-full transition-colors duration-300 ${i <= stage ? "bg-copper" : "bg-line-strong"}`} />
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
