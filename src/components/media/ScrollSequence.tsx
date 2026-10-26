"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { frameUrl, progressiveOrder, wantsStill } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

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
  bg,
  priority = false,
  defer = false,
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
  /** Viewport colour around the film (match the footage's backdrop). */
  bg?: string;
  /** The still frame is the page's LCP image: fetch it first. */
  priority?: boolean;
  /** Stream the other frames only after the page has loaded and gone idle. */
  defer?: boolean;
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

    const src = mobilePattern && innerWidth < 768 ? mobilePattern : pattern;
    const frames: (HTMLImageElement | null)[] = Array(count).fill(null);
    let progress = 0;
    let drawn = -1;
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
      drawn = -1;
      draw();
    };

    const nearestLoaded = (i: number) => {
      for (let d = 0; d < count; d++) {
        if (frames[i - d]) return i - d;
        if (frames[i + d]) return i + d;
      }
      return -1;
    };

    function draw() {
      const want = Math.min(count - 1, Math.round(progress * (count - 1)));
      const i = nearestLoaded(want);
      if (i < 0 || i === drawn || !g || !cv) return;
      const img = frames[i]!;
      // cover-fit
      const s = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      g.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
      drawn = i;
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
  }, [still, pattern, mobilePattern, count, pad, captions, defer]);

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
      />
    </picture>
  );

  if (still) {
    return (
      <section className={`relative ${className}`} aria-label={alt}>
        <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[16/8]">{keyImg}</div>
        {captions.length > 0 && (
          <ol className="mx-auto grid max-w-[var(--max-w)] gap-6 px-[var(--gutter)] py-10 md:grid-cols-3">
            {captions.map((c) => (
              <li key={c.text}>
                {c.eyebrow && <p className="eyebrow mb-2">{c.eyebrow}</p>}
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
                {c.eyebrow && <p className="eyebrow mb-2">{c.eyebrow}</p>}
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
