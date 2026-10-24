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
        const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
        lenis.on("scroll", ScrollTrigger.update);
        // in-page links glide to their target instead of jumping (the header's height is left clear)
        const onClick = (e: MouseEvent) => {
          const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
          const id = a?.getAttribute("href")?.slice(1);
          const target = id ? document.getElementById(id) : null;
          if (!target || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
          e.preventDefault();
          lenis.scrollTo(target, { offset: 0, duration: 1.4 });
          history.pushState(null, "", `#${id}`);
        };
        document.addEventListener("click", onClick);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        const prev = cleanup;
        cleanup = () => {
          prev();
          gsap.ticker.remove(tick);
          document.removeEventListener("click", onClick);
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
