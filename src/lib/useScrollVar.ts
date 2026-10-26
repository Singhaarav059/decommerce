"use client";

import { useEffect, type RefObject } from "react";

/**
 * Writes a tall section's scroll progress (0 when its top meets the top of the screen, 1 when
 * its bottom meets the bottom) into a CSS variable on it, every frame it changes. CSS does the
 * rest, so scrubbed motion costs no React renders.
 */
export function useScrollVar(ref: RefObject<HTMLElement | null>, name = "--c") {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const len = r.height - innerHeight;
      const p = len > 0 ? Math.min(1, Math.max(0, -r.top / len)) : 0;
      el.style.setProperty(name, p.toFixed(4));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [ref, name]);
}
