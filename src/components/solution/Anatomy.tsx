"use client";

import Image from "next/image";
import { useState } from "react";
import { Headline } from "@/components/ui/Headline";
import type { Part } from "@/content/types";
import { inSentence } from "@/lib/text";

/**
 * Anatomy: a legend beside one still. Choosing a part zooms the still to that
 * part (no pins or labels drawn on the image). `focus` gives each part's centre
 * in percent of the image; parts without one zoom to the centre.
 */
export function Anatomy({ title, parts, still, focus }: { title: string; parts: Part[]; still: string; focus: Record<string, [number, number]> }) {
  const [active, setActive] = useState<string | null>(null);
  const f = active ? (focus[active] ?? [50, 50]) : [50, 50];
  const scale = active ? 1.8 : 1;
  return (
    <section className="border-t border-line">
      <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-10 px-[var(--gutter)] py-[var(--section-gap)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
        <div className="order-2 lg:order-1">
          <p className="eyebrow">Anatomy</p>
          <Headline as="h2" text={`What makes ${inSentence(title)} work.`} className="mt-4 text-[clamp(2.1rem,4vw,4rem)]" />
          <ul className="mt-8 border-t border-line">
            {parts.map((p) => {
              const on = active === p.id;
              return (
                <li key={p.id} className="border-b border-line">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActive(on ? null : p.id)}
                    className="w-full py-3.5 text-left"
                  >
                    <span className={`flex items-center justify-between font-semibold ${on ? "text-copper" : "text-ink"}`}>
                      {p.label}
                      <span aria-hidden className="text-ink-2">{on ? "−" : "+"}</span>
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
        </div>
        <div className="feather relative order-1 aspect-[4/3] overflow-hidden lg:order-2 lg:aspect-video">
          <Image
            src={still}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-out)]"
            style={{ transformOrigin: `${f[0]}% ${f[1]}%`, transform: `scale(${scale})` }}
          />
        </div>
      </div>
    </section>
  );
}
