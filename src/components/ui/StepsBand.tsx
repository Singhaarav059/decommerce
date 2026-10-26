"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Section } from "./Section";

export type BandStep = { title: string; body: string; result?: string };

/** Stage fills, darkest first: the order reads dark to light, all in the one copper hue. */
const FILLS = [
  { bg: "bg-[#2b1a10]", ink: "text-paper", soft: "text-paper/80" },
  { bg: "bg-[#5e2a12]", ink: "text-paper", soft: "text-paper/80" },
  { bg: "bg-copper", ink: "text-paper", soft: "text-paper/85" },
  { bg: "bg-[#ecdccf]", ink: "text-ink", soft: "text-ink-2" },
  { bg: "bg-[#f6eee7]", ink: "text-ink", soft: "text-ink-2" },
];

/**
 * The one design for every "how it works" sequence: one row of tinted panels with no gaps, dark
 * to light in step order. The open step takes most of the width with its text and a photograph;
 * the others are slivers showing only their name. Choosing a sliver opens it. Phones: the panels
 * stack as bars, the open one expanded.
 */
export function StepsBand({
  id,
  headline,
  lead,
  steps,
  backdrop,
  images,
  resultLabel = "You have",
  headerAside,
}: {
  id?: string;
  index?: string;
  eyebrow?: string;
  headline: string;
  lead?: string;
  steps: BandStep[];
  backdrop: string;
  /** One photograph per step for the open panel; falls back to the backdrop. */
  images?: string[];
  resultLabel?: string;
  headerAside?: ReactNode;
}) {
  const [open, setOpen] = useState(0);
  return (
    <Section id={id} headline={headline} lead={lead} headerAside={headerAside}>
      <ol className="rv flex flex-col overflow-hidden lg:h-[540px] lg:flex-row">
        {steps.map((s, i) => {
          const f = FILLS[i % FILLS.length];
          const on = i === open;
          return (
            <li
              key={s.title}
              className={`${f.bg} ${f.ink} relative min-w-0 overflow-hidden transition-[flex-grow] duration-[450ms] ease-[var(--ease-in-out)] lg:basis-0 ${on ? "lg:grow-[7]" : "lg:grow"} ${i === 0 ? "tag tag-lg tag-plain" : ""}`}
            >
              <button
                type="button"
                aria-expanded={on}
                onClick={() => setOpen(i)}
                className={`flex w-full items-center gap-4 px-6 text-left lg:absolute lg:inset-0 lg:items-end lg:px-0 ${on ? "py-5 lg:pointer-events-none lg:opacity-0" : "h-16 lg:h-auto lg:py-0"}`}
              >
                <span className={`tabular text-[0.94rem] ${f.soft} lg:hidden`}>{i + 1}</span>
                <span className="display text-[1.125rem] lg:absolute lg:bottom-6 lg:left-1/2 lg:origin-left lg:-rotate-90 lg:text-[1.25rem] lg:w-max lg:whitespace-nowrap lg:[translate:-0.6em_0]">{s.title}</span>
              </button>
              <div className={`grid transition-[grid-template-rows,opacity] duration-[450ms] ease-[var(--ease-out)] lg:absolute lg:inset-0 lg:flex ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 lg:pointer-events-none"}`} inert={!on}>
                <div className="flex min-h-0 overflow-hidden lg:w-full">
                  <div className="flex w-full flex-col gap-6 p-6 pt-0 lg:w-1/2 lg:justify-between lg:p-10">
                    <h3 className={`display hidden text-[clamp(2rem,3vw,2.6rem)] leading-none lg:block ${i === 0 ? "lg:pt-10" : ""}`}>{s.title}</h3>
                    <div>
                      <p className="max-w-[36ch] text-[1.06rem] leading-relaxed lg:text-[1.125rem]">{s.body}</p>
                      {s.result && (
                        <p className={`mt-5 max-w-[36ch] text-[0.94rem] leading-relaxed ${f.soft}`}>
                          <span className={`font-semibold ${f.ink}`}>{resultLabel}: </span>
                          {s.result}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="tag tag-lg relative m-4 ml-0 hidden w-1/2 lg:block">
                    <Image src={images?.[i] ?? backdrop} alt="" fill sizes="30vw" quality={75} className="object-cover" />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
