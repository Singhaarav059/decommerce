"use client";

import { useState } from "react";
import { Scene } from "@/components/layout/Scene";
import { Headline } from "@/components/ui/Headline";
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
    <Scene id="anatomy" src={src} floor={floor} spot={active ? (focus[active] ?? [65, 50]) : null}>
      <p className="eyebrow">Anatomy</p>
      <Headline as="h2" text={`What makes ${inSentence(title)} work.`} className="mt-2 text-[clamp(1.8rem,4vw,4rem)] md:mt-4" />
      <ul className="mt-6 border-t border-line md:mt-8">
        {parts.map((p) => {
          const on = active === p.id;
          return (
            <li key={p.id} className="border-b border-line">
              <button type="button" aria-pressed={on} onClick={() => setActive(on ? null : p.id)} className="w-full py-3 text-left">
                <span className={`flex items-center justify-between font-semibold ${on ? "text-copper" : "text-ink"}`}>
                  {p.label}
                  <span aria-hidden>{on ? "−" : "+"}</span>
                </span>
                <span className={`grid transition-[grid-template-rows] duration-300 ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <span className="overflow-hidden text-[0.95rem] leading-relaxed text-ink-2">
                    <span className="block pt-1.5">{p.detail}</span>
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
