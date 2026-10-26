"use client";

import { useId, useState } from "react";
import type { Faq as FaqItem } from "@/content/types";

/**
 * Questions as filled tiles cut to the hang-tag shape, one open at a time. The open tile turns
 * copper and its plus becomes a minus; height is animated with the grid 0fr→1fr trick.
 * `tile` is the closed fill: one step from the surface the list sits on.
 */
export function Faq({ items, className = "", tile = "bg-studio-light" }: { items: FaqItem[]; className?: string; tile?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btn = `${base}-q${i}`;
        const panel = `${base}-a${i}`;
        return (
          <li key={item.q} className={`tag tag-sm transition-colors duration-300 ${isOpen ? "bg-accent text-paper" : `${tile} text-ink hover:bg-ink/[0.07]`}`}>
            <h3>
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-[72px] w-full items-center justify-between gap-6 px-6 py-4 text-left text-[1.125rem] font-medium tracking-tight md:text-[1.25rem]"
              >
                {item.q}
                <span aria-hidden className="relative size-4 shrink-0">
                  <span className="absolute top-1/2 left-0 h-[3px] w-full -translate-y-1/2 bg-current" />
                  <span className={`absolute top-0 left-1/2 h-full w-[3px] -translate-x-1/2 bg-current transition-transform duration-500 ease-[var(--ease-out)] ${isOpen ? "rotate-90" : ""}`} />
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
                <p className="max-w-[52ch] px-6 pb-6 text-[1.06rem] leading-relaxed">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
