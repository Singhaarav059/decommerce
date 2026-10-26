"use client";

import { scrollToTop } from "@/lib/scroll";

/** Returns to the top of the page; smooth unless the visitor prefers reduced motion. */
export function BackToTop() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="group inline-flex items-center gap-2 text-ink transition-colors hover:text-copper"
    >
      Back to top
      <span aria-hidden className="tag tag-xs tag-plain flex size-8 items-center justify-center bg-ink/10 [--cut:6px] transition-[background-color,color,translate] duration-300 group-hover:-translate-y-0.5 group-hover:bg-copper group-hover:text-paper">
        ↑
      </span>
    </button>
  );
}
