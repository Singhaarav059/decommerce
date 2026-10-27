"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { frameUrl, wantsStill } from "@/lib/media";
import { ScrollSequence, useSequenceProgress } from "./ScrollSequence";
import { InlinePhotos, type HeadlineMedia } from "@/components/ui/InlinePhotos";
import type { FilmSeq } from "./PinnedFilm";

// keyframes play once the window is nearly open, and the last one holds before the page moves on
const BEAT_SPAN: [number, number] = [0.38, 0.9];

/**
 * The opening of a page: a giant headline with the pitch beside it, and under them a window onto
 * the scene. Nothing sits on the picture: the window starts centred on the people, and scrolling
 * widens it until the scene fills the screen while its keyframes play. `rail` (the steps, ticking
 * off with the scene) rises into the window's bottom edge, never onto the picture's subject.
 * Reduced motion and save-data visitors get the headline, the pitch and the finished frame.
 */
export function HeroWindow({
  seq,
  alt,
  headline,
  body,
  actions,
  rail,
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
  /** The bottom edge once the window is open: the steps of the fix. */
  rail?: ReactNode;
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
  const pitch = (
    <div className="hero-pitch animate-[slide-up_900ms_var(--ease-out)_both] max-lg:mt-5 lg:pb-[0.35em]">
      <p className="max-w-[40ch] text-[1rem] leading-relaxed text-ink-2 md:text-[1.1rem]">{body}</p>
      {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
  const top = (
    <div ref={head} className="hero-top relative z-[2] bg-studio pb-5 will-change-transform md:pb-7">
      <div className="hero-text mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-[calc(var(--header-h)+clamp(12px,3vh,40px))] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:items-end lg:gap-14">
        <h1 className="display hero-title text-balance text-[min(5.6vw,10.5vh)] leading-[0.92] tracking-[-0.045em] max-lg:max-w-[16ch] max-lg:text-[clamp(2.6rem,9vw,4.4rem)]" aria-label={headline}>
          {words.map((w, i) => (
            <span key={i} aria-hidden className="inline-block overflow-clip pb-[0.06em] align-top">
              <span className="hero-word inline-block" style={{ animationDelay: `${120 + i * 70}ms` }}>
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            </span>
          )).flatMap((el, i) => (media && media.after === i ? [el, <InlinePhotos key="media" srcs={media.srcs} delay={200 + i * 70} />] : [el]))}
        </h1>
        {pitch}
      </div>
      {/* the window's two upper corners hang from the bottom of this edge */}
      <span aria-hidden className="hero-corner tl absolute top-full left-[var(--side)]" />
      <span aria-hidden className="hero-corner tr absolute top-full right-[var(--side)]" />
    </div>
  );

  if (still)
    return (
      <section id={id} aria-label={alt} className="relative">
        {top}
        <div className="mx-auto mt-4 max-w-[var(--max-w)] px-[var(--gutter)] pb-16">
          <div className="tag tag-xl relative aspect-[16/9] overflow-hidden">
            <Image
              src={frameUrl(seq.pattern, seq.count - 1)}
              alt=""
              fill
              priority={priority}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: seq.focus ? `${seq.focus[0]}% ${seq.focus[1]}%` : undefined }}
            />
          </div>
          {rail && <div className="mt-4">{rail}</div>}
        </div>
      </section>
    );

  return (
    <div id={id} className="relative">
      <ScrollSequence {...seq} span={seq.blend || seq.keys ? BEAT_SPAN : undefined} length={length} stillFrame={0} priority={priority} defer alt={alt} bg="var(--studio)" frameClassName="hero-film absolute inset-0 will-change-transform">
        <HeroStage headRef={head} top={top} rail={rail} />
      </ScrollSequence>
    </div>
  );
}

/**
 * Drives the opening with compositor-only moves. The scene is full screen underneath, lowered at
 * first so its middle (where the people are) sits in the middle of the window. The headline block
 * is the window's top edge; with a bottom edge, two side edges and the corners it frames the scene.
 * As the hero scrolls every edge slides out, the scene rises into place and fills the screen, and
 * the rail rises into the bottom edge.
 */
function HeroStage({ headRef, top, rail }: { headRef: React.RefObject<HTMLDivElement | null>; top: ReactNode; rail?: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useSequenceProgress((p) => {
    const f = frame.current;
    const h = headRef.current;
    if (!f || !h) return;
    const q = Math.min(1, p * 2.2);
    const k = (1 - q).toFixed(3);
    const [bb, lb, rb, bl, br] = Array.from(f.children) as HTMLElement[];
    // the scene starts lowered by --drop (set in CSS, so it is right before any script runs) and rises into place
    const film = f.closest("[data-stage]")?.querySelector<HTMLElement>(".hero-film");
    if (film) film.style.transform = `translate3d(0,calc(var(--drop) * ${k}),0)`;
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
    const text = h.querySelector<HTMLElement>(".hero-text");
    if (text) text.style.opacity = String(1 - Math.min(1, p * 3.2));
    const r = railRef.current;
    if (r) {
      const k3 = Math.min(1, Math.max(0, (p - 0.4) * 6));
      r.style.transform = `translate3d(0,${((1 - k3) * 100).toFixed(1)}%,0)`;
      r.style.visibility = k3 <= 0 ? "hidden" : "visible";
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
      {rail && (
        <div ref={railRef} className="absolute inset-x-0 bottom-0 z-[2] bg-studio will-change-transform" style={{ visibility: "hidden", transform: "translate3d(0,100%,0)" }}>
          {rail}
        </div>
      )}
    </div>
  );
}
