"use client";

import { scrollToTop } from "@/lib/scroll";

/** Returns to the top of the page; smooth unless the visitor prefers reduced motion. */
export function BackToTop() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="group inline-flex items-center gap-2 rounded-full py-1 pr-1 pl-3 text-ink shadow-[inset_0_0_0_1px_rgb(235_230_224/0.2)] transition-colors hover:text-ink"
    >
      Back to top
      <span aria-hidden className="flex size-7 items-center justify-center rounded-full bg-ink/10 transition-[background-color,translate] duration-300 group-hover:-translate-y-0.5 group-hover:bg-copper group-hover:text-night">
        ↑
      </span>
    </button>
  );
}
