"use client";

import { useEffect, useId, useRef, useState } from "react";
import { frameUrl, progressiveOrder, wantsStill } from "@/lib/media";

/**
 * A short film you scrub by dragging across it (or with the slider under it,
 * which is also the keyboard and screen-reader control). Frames [from, to] of
 * a frame sequence, drawn to a 2D canvas over the first frame's <img>.
 */
export function DragFilm({
  pattern,
  mobilePattern,
  from,
  to,
  label,
  alt,
  priority = false,
  className = "",
}: {
  pattern: string;
  mobilePattern?: string;
  from: number;
  to: number;
  label: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [value, setValue] = useState(0);
  const api = useRef<{ draw: (v: number) => void } | null>(null);
  const count = to - from + 1;

  useEffect(() => {
    const cv = canvas.current;
    const g = cv?.getContext("2d", { alpha: false });
    if (!cv || !g || wantsStill()) return;
    const src = mobilePattern && innerWidth < 768 ? mobilePattern : pattern;
    const frames: (HTMLImageElement | null)[] = Array(count).fill(null);
    let drawn = -1;
    let want = 0;
    let cancelled = false;
    const nearest = (i: number) => {
      for (let d = 0; d < count; d++) {
        if (frames[i - d]) return i - d;
        if (frames[i + d]) return i + d;
      }
      return -1;
    };
    const draw = (v: number) => {
      want = Math.round(v * (count - 1));
      const i = nearest(want);
      if (i < 0 || i === drawn) return;
      const img = frames[i]!;
      const s = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
      g.drawImage(img, (cv.width - img.naturalWidth * s) / 2, (cv.height - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
      drawn = i;
      cv.style.opacity = "1";
    };
    api.current = { draw };
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      drawn = -1;
      draw(want / Math.max(1, count - 1));
    };
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
          if (img.naturalWidth) frames[i] = img;
          if (!cancelled) {
            if (i === want || frames[want] == null) draw(want / Math.max(1, count - 1));
            pump();
          }
        };
        img.src = frameUrl(src, from + i);
      }
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        pump();
        io.disconnect();
      }
    }, { rootMargin: "50% 0px" });
    io.observe(cv);
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    return () => {
      cancelled = true;
      io.disconnect();
      ro.disconnect();
    };
  }, [pattern, mobilePattern, from, count]);

  useEffect(() => {
    api.current?.draw(value);
  }, [value]);

  // horizontal drag across the film scrubs it; vertical page scrolling stays native
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let start: { x: number; v: number; id: number } | null = null;
    let current = 0;
    const down = (e: PointerEvent) => {
      start = { x: e.clientX, v: current, id: e.pointerId };
    };
    const move = (e: PointerEvent) => {
      if (!start || start.id !== e.pointerId) return;
      const dx = e.clientX - start.x;
      if (Math.abs(dx) > 4) el.setPointerCapture(e.pointerId);
      current = Math.min(1, Math.max(0, start.v + dx / el.clientWidth));
      setValue(current);
    };
    const up = () => (start = null);
    const sync = (e: Event) => (current = Number((e as CustomEvent<number>).detail));
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("dragfilm:value", sync);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("dragfilm:value", sync);
    };
  }, []);

  return (
    <figure className={className}>
      <div ref={box} role="img" aria-label={alt} className="feather relative aspect-[4/3] cursor-ew-resize touch-pan-y select-none md:aspect-video">
        <picture>
          {mobilePattern && <source media="(max-width: 767px)" srcSet={frameUrl(mobilePattern, from)} />}
          <img src={frameUrl(pattern, from)} alt="" fetchPriority={priority ? "high" : undefined} loading={priority ? "eager" : "lazy"} decoding="async" className="absolute inset-0 size-full object-cover" />
        </picture>
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full opacity-0" />
      </div>
      <figcaption className="mx-auto mt-3 flex max-w-md items-center gap-4 px-[var(--gutter)] md:px-0">
        <label htmlFor={`${id}-r`} className="shrink-0 text-[0.9rem] font-semibold text-ink-2">
          {label}
        </label>
        <input
          id={`${id}-r`}
          type="range"
          min={0}
          max={1000}
          value={Math.round(value * 1000)}
          onChange={(e) => {
            const v = Number(e.target.value) / 1000;
            setValue(v);
            box.current?.dispatchEvent(new CustomEvent("dragfilm:value", { detail: v }));
          }}
          className="range w-full"
        />
      </figcaption>
    </figure>
  );
}
