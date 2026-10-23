"use client";

import { useEffect, useState } from "react";

/**
 * An isometric stack of slabs (security layers, server rack units) drawn with
 * CSS 3D transforms, no WebGL. The slabs part as the matching h2 in the page
 * body scrolls into view; reduced motion shows them parted from the start.
 */
export function ExplodedStack({ layers, variant = "slab", label }: { layers: { label: string; detail: string }[]; variant?: "slab" | "rack"; label: string }) {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setActive(layers.length - 1));
      return () => cancelAnimationFrame(raf);
    }
    const heads = [...document.querySelectorAll<HTMLElement>("article h2")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(heads.indexOf(e.target as HTMLElement));
      },
      { rootMargin: "-30% 0px -50% 0px" },
    );
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [layers.length]);

  const n = layers.length;
  const rack = variant === "rack";
  return (
    <figure aria-label={label} className="sticky top-[calc(var(--header-h)+32px)] select-none">
      <div className="relative mx-auto h-[420px] w-full max-w-[360px] [perspective:1400px]">
        <div className="absolute inset-x-0 top-[38%] [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-38deg)]">
          {layers.map((l, i) => {
            const lift = (n - 1 - i) * (rack ? 34 : 26);
            const parted = i <= active ? (n - i) * 22 : 0;
            const on = i === active;
            return (
              <div
                key={l.label}
                className="absolute left-1/2 top-0 h-[160px] w-[160px] -translate-x-[58%] transition-transform duration-[900ms] ease-[var(--ease-overshoot)] [transform-style:preserve-3d]"
                style={{ transform: `translateZ(${lift + parted}px)` }}
              >
                <div
                  className={`absolute inset-0 rounded-[10px] transition-colors duration-500 ${rack ? "bg-[#2a2722]" : i % 2 ? "bg-travertine" : "terrazzo"}`}
                  style={{ boxShadow: on ? "0 0 0 2px var(--copper)" : "0 0 0 1px rgb(23 21 15 / 0.12)" }}
                >
                  {rack && (
                    <div className="absolute inset-3 grid grid-cols-6 gap-1.5">
                      {Array.from({ length: 12 }, (_, k) => (
                        <span key={k} className={`rounded-sm ${on && k % 5 === 0 ? "bg-copper" : "bg-[#4a463d]"}`} />
                      ))}
                    </div>
                  )}
                </div>
                {/* slab thickness: front and side faces */}
                <div className={`absolute bottom-0 left-0 h-[18px] w-full origin-bottom [transform:rotateX(-90deg)] ${rack ? "bg-[#1d1b16]" : "bg-[#c9b8a0]"}`} />
                <div className={`absolute top-0 right-0 h-full w-[18px] origin-right [transform:rotateY(90deg)] ${rack ? "bg-[#151310]" : "bg-[#b7a68e]"}`} />
              </div>
            );
          })}
        </div>
      </div>
      <figcaption>
        <ol className="space-y-1.5">
          {layers.map((l, i) => (
            <li key={l.label} className={`flex items-baseline gap-3 rounded-[var(--radius-sm)] px-2 py-1 text-sm transition-colors ${i === active ? "bg-ink text-stone-50" : "text-ink-soft"}`}>
              <span className={`font-mono text-[0.7rem] ${i === active ? "text-stone-50/75" : "text-ink-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className="font-medium">{l.label}</span>
              <span className={i === active ? "text-stone-50/75" : "text-ink-muted"}>{l.detail}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
