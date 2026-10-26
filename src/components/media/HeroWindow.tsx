"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { frameUrl, wantsStill } from "@/lib/media";
import { ScrollSequence } from "./ScrollSequence";
import type { FilmSeq } from "./PinnedFilm";

/**
 * The opening of a page: a giant headline over the night floor, and under it a rounded window
 * onto the store film. Scrolling widens the window until the film fills the screen (it scrubs
 * as it opens); then `overlay` (floating product cards) takes the stage. Reduced motion and
 * save-data visitors get the headline over the finished frame, no pinning.
 */
export function HeroWindow({
  seq,
  alt,
  eyebrow,
  headline,
  body,
  actions,
  overlay,
  caption,
  length = 2.4,
  priority = false,
  id,
}: {
  seq: FilmSeq;
  alt: string;
  eyebrow: string;
  headline: string;
  body: string;
  actions?: ReactNode;
  overlay?: ReactNode;
  /** A short line shown on the film once the window is fully open. */
  caption?: ReactNode;
  length?: number;
  priority?: boolean;
  id?: string;
}) {
  const head = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [still, setStill] = useState(false);
  useEffect(() => {
    if (!wantsStill()) return;
    const raf = requestAnimationFrame(() => setStill(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  // the window starts just under the headline block, whatever height it wraps to
  useEffect(() => {
    const h = head.current, w = wrap.current;
    if (!h || !w) return;
    const fit = () => w.style.setProperty("--hw-top", `${Math.round(h.getBoundingClientRect().bottom + 20)}px`);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(h);
    addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      removeEventListener("resize", fit);
    };
  }, [still]);

  const words = headline.split(" ");
  const top = (
    <div ref={head} className="hero-head relative z-[2] mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-[calc(var(--header-h)+clamp(12px,3vh,40px))]">
      <p className="eyebrow intro">{eyebrow}</p>
      <h1 className="display hero-title mt-4 max-w-[16ch] text-[min(7.4vw,12.5vh)] leading-[0.92] tracking-[-0.045em] max-md:text-[clamp(2.6rem,11vw,4rem)]" aria-label={headline}>
        {words.map((w, i) => (
          <span key={i} aria-hidden className="inline-block overflow-clip pb-[0.06em] align-top">
            <span className="hero-word inline-block" style={{ animationDelay: `${120 + i * 70}ms` }}>
              {w}
              {i < words.length - 1 ? "\u00a0" : ""}
            </span>
          </span>
        ))}
      </h1>
    </div>
  );
  // the pitch rests on the film in a panel, so the window can start right under the headline
  const panel = (
    <div className="intro relative z-[2] max-w-[460px] rounded-[var(--radius-lg)] bg-paper/95 p-5 shadow-[var(--shadow-md)] ring-1 ring-white/10 md:p-6">
      <p className="text-[1rem] leading-relaxed text-ink-2 md:text-[1.1rem]">{body}</p>
      {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
    </div>
  );

  if (still)
    return (
      <section id={id} aria-label={alt} className="relative">
        {top}
        <div className="mx-auto mt-6 max-w-[var(--max-w)] px-[var(--gutter)]">{panel}</div>
        <div className="mx-auto mt-8 max-w-[var(--max-w)] px-[var(--gutter)] pb-16">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-xl)]">
            <Image src={frameUrl(seq.pattern, seq.count - 1)} alt="" fill priority={priority} sizes="100vw" className="object-cover" />
          </div>
        </div>
      </section>
    );

  return (
    <div ref={wrap} id={id} className="relative" style={{ "--hw-top": "48vh" } as CSSProperties}>
      <ScrollSequence {...seq} length={length} stillFrame={0} priority={priority} defer alt={alt} bg="var(--studio)" frameClassName="hero-window absolute inset-0">
        {top}
        <div className="hero-panel absolute bottom-[calc(clamp(16px,4vh,40px)+16px)] left-[calc(var(--gutter)+16px)] right-[calc(var(--gutter)+16px)] z-[2] md:right-auto">{panel}</div>
        {overlay}
        {caption && <div className="hero-caption pointer-events-none absolute bottom-[clamp(16px,4vh,40px)] left-[var(--gutter)] z-[2]">{caption}</div>}
      </ScrollSequence>
    </div>
  );
}
