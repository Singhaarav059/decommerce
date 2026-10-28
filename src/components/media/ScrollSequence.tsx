"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { frameUrl, progressiveOrder, wantsStill } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

const CENTRE: [number, number] = [50, 50];
// share of the scroll each keyframe holds still, so the scene rests on a sharp picture between actions
const HOLD = 0.1;

/** Scroll position (0 to 1) to frame index, holding on each keyframe and playing the footage between them. */
function keyed(p: number, keys: number[]) {
  const runs = keys.slice(1).map((k, i) => k - keys[i]);
  const span = runs.reduce((a, b) => a + b, 0) || 1;
  const play = 1 - HOLD * keys.length;
  let t = 0;
  for (let j = 0; j < keys.length; j++) {
    t += HOLD;
    if (p <= t || j === keys.length - 1) return keys[j];
    const len = (runs[j] / span) * play;
    if (p <= t + len) return keys[j] + ((p - t) / len) * runs[j];
    t += len;
  }
  return keys[keys.length - 1];
}
const FULL: [number, number] = [0, 1];

export type Caption = { at: [number, number]; eyebrow?: string; text: string };

type Listener = (p: number) => void;
const ProgressContext = createContext<{ subscribe: (l: Listener) => () => void } | null>(null);

/** Subscribe a client child to the sequence's 0 to 1 scroll progress (no re-renders). */
export function useSequenceProgress(listener: Listener) {
  const ctx = useContext(ProgressContext);
  const ref = useRef(listener);
  useEffect(() => {
    ref.current = listener;
  });
  useEffect(() => ctx?.subscribe((p) => ref.current(p)), [ctx]);
}

/**
 * Layer 3 of the plan: a rendered film scrubbed by scroll. Frames are drawn to
 * a 2D canvas (never a second WebGL context) inside a sticky viewport; the
 * section is `length` viewports tall. Frames load progressively so any scroll
 * position shows a nearby frame quickly. Still visitors get one key frame and
 * the captions as normal text.
 */
