"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger and Lenis
 * share one clock, plus ScrollTrigger re-measuring whenever the page height
 * changes (pinned sections grow after mount). Both libraries load after the
 * page is idle so they never delay first paint. Lenis is skipped for
 * reduced-motion visitors and touch devices, which keep native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const id = ric(
      async () => {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        let t = 0;
        let last = 0;
        const ro = new ResizeObserver(() => {
          const h = document.documentElement.scrollHeight;
          if (h === last) return;
          last = h;
          clearTimeout(t);
          t = window.setTimeout(() => ScrollTrigger.refresh(), 120);
        });
        ro.observe(document.body);
        cleanup = () => {
          ro.disconnect();
          clearTimeout(t);
        };

        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const coarse = matchMedia("(pointer: coarse)").matches;
        if (reduce || coarse) return;
        const { default: Lenis } = await import("lenis");
        if (cancelled) return;
        const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        const prev = cleanup;
        cleanup = () => {
          prev();
          gsap.ticker.remove(tick);
          lenis.destroy();
        };
      },
      { timeout: 2000 },
    );
    return () => {
      cancelled = true;
      (window.cancelIdleCallback ?? window.clearTimeout)(id);
      cleanup();
    };
  }, []);

  return null;
}
