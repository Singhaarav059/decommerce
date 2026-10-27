"use client";

import { useState } from "react";
import { Check } from "@/components/ui/Check";
import { useSequenceProgress } from "@/components/media/ScrollSequence";

/**
 * The bottom edge of a solution page's hero once the window has opened: the "with Decommerce"
 * steps, ticking off as the scene plays. It is part of the frame, never laid over the picture.
 * Phones show the step in progress; wider screens show them all.
 */
export function SolutionSteps({ fix, steps }: { fix: string; steps: string[] }) {
  const [done, setDone] = useState(-1);
  useSequenceProgress((p) => {
    const d = Math.min(steps.length - 1, Math.max(-1, Math.floor(((p - 0.45) / 0.5) * steps.length)));
    setDone((v) => (v === d ? v : d));
  });
  const now = Math.min(steps.length - 1, done + 1);
  return (
    <div className="mx-auto flex max-w-[var(--max-w)] items-center gap-x-8 px-[var(--gutter)] py-4 md:py-5">
      <p className="shrink-0 text-[0.875rem] leading-snug">
        <span className="font-semibold">With Decommerce</span>
        <span className="block text-ink-2 max-md:hidden">{fix.replace(/\*/g, "")}</span>
      </p>
      <ol className="flex min-w-0 flex-1 gap-x-6 text-[0.9rem]" aria-label="Steps">
        {steps.map((s, i) => (
          <li key={s} className={`min-w-0 items-center gap-2.5 transition-opacity duration-300 ${i === now ? "flex" : "hidden lg:flex"} ${i <= done ? "opacity-100" : "opacity-55"}`}>
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[0.8125rem] font-semibold transition-colors duration-300 ${i <= done ? "bg-accent text-paper" : "ring-1 ring-ink/25"}`}
            >
              {i <= done ? <Check /> : i + 1}
            </span>
            <span className="truncate">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
