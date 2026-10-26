"use client";

import { useId, useRef, useState, type ReactNode } from "react";

export type TabItem = { id: string; label: string; content: ReactNode };

/**
 * Accessible tabs (roving tabindex, arrow keys, Home/End). `onChange` lets a
 * scene follow the active tab, e.g. to swap camera angles.
 */
export function Tabs({
  items,
  label,
  onChange,
  className = "",
}: {
  items: TabItem[];
  label: string;
  onChange?: (id: string, index: number) => void;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus = false) => {
    setActive(i);
    onChange?.(items[i].id, i);
    if (focus) refs.current[i]?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    const last = items.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (active === 0 ? last : active - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} onKeyDown={onKey} className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
        {items.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`${base}-t${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${base}-p${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            className={`relative shrink-0 px-3 pt-2 pb-3 text-[0.92rem] whitespace-nowrap transition-colors ${
              i === active ? "text-ink" : "text-ink-muted hover:text-ink"
            }`}
          >
            {t.label}
            <span
              aria-hidden
              className={`absolute inset-x-3 -bottom-px h-0.5 origin-left bg-accent transition-transform duration-500 ease-[var(--ease-out)] ${
                i === active ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        ))}
      </div>
      {items.map((t, i) => (
        <div
          key={t.id}
          id={`${base}-p${i}`}
          role="tabpanel"
          aria-labelledby={`${base}-t${i}`}
          hidden={i !== active}
          tabIndex={0}
          className="pt-6 focus-visible:outline-none"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
