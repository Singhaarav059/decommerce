"use client";

import { useEffect, useRef } from "react";

/**
 * Second Ride-style counter that rolls up from 0 when it enters the viewport.
 * The final value is server-rendered, so no-JS, reduced-motion and screen-reader
 * visitors always get the real number; the roll-up writes to the DOM directly.
 */
export function StatCounter({
  value,
  suffix = "",
  prefix = "",
  label,
  duration = 1600,
  className = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const out = num.current;
    if (!el || !out || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only roll up if the counter starts below the fold.
    if (el.getBoundingClientRect().top < innerHeight * 0.9) return;
    out.textContent = "0";
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - t0) / duration);
          // fast start, long settle: counters feel like they have weight
          const eased = t < 1 ? 1 - Math.pow(2, -10 * t) : 1;
          out.textContent = String(Math.round(value * eased));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <div ref={ref} className={className}>
      <p className="display text-[clamp(3.5rem,9vw,6.5rem)] tabular-nums" aria-hidden>
        {prefix}
        <span ref={num}>{value}</span>
        <span className="text-copper">{suffix}</span>
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        <span className="sr-only">
          {prefix}
          {value}
          {suffix}{" "}
        </span>
        {label}
      </p>
    </div>
  );
}
