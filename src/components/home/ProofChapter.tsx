"use client";

import { PosterPair } from "@/components/media/Poster";
import { posters } from "@/content/media";

import { Scene } from "@/components/scene/Scene";
import { ScrollStage } from "@/components/scene/ScrollStage";
import { Headline } from "@/components/ui/Headline";
import { Reveal } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";
import { proof } from "@/content/home";
import { StageCopy } from "./ChapterCard";

const STEPS: [number, number][] = [
  [0, 0.25],
  [0.25, 0.5],
  [0.5, 0.75],
  [0.75, 1],
];

function Process({ active }: { active: number }) {
  return (
    <ol className="max-w-[420px] space-y-1 rounded-[var(--radius-lg)] bg-stone-50 p-6 md:p-7">
      {proof.process.map((s, i) => (
        <li
          key={s.n}
          className={`rounded-[var(--radius-md)] px-3 py-3 transition-colors duration-500 ${i === active ? "bg-travertine" : ""}`}
        >
          <p className="flex items-baseline gap-3">
            <span className={`font-mono text-[0.72rem] ${i === active ? "text-copper-ink" : "text-ink-muted"}`}>{s.n}</span>
            <span className="text-lg font-medium tracking-tight">{s.title}</span>
          </p>
          <p
            className={`grid pl-8 text-[0.92rem] leading-relaxed text-ink-soft transition-[grid-template-rows,opacity] duration-500 ${i === active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
          >
            <span className="overflow-hidden">{s.body}</span>
          </p>
        </li>
      ))}
    </ol>
  );
}

/** Chapter 9: honest numbers (Demaze's), then the four-step process as rooms. */
export function ProofChapter() {
  return (
    <section id="ch-proof" className="relative">
      <div className="relative z-10 mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-24 md:py-36 lg:pl-[calc(var(--gutter)+150px)]">
        <Reveal>
          <p className="eyebrow">{proof.eyebrow}</p>
          <Headline as="h2" text={proof.headline} className="mt-3 max-w-[16ch] text-[clamp(2.6rem,6vw,5rem)]" />
          <p className="mt-4 max-w-[52ch] text-lg text-ink-soft">{proof.body}</p>
        </Reveal>
        <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:grid-cols-3">
          {proof.stats.map((s) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </div>
      <ScrollStage
        length={2.6}
        steps={STEPS}
        stage={(bus, active) => (
          <>
            <Scene
              scene="rooms"
              poster={<PosterPair set={posters.rooms} sizes="100vw" />}
              className="size-full"
              sceneProps={{ bus }}
              alt="Four small rooms: a planning desk, a design table, shelves filling with stock and a lit shop counter"
              fallback={<div className="terrazzo absolute inset-0" />}
            />
            <StageCopy>
              <Process active={active} />
            </StageCopy>
          </>
        )}
        stacked={() => (
          <div className="mx-auto grid max-w-[var(--max-w)] gap-4 px-[var(--gutter)] pb-24 sm:grid-cols-2 lg:grid-cols-4">
            {proof.process.map((s) => (
              <div key={s.n} className="rounded-[var(--radius-lg)] bg-travertine p-6">
                <p className="font-mono text-[0.72rem] text-copper-ink">{s.n}</p>
                <p className="mt-2 text-lg font-medium">{s.title}</p>
                <p className="mt-2 text-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>
        )}
      />
    </section>
  );
}
