"use client";

import { useEffect, useRef, useState } from "react";
import { AskAi } from "./AskAi";

/**
 * Beside a page's questions: the question the "Ask an AI" buttons will send, typing itself into an
 * assistant's box when it scrolls into view, with the buttons under it. Shows exactly what leaves the
 * site. Reduced motion: the whole question at once.
 */
export function AskPreview({ prompt, className = "" }: { prompt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const raf = requestAnimationFrame(() => setN(prompt.length));
      return () => cancelAnimationFrame(raf);
    }
    let t = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      t = window.setInterval(() => setN((k) => (k >= prompt.length ? (clearInterval(t), k) : k + 2)), 28);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(t);
    };
  }, [prompt]);
  const done = n >= prompt.length;
  return (
    <div ref={ref} className={className}>
      <div className="tag tag-lg bg-studio p-6 pt-10 md:p-8 md:pt-12">
        <p className="flex items-center gap-2 text-[0.8125rem] font-semibold text-ink-2">
          <span aria-hidden className="tag size-2.5 bg-accent [--cut:4px]" />
          What the assistant is asked
        </p>
        <p className="mt-4 min-h-[7.5em] text-[1.06rem] leading-relaxed text-ink">
          <span className="sr-only">{prompt}</span>
          <span aria-hidden>
            {prompt.slice(0, n)}
            <span className={`ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] bg-accent ${done ? "animate-[blink_1s_steps(1)_infinite]" : ""}`} />
          </span>
        </p>
      </div>
      <AskAi prompt={prompt} className="mt-8" />
    </div>
  );
}
