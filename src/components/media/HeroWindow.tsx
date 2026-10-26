"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { frameUrl, wantsStill } from "@/lib/media";
import { ScrollSequence, useSequenceProgress } from "./ScrollSequence";
import { InlinePhotos, type HeadlineMedia } from "@/components/ui/InlinePhotos";
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
  headline,
  body,
  actions,
  overlay,
  caption,
  length = 2.4,
  priority = false,
  id,
  media,
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
  /** Small photos inside the headline, after the given word. */
  media?: HeadlineMedia;
}) {
  const head = useRef<HTMLDivElement>(null);
  const [still, setStill] = useState(false);
  useEffect(() => {
    if (!wantsStill()) return;
    const raf = requestAnimationFrame(() => setStill(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  const words = headline.split(" ");
  const top = (
    <div ref={head} className="hero-top relative z-[2] bg-studio pb-5 will-change-transform">
      <div className="hero-text mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-[calc(var(--header-h)+clamp(12px,3vh,40px))]">
      <h1 className="display hero-title max-w-[16ch] text-[min(7.4vw,12.5vh)] leading-[0.92] tracking-[-0.045em] max-md:text-[clamp(2.6rem,11vw,4rem)]" aria-label={headline}>
        {words.map((w, i) => (
          <span key={i} aria-hidden className="inline-block overflow-clip pb-[0.06em] align-top">
            <span className="hero-word inline-block" style={{ animationDelay: `${120 + i * 70}ms` }}>
              {w}
              {i < words.length - 1 ? "\u00a0" : ""}
            </span>
          </span>
        )).flatMap((el, i) => (media && media.after === i ? [el, <InlinePhotos key="media" srcs={media.srcs} delay={200 + i * 70} />] : [el]))}
      </h1>
      </div>
      {/* the window's two upper corners hang from the bottom of this edge */}
      <span aria-hidden className="hero-corner tl absolute top-full left-[var(--side)]" />
      <span aria-hidden className="hero-corner tr absolute top-full right-[var(--side)]" />
    </div>
  );
  // the pitch rests on the film in a panel, so the window can start right under the headline
  const panel = (
    <div className="relative z-[2] max-w-[460px] animate-[slide-up_900ms_var(--ease-out)_both] tag tag-sm tag-plain bg-paper p-5 md:p-7">
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
          <div className="tag tag-xl relative aspect-[16/9] overflow-hidden">
            <Image src={frameUrl(seq.pattern, seq.count - 1)} alt="" fill priority={priority} sizes="100vw" className="object-cover" />
          </div>
        </div>
      </section>
    );

  return (
    <div id={id} className="relative">
      <ScrollSequence {...seq} length={length} stillFrame={0} priority={priority} defer alt={alt} bg="var(--studio)" frameClassName="absolute inset-0">
        <HeroStage headRef={head} top={top} panel={panel} overlay={overlay} caption={caption} />
      </ScrollSequence>
    </div>
  );
}

/**
 * Drives the opening with compositor-only moves and no measuring (so nothing shifts on load).
 * The film is full screen underneath. The headline block is the window's top edge; with a
 * bottom edge, two side edges and four rounded corners it frames the film as a window. As the
 * hero scrolls every edge slides out by its own size and the corners shrink away, until the
 * film fills the screen. The headline fades as it goes; the pitch lifts away; the caption arrives.
 */
function HeroStage({ headRef, top, panel, overlay, caption }: { headRef: React.RefObject<HTMLDivElement | null>; top: ReactNode; panel: ReactNode; overlay?: ReactNode; caption?: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);

  useSequenceProgress((p) => {
    const f = frame.current;
    const h = headRef.current;
    if (!f || !h) return;
    const q = Math.min(1, p * 2.2);
    const k = (1 - q).toFixed(3);
    const [bb, lb, rb, bl, br] = Array.from(f.children) as HTMLElement[];
    h.style.transform = `translate3d(0,${(-100 * q).toFixed(2)}%,0)`;
    bb.style.transform = `translate3d(0,${(100 * q).toFixed(2)}%,0)`;
    lb.style.transform = `translate3d(${(-100 * q).toFixed(2)}%,0,0)`;
    rb.style.transform = `translate3d(${(100 * q).toFixed(2)}%,0,0)`;
    // corners ride with their edge vertically and with the side edges outward
    const out = `calc(var(--side) * ${q.toFixed(3)})`;
    const [tl, tr] = Array.from(h.querySelectorAll<HTMLElement>(".hero-corner"));
    if (tl) tl.style.transform = `translate3d(calc(${out} * -1),0,0) scale(${k})`;
    if (tr) tr.style.transform = `translate3d(${out},0,0) scale(${k})`;
    bl.style.transform = `translate3d(calc(${out} * -1),${(100 * q).toFixed(2)}%,0) scale(${k})`;
    br.style.transform = `translate3d(${out},${(100 * q).toFixed(2)}%,0) scale(${k})`;
    const lift = Math.min(1, p * 3.2);
    const text = h.querySelector<HTMLElement>(".hero-text");
    if (text) text.style.opacity = String(1 - lift);
    const pl = panelRef.current;
    if (pl) {
      const k2 = Math.min(1, p * 3.4);
      pl.style.opacity = String(1 - k2);
      pl.style.transform = `translate3d(0,${(24 * k2).toFixed(1)}px,0)`;
      pl.style.pointerEvents = k2 > 0.6 ? "none" : "auto";
    }
    const c = capRef.current;
    if (c) {
      const k3 = Math.min(1, Math.max(0, (p - 0.55) * 6));
      c.style.opacity = String(k3);
      c.style.transform = `translate3d(0,${((1 - k3) * 16).toFixed(1)}px,0)`;
    }
  });

  return (
    <div className="hero-stage contents">
      {top}
      <div ref={frame} aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-x-0 bottom-0 h-[var(--hb)] bg-studio will-change-transform" />
        <div className="absolute inset-y-0 left-0 w-[var(--side)] bg-studio will-change-transform" />
        <div className="absolute inset-y-0 right-0 w-[var(--side)] bg-studio will-change-transform" />
        <span className="hero-corner bl absolute bottom-[var(--hb)] left-[var(--side)]" />
        <span className="hero-corner br absolute right-[var(--side)] bottom-[var(--hb)]" />
      </div>
      <div ref={panelRef} className="absolute bottom-[calc(var(--hb)+16px)] left-[calc(var(--side)+16px)] right-[calc(var(--side)+16px)] z-[2] will-change-transform md:right-auto">
        {panel}
      </div>
      {overlay}
      {caption && (
        <div ref={capRef} className="pointer-events-none absolute bottom-[var(--hb)] left-[var(--side)] z-[2] opacity-0 will-change-transform">
          {caption}
        </div>
      )}
    </div>
  );
}
