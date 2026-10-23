"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Hotspot } from "@/content/types";

/**
 * BLUNT-style anatomy: numbered pins over a scene or poster. One pin open at a
 * time; Escape or a click outside closes it. Pins are real buttons so the
 * whole anatomy is reachable by keyboard, and a plain list mirrors it below
 * on small screens where popovers would cover the scene.
 */
export function Hotspots({
  items,
  children,
  className = "",
  onActiveChange,
}: {
  items: Hotspot[];
  children: ReactNode;
  className?: string;
  onActiveChange?: (id: string | null) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  const onChange = useRef(onActiveChange);
  useEffect(() => {
    onChange.current = onActiveChange;
  });

  const set = (id: string | null) => {
    setOpen(id);
    onChange.current?.(id);
  };

  useEffect(() => {
    const close = () => {
      setOpen(null);
      onChange.current?.(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div ref={root} className={className}>
      <div className="relative">
        {children}
        {items.map((h, i) => {
          const isOpen = open === h.id;
          const flip = h.x > 60;
          return (
            <div key={h.id} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-label={`${i + 1}. ${h.label}`}
                onClick={() => set(isOpen ? null : h.id)}
                className={`relative -translate-x-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full font-mono text-[0.72rem] transition-[background-color,color,transform] duration-300 ease-[var(--ease-overshoot)] ${
                  isOpen ? "scale-110 bg-copper text-stone-50" : "bg-stone-50 text-ink shadow-[0_0_0_1px_var(--line)] hover:scale-110"
                }`}
              >
                {!isOpen && <span aria-hidden className="hotspot-ping absolute inset-0 rounded-full" />}
                {i + 1}
              </button>
              {isOpen && (
                <div
                  role="note"
                  className={`hotspot-pop absolute top-1/2 z-10 hidden w-64 -translate-y-1/2 rounded-[var(--radius-md)] bg-ink p-4 text-stone-50 md:block ${
                    flip ? "right-7" : "left-7"
                  }`}
                >
                  <p className="text-[0.92rem] font-medium">{h.label}</p>
                  <p className="mt-1 text-[0.85rem] leading-relaxed text-stone-50/70">{h.detail}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Small screens: the anatomy as a list, highlighted in step with the pins */}
      <ol className="mt-6 space-y-3 md:hidden">
        {items.map((h, i) => (
          <li key={h.id}>
            <button
              type="button"
              onClick={() => set(open === h.id ? null : h.id)}
              aria-expanded={open === h.id}
              className={`flex w-full gap-3 rounded-[var(--radius-md)] p-3 text-left transition-colors ${
                open === h.id ? "bg-ink text-stone-50" : "bg-travertine/60"
              }`}
            >
              <span className="font-mono text-[0.72rem] leading-6">{i + 1}</span>
              <span>
                <span className="block text-[0.95rem] font-medium">{h.label}</span>
                {open === h.id && <span className="mt-1 block text-[0.85rem] leading-relaxed opacity-75">{h.detail}</span>}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
