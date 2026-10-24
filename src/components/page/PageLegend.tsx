"use client";

import { useEffect, useState } from "react";

/** A sticky legend of a long page's sections; the one being read is highlighted. */
export function PageLegend({ legend, label }: { legend: { label: string; detail: string }[]; label: string }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const heads = [...document.querySelectorAll<HTMLElement>("article h2")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(heads.indexOf(e.target as HTMLElement));
      },
      { rootMargin: "-30% 0px -50% 0px" },
    );
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);
  return (
    <nav aria-label={label} className="sticky top-[calc(var(--header-h)+24px)]">
      <p className="eyebrow">{label}</p>
      <ol className="mt-4 border-t border-line">
        {legend.map((l, i) => (
          <li key={l.label} className={`flex items-baseline justify-between gap-4 border-b border-line py-2 text-[0.95rem] ${i === active ? "font-semibold text-ink" : "text-ink-2"}`}>
            <span>{l.label}</span>
            <span className="text-right text-[0.9rem] font-normal text-ink-2">{l.detail}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
