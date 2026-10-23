"use client";

import { useEffect, useRef } from "react";
import { DemoForm } from "@/components/forms/DemoForm";
import { Headline } from "@/components/ui/Headline";
import { close } from "@/content/home";
import { brand } from "@/content/site";

/**
 * Chapter 10: the store lights warm, the shutter rolls halfway down and the
 * wordmark settles on the travertine floor, above the demo form.
 */
export function CloseChapter() {
  const shutter = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current;
    const sh = shutter.current;
    if (!el || !sh || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.9)));
      sh.style.transform = `translateY(${(-100 + p * 50).toFixed(2)}%)`;
      el.style.setProperty("--warm", p.toFixed(3));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="ch-close" ref={section} className="relative z-10 overflow-hidden" style={{ "--warm": 1 } as React.CSSProperties}>
      {/* storefront band: warm light + shutter rolling halfway down */}
      <div className="relative h-[44svh] min-h-[280px] overflow-hidden bg-ink">
        <div className="absolute inset-0 bg-[#3a2516] opacity-[calc(var(--warm)*0.9)] transition-opacity" />
        <div className="absolute inset-x-[8%] bottom-0 h-[78%] bg-[#e9c9a4] opacity-[calc(0.25+var(--warm)*0.55)]" />
        <div ref={shutter} className="absolute inset-x-[8%] top-0 h-full" style={{ transform: "translateY(-50%)" }}>
          <div className="h-full bg-[repeating-linear-gradient(to_bottom,var(--steel)_0_14px,#8c9294_14px_16px)]" />
          <div className="h-2 bg-copper" />
        </div>
        <div className="absolute inset-x-0 top-0 h-[8%] bg-travertine" />
      </div>
      {/* travertine floor with the wordmark */}
      <div className="terrazzo relative">
        <p
          aria-hidden
          className="pointer-events-none mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-6 text-center font-serif text-[clamp(4.5rem,19vw,17rem)] leading-[0.8] tracking-[-0.05em] text-ink/90 select-none"
        >
          {brand.name}
          <span className="text-copper">.</span>
        </p>
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-10 px-[var(--gutter)] py-16 md:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:pl-[calc(var(--gutter)+150px)]">
          <div>
            <p className="eyebrow">{close.eyebrow}</p>
            <Headline as="h2" text={close.headline} className="mt-3 text-[clamp(2.6rem,6vw,5rem)]" />
            <p className="mt-4 max-w-[42ch] text-lg text-ink-soft">{close.body}</p>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-stone-50 p-6 md:p-8">
            <DemoForm />
          </div>
        </div>
      </div>
    </section>
  );
}
