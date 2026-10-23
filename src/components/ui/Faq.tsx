"use client";

import { useId, useState } from "react";
import type { Faq as FaqItem } from "@/content/types";

/** Accordion: one open at a time, height animated with the grid 0fr→1fr trick. */
export function Faq({ items, className = "" }: { items: FaqItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <ul className={`border-t border-line ${className}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btn = `${base}-q${i}`;
        const panel = `${base}-a${i}`;
        return (
          <li key={item.q} className="border-b border-line">
            <h3>
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-medium tracking-tight md:text-lg"
              >
                {item.q}
                <span
                  aria-hidden
                  className={`relative size-4 shrink-0 transition-transform duration-500 ease-[var(--ease-overshoot)] ${isOpen ? "rotate-45" : ""}`}
                >
                  <span className="absolute top-1/2 left-0 h-px w-full bg-current" />
                  <span className="absolute top-0 left-1/2 h-full w-px bg-current" />
                </span>
              </button>
            </h3>
            <div
              id={panel}
              role="region"
              aria-labelledby={btn}
              className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="max-w-[62ch] pb-6 leading-relaxed text-ink-soft">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
