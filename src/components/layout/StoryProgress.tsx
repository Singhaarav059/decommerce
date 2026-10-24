"use client";

import { useEffect, useRef } from "react";

/** A thin copper line under the header showing how far through the homepage story you are. */
export function StoryProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
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
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-[calc(var(--header-h)-2px)] z-[55] h-[2px]">
      <div ref={bar} className="h-full origin-left bg-copper" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
