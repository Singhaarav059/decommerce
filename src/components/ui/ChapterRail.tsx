"use client";

import { useEffect, useState } from "react";

export type Chapter = { id: string; label: string };

/**
 * Morpho-style chapter index pinned to the left edge (01/10 + rail).
 * On small screens it collapses to a thin progress bar under the header.
 * Each chapter is a section in the page with a matching id.
 */
export function ChapterRail({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLElement));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        setProgress(max > 0 ? Math.min(1, scrollY / max) : 0);
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
    };
  }, [chapters]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      {/* Mobile: thin progress bar */}
      <div aria-hidden className="fixed inset-x-0 top-[var(--header-h)] z-[45] h-0.5 bg-line lg:hidden">
        <div className="h-full origin-left bg-copper" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* Desktop: chapter index */}
      <nav aria-label="Chapters" className="fixed top-1/2 left-[calc(var(--gutter)-12px)] z-[45] hidden -translate-y-1/2 rounded-[var(--radius-md)] bg-stone-50 px-3 py-3 lg:block">
        <p className="eyebrow mb-4 tabular-nums" aria-live="polite">
          <span className="text-ink">{pad(active + 1)}</span> / {pad(chapters.length)}
        </p>
        <ol className="relative space-y-2.5 border-l border-line pl-4">
          <span
            aria-hidden
            className="absolute top-0 -left-px w-px origin-top bg-copper"
            style={{ height: "100%", transform: `scaleY(${progress})` }}
          />
          {chapters.map((c, i) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={i === active ? "step" : undefined}
                className={`group flex items-center gap-2 text-[0.78rem] transition-colors duration-300 ${
                  i === active ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                <span className="font-mono tabular-nums">{pad(i + 1)}</span>
                <span
                  className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-500 ease-[var(--ease-out)] ${
                    i === active ? "max-w-40 opacity-100" : "max-w-0 opacity-0 group-hover:max-w-40 group-hover:opacity-100"
                  }`}
                >
                  {c.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
