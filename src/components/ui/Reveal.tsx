"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Fades and lifts children into place once, when they enter the viewport.
 * Children with [data-reveal-item] stagger. Content is visible without JS and
 * for reduced-motion visitors (the hidden state is only applied once JS runs).
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  stagger = 80,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = el.querySelectorAll<HTMLElement>("[data-reveal-item]");
    const targets = items.length ? Array.from(items) : [el];
    targets.forEach((t, i) => {
      t.classList.add("reveal-pending");
      t.style.transitionDelay = `${i * stagger}ms`;
    });
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        targets.forEach((t) => t.classList.add("reveal-in"));
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stagger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
