"use client";

import { useState } from "react";
import { Scene } from "@/components/layout/Scene";
import { Headline } from "@/components/ui/Headline";
import { SectionLabel } from "@/components/ui/Section";
import type { Part } from "@/content/types";
import { inSentence } from "@/lib/text";

/**
 * Anatomy: the finished scene full-bleed, with a legend in its calm side.
 * Choosing a part spotlights it in the scene (no pins or labels drawn on the
 * photo). `focus` gives each part's centre in percent of the photo.
 */
export function Anatomy({ title, parts, src, floor, focus }: { title: string; parts: Part[]; src: string; floor: string; focus: Record<string, [number, number]> }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <Scene id="anatomy" variant="framed" soft src={src} floor={floor} spot={active ? (focus[active] ?? [65, 50]) : null}>
      <SectionLabel eyebrow="Anatomy" />
      <Headline as="h2" reveal text={`What makes ${inSentence(title)} work.`} className="t-h2 mt-5" />
      <ul className="mt-8 md:mt-10">
        {parts.map((p) => {
          const on = active === p.id;
          return (
            <li key={p.id} className="">
              <button type="button" aria-pressed={on} onClick={() => setActive(on ? null : p.id)} className="group w-full py-4 text-left">
                <span className={`flex items-center justify-between gap-4 text-[1.05rem] font-semibold transition-colors ${on ? "text-accent" : "text-ink group-hover:text-accent"}`}>
                  {p.label}
                  <span aria-hidden className={`relative size-3.5 shrink-0 transition-transform duration-500 ease-[var(--ease-overshoot)] ${on ? "rotate-45" : ""}`}>
                    <span className="absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 bg-current" />
                    <span className="absolute top-0 left-1/2 h-full w-[1.5px] -translate-x-1/2 bg-current" />
                  </span>
                </span>
                <span className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <span className="overflow-hidden text-[0.95rem] leading-relaxed text-ink-2">
                    <span className="block max-w-[46ch] pt-2">{p.detail}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Scene>
  );
}