export function ScrollSequence({
  pattern,
  mobilePattern,
  count,
  pad = 3,
  length = 3,
  stillFrame,
  alt,
  captions = [],
  className = "",
  frameClassName = "absolute inset-0",
  stillFrameClassName = "",
  bg,
  priority = false,
  defer = false,
  blend = false,
  focus = CENTRE,
  push = 0,
  span = FULL,
  keys,
  children,
}: {
  /** e.g. "/assets/seq/delivery/{i}.webp" */
  pattern: string;
  mobilePattern?: string;
  count: number;
  pad?: number;
  /** Scroll length in viewport heights. */
  length?: number;
  /** Frame shown to reduced-motion / save-data visitors and before JS. */
  stillFrame?: number;
  alt: string;
  captions?: Caption[];
  className?: string;
  /** Where the film sits inside the sticky viewport (default: full bleed). Use breakpoint classes for a phone layout. */
  frameClassName?: string;
  /** Optional positioning for the reduced-motion still. */
  stillFrameClassName?: string;
  /** Viewport colour around the film (match the footage's backdrop). */
  bg?: string;
  /** The still frame is the page's LCP image: fetch it first. */
  priority?: boolean;
  /** Stream the other frames only after the page has loaded and gone idle. */
  defer?: boolean;
  /** The frames are a few keyframes, not footage: hold each one and dissolve into the next between them. */
  blend?: boolean;
  /** The point of the picture to keep in view when it is cropped, in percent [x, y] (desktop frames only). */
  focus?: [number, number];
  /** A slow push in over the whole scroll: 0.04 ends 4% closer. */
  push?: number;
  /** The part of the scroll the frames play over, e.g. [0.4, 0.95]: before it the first frame holds, after it the last. */
  span?: [number, number];
  /** Footage built around sharp keyframes (scripts/v7): the frame indices of those keyframes. Each one holds
   * for a stretch of the scroll, and the footage between them plays in proportion to its length. */
  keys?: number[];
  children?: ReactNode;
}) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  // The pinned layout is what the server renders, so a hero never shifts on hydration.
  const [still, setStill] = useState(false);
  const [active, setActive] = useState<number[]>([]);
  const listeners = useRef(new Set<Listener>());
  const [ctxValue] = useState(() => ({
    subscribe: (l: Listener) => {
      listeners.current.add(l);
      return () => listeners.current.delete(l);
    },
  }));
  const key = stillFrame ?? Math.floor(count / 2);

  useEffect(() => {
    if (!wantsStill()) return;
    const raf = requestAnimationFrame(() => setStill(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (still) return;
    const el = section.current;
    const cv = canvas.current;
    const g = cv?.getContext("2d", { alpha: false });
    if (!el || !cv || !g) return;

    const phone = !!mobilePattern && innerWidth < 768;
    const src = phone ? mobilePattern : pattern;
    // phone frames are already cut around the subject
    const [fx, fy] = phone ? [0.5, focus[1] / 100] : [focus[0] / 100, focus[1] / 100];
    const frames: (HTMLImageElement | null)[] = Array(count).fill(null);
    let progress = 0;
    let drawn = "";
    let cancelled = false;

    const resize = () => {
      // never draw at more pixels than the footage has: past that, upscaling in the canvas
      // costs a lot per frame and adds no detail (the GPU stretches the canvas for free)
      const source = frames.find(Boolean)?.naturalWidth ?? (innerWidth < 768 ? 864 : 1920);
      const dpr = Math.max(1, Math.min(devicePixelRatio || 1, 2, (source * 1.15) / Math.max(1, cv.clientWidth)));
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      // resizing the canvas resets its context state: ask for the sharper resampler every time
      g.imageSmoothingEnabled = true;
      g.imageSmoothingQuality = "high";
      drawn = "";
      draw();
    };

    const nearestLoaded = (i: number) => {
      for (let d = 0; d < count; d++) {
        if (frames[i - d]) return i - d;
        if (frames[i + d]) return i + d;
      }
      return -1;
    };

    // cover-fit around the focus point, pushed in by `zoom`
    const paint = (img: HTMLImageElement, zoom: number) => {
      const s = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight) * zoom;
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      g.drawImage(img, (cv.width - w) * fx, (cv.height - h) * fy, w, h);
    };

    function draw() {
      if (!g || !cv) return;
      const f = Math.min(1, Math.max(0, (progress - span[0]) / (span[1] - span[0])));
      const x = keys ? keyed(f, keys) : f * (count - 1);
      let i: number;
      let t = 0;
      if (blend) {
        // hold each keyframe for most of its stretch, then dissolve into the next over the middle 30%
        i = nearestLoaded(Math.min(count - 1, Math.floor(x)));
        const f = Math.min(1, Math.max(0, (x - Math.floor(x) - 0.35) / 0.3));
        if (frames[Math.floor(x) + 1]) t = f * f * (3 - 2 * f);
      } else i = nearestLoaded(Math.min(count - 1, Math.round(x)));
      if (i < 0) return;
      const zoom = 1 + push * progress;
      const key = `${i}|${t.toFixed(3)}|${zoom.toFixed(4)}`;
      if (key === drawn) return;
      g.globalAlpha = 1;
      paint(frames[i]!, zoom);
      if (t > 0) {
        g.globalAlpha = t;
        paint(frames[Math.floor(x) + 1]!, zoom);
        g.globalAlpha = 1;
      }
      drawn = key;
      // the canvas stays invisible over the still image until it has a real frame
      cv.style.opacity = "1";
    }

    // Progressive loading, a few at a time.
    const queue = progressiveOrder(count);
    let inFlight = 0;
    const pump = () => {
      while (!cancelled && inFlight < 4 && queue.length) {
        const i = queue.shift()!;
        const img = new Image();
        img.decoding = "async";
        inFlight++;
        img.onload = img.onerror = () => {
          inFlight--;
          const first = !frames.some(Boolean);
          if (img.naturalWidth) frames[i] = img;
          if (first && img.naturalWidth) resize();
          if (!cancelled) {
            draw();
            pump();
          }
        };
        img.src = frameUrl(src, i, pad);
      }
    };

    // Start fetching when the section is within a viewport (after load + idle when deferred).
    let idle = 0;
    const start = () => {
      if (!defer) return pump();
      const go = () => {
        const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
        idle = ric(pump, { timeout: 2500 });
      };
      if (document.readyState === "complete") go();
      else addEventListener("load", go, { once: true });
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress = self.progress;
        listeners.current.forEach((l) => l(progress));
        draw();
        const next = captions.flatMap((c, i) => (progress >= c.at[0] && progress <= c.at[1] ? [i] : []));
        setActive((prev) => (prev.length === next.length && prev.every((v, k) => v === next[k]) ? prev : next));
      },
    });

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    return () => {
      cancelled = true;
      (window.cancelIdleCallback ?? window.clearTimeout)(idle);
      st.kill();
      io.disconnect();
      ro.disconnect();
    };
  }, [still, pattern, mobilePattern, count, pad, captions, defer, blend, push, focus, span, keys]);

  const keyImg = (
    <picture>
      {mobilePattern && <source media="(max-width: 767px)" srcSet={frameUrl(mobilePattern, key, pad)} />}
      <img
        src={frameUrl(pattern, key, pad)}
        alt=""
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition: `${focus[0]}% ${focus[1]}%` }}
      />
    </picture>
  );

  if (still) {
    return (
      <section className={`relative ${className}`} aria-label={alt}>
        <div className={`relative aspect-[16/10] w-full overflow-hidden md:aspect-[16/8] ${stillFrameClassName}`}>{keyImg}</div>
        {captions.length > 0 && (
          <ol className="mx-auto grid max-w-[var(--max-w)] gap-6 px-[var(--gutter)] py-10 md:grid-cols-3">
            {captions.map((c) => (
              <li key={c.text}>
                {c.eyebrow && <p className="mb-2 text-[0.875rem] font-semibold">{c.eyebrow}</p>}
                <p className="text-lg">{c.text}</p>
              </li>
            ))}
          </ol>
        )}
        {children}
      </section>
    );
  }

  return (
    <ProgressContext.Provider value={ctxValue}>
      <section ref={section} className={`relative ${className}`} style={{ height: `${length * 100}svh` }} aria-label={alt}>
        <div data-stage className="sticky top-0 h-[100svh] overflow-hidden" style={{ background: bg ?? "var(--studio)" }}>
          <div className={`overflow-hidden ${frameClassName}`}>
            {keyImg}
            <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full opacity-0" />
          </div>
          {captions.map((c, i) => (
            <div
              key={c.text}
              aria-hidden={!active.includes(i)}
              className={`absolute inset-x-0 bottom-[12svh] mx-auto max-w-[var(--max-w)] px-[var(--gutter)] transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${
                active.includes(i) ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              <div className="inline-block max-w-md rounded-[var(--radius-md)] bg-stone-50 p-5">
                {c.eyebrow && <p className="mb-2 text-[0.875rem] font-semibold">{c.eyebrow}</p>}
                <p className="text-lg leading-snug">{c.text}</p>
              </div>
            </div>
          ))}
          {children}
        </div>
      </section>
    </ProgressContext.Provider>
  );
}
