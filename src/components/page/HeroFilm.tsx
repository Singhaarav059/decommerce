"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The page's scene comes to life once: a short film pinned to the still under it (it starts on that
 * exact frame) plays when the window scrolls into view, then rests on its last frame. It is only
 * fetched then, so it never competes with the page's first paint. Reduced motion and save-data: the still.
 */
export function HeroFilm({ src, className = "" }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        v.src = src;
        v.play()
          .then(() => setOn(true))
          .catch(() => {});
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);
  return <video ref={ref} muted playsInline preload="none" aria-hidden className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"} ${className}`} />;
}
