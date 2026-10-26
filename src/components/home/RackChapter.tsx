"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { Headline } from "@/components/ui/Headline";
import { storefront } from "@/content/home";
import { Rack } from "./Rack";

/**
 * The storefront chapter: the boutique wall as background, a huge word on it, and the clothing
 * rack hung in front of the word. On wide
 * screens the section holds still while you scroll and the scroll moves the rail along, hangers
 * swinging as it goes (drag and the arrow keys still work). On phones it is a normal section
 * and the rail is dragged.
 */
export function RackChapter() {
  const section = useRef<HTMLElement>(null);
  const scrub = useRef<number | null>(null);
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const wide = matchMedia("(min-width: 768px)");
    let raf = 0;
    const update = () => {
      if (!wide.matches) {
        scrub.current = null;
        return;
      }
      const r = el.getBoundingClientRect();
      const len = r.height - innerHeight;
      const p = len > 0 ? Math.min(1, Math.max(0, -r.top / len)) : 0;
      // a short hold at each end so the first and last pieces are seen
      const k = Math.min(1, Math.max(0, (p - 0.06) / 0.88));
      scrub.current = k;
      if (bar.current) bar.current.style.transform = `scaleX(${k.toFixed(3)})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    wide.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      wide.removeEventListener("change", update);
    };
  }, []);

  return (
    <section ref={section} id="ch-storefront" className="tone-light relative md:h-[280svh]" style={{ background: "#ceb9a4", "--floor": "#ceb9a4" } as CSSProperties}>
      <div className="relative overflow-hidden md:sticky md:top-0 md:h-[100svh]">
        <div className="absolute inset-x-0 top-0 h-[64svh] md:inset-0 md:h-auto">
          <Image src="/assets/rack/wall.webp" alt="" fill sizes="100vw" quality={85} className="object-cover" />
          <div aria-hidden className="scrim absolute inset-0 hidden md:block" />
        </div>
        {/* the word sits between the wall and the rail: the garments swing in front of it */}
        <p aria-hidden className="rack-word display pointer-events-none absolute top-[21svh] right-[-0.04em] left-0 text-right text-[25vw] leading-[0.8] tracking-[-0.06em] text-ink/90 select-none md:top-1/2 md:left-auto md:-translate-y-[38%] md:text-[15.5vw]">
          {storefront.backdrop}
        </p>
        <div className="relative z-[1] mx-auto grid min-h-[100svh] max-w-[var(--max-w)] grid-cols-1 content-center gap-8 px-[var(--gutter)] pt-[calc(var(--header-h)+24px)] pb-16 md:h-full md:min-h-0 md:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] md:items-center md:gap-10 [--ink-2:var(--ink)]">
          <div className="order-2 md:order-1">
            <Headline as="h2" reveal text={storefront.headline} className="t-h2" />
            <p className="t-lead mt-5 max-w-[40ch] text-ink-2">{storefront.body}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {storefront.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-u font-semibold text-copper">
                    {l.label} →
                  </Link>
                </li>
              ))}
            </ul>
            {/* how far along the rail the scroll has moved */}
            <div aria-hidden className="mt-8 hidden max-w-[280px] md:block">
              <p className="text-[0.875rem] text-ink-2">Scroll to move the rail</p>
              <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-ink/10">
                <span ref={bar} className="block h-full origin-left rounded-full bg-copper" style={{ transform: "scaleX(0)" }} />
              </div>
            </div>
          </div>
          <div className="order-1 -mr-[var(--gutter)] md:order-2">
            <Rack scrub={scrub} />
          </div>
        </div>
      </div>
    </section>
  );
}
