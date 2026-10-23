"use client";

import { useEffect, useRef, useState } from "react";
import { opening } from "@/content/home";
import { OPENED_KEY } from "@/lib/opening";

/**
 * Chapter 0: "Opening 0%" while fonts and the page load, then a copper-edged
 * shutter rolls up to reveal the store. Once per session; skipped for reduced
 * motion (an inline head script adds html.opened before first paint). Without
 * JS a CSS animation removes it after a few seconds.
 */
export function Opening() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const pct = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.documentElement.classList.contains("opened")) {
      const raf = requestAnimationFrame(() => setGone(true));
      return () => cancelAnimationFrame(raf);
    }
    root.current?.classList.add("js");
    let shown = 0;
    let target = 10;
    let raf = 0;
    const t0 = performance.now();
    const loaded = new Promise<void>((r) =>
      document.readyState === "complete" ? r() : addEventListener("load", () => r(), { once: true }),
    );
    Promise.all([document.fonts?.ready, loaded]).then(() => (target = 100));
    const tick = () => {
      const elapsed = performance.now() - t0;
      // creep while waiting, never stall longer than 2.2 s
      if (target < 100) target = Math.min(92, 10 + elapsed / 22);
      if (elapsed > 2200) target = 100;
      shown += (target - shown) * 0.12 + 0.3;
      shown = Math.min(shown, target);
      if (pct.current) pct.current.textContent = String(Math.floor(shown));
      if (shown >= 99.5 && elapsed > 700) {
        if (pct.current) pct.current.textContent = "100";
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function finish() {
    try {
      sessionStorage.setItem(OPENED_KEY, "1");
    } catch {}
    setDone(true);
    setTimeout(() => setGone(true), 1100);
  }

  if (gone) return null;
  return (
    <div ref={root} className={`opening fixed inset-0 z-[70] ${done ? "is-done" : ""}`} aria-hidden={done || undefined}>
      <div className="opening-shutter absolute inset-0 flex flex-col bg-travertine">
        <div className="flex-1 bg-[repeating-linear-gradient(to_bottom,#e6ddcf_0_22px,#d6cab8_22px_24px)]" />
        <div className="h-2.5 bg-copper" />
        <div className="h-5 bg-[#b9ada0]" />
      </div>
      <div className="opening-count absolute inset-0 flex items-center justify-center">
        <p className="display text-[clamp(2.4rem,6vw,4.5rem)]" role="status">
          {opening.label}{" "}
          <span ref={pct} className="tabular-nums">
            0
          </span>
          <em>%</em>
        </p>
      </div>
      <button
        type="button"
        onClick={finish}
        className="absolute right-[var(--gutter)] bottom-8 z-10 h-11 rounded-full px-4 text-sm text-ink-soft hover:text-ink"
      >
        {opening.skip}
      </button>
    </div>
  );
}
