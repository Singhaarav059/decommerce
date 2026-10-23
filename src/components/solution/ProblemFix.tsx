"use client";

import { useState, type ReactNode } from "react";
import { PosterPair } from "@/components/media/Poster";
import { StageCopy } from "@/components/home/ChapterCard";
import { Scene } from "@/components/scene/Scene";
import { ScrollStage } from "@/components/scene/ScrollStage";
import { Headline } from "@/components/ui/Headline";
import { solutionPoster } from "@/content/media";
import type { SolutionMeta } from "@/content/types";
import type { SceneKey } from "@/scenes/registry";

const STEPS: [number, number][] = [
  [0, 0.3],
  [0.3, 1],
];

function StateTag({ broken, text }: { broken: boolean; text: string }) {
  return (
    <p className={`mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.8rem] ${broken ? "bg-stone-50 text-[var(--alert)] shadow-[inset_0_0_0_1px_var(--line)]" : "bg-ink text-stone-50"}`}>
      <span className={`size-1.5 rounded-full ${broken ? "bg-[var(--alert)]" : "bg-[#e9a27a]"}`} />
      {text}
    </p>
  );
}

/** Blocks 2–3: the problem shown in its broken state, then scroll scrubs it to fixed. */
export function ProblemFix({ meta, children }: { meta: SolutionMeta; children: ReactNode }) {
  const [fixStep, setFixStep] = useState(0);

  const problem = (
    <div className="max-w-[440px] rounded-[var(--radius-lg)] bg-stone-50 p-6 md:p-7">
      <p className="eyebrow">The problem</p>
      <Headline as="h2" text={meta.problem.title} className="mt-3 text-[clamp(2rem,4vw,3.2rem)]" />
      <div className="mt-3 leading-relaxed text-ink-soft [&_p]:mb-0">{children}</div>
      <StateTag broken text={meta.problem.broken} />
    </div>
  );
  const fix = (active: number) => (
    <div className="max-w-[440px] rounded-[var(--radius-lg)] bg-stone-50 p-6 md:p-7">
      <p className="eyebrow">The fix</p>
      <Headline as="h2" text={meta.fix.title} className="mt-3 text-[clamp(2rem,4vw,3.2rem)]" />
      <ol className="mt-5 space-y-2">
        {meta.fix.steps.map((s, i) => (
          <li key={s} className={`flex items-center gap-3 transition-colors duration-300 ${i <= active ? "text-ink" : "text-ink-muted"}`}>
            <span className={`flex size-6 items-center justify-center rounded-full font-mono text-[0.68rem] ${i < active ? "bg-olive text-stone-50" : i === active ? "bg-copper text-stone-50" : "bg-travertine"}`}>{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <StateTag broken={false} text={meta.fix.fixed} />
    </div>
  );

  return (
    <ScrollStage
      id="fix"
      length={2.6}
      steps={STEPS}
      onProgress={(p) => setFixStep(Math.min(meta.fix.steps.length - 1, Math.max(0, Math.floor(((p - 0.3) / 0.7) * meta.fix.steps.length))))}
      stage={(bus, active) => {
        // the stage's own bus is in "scrub" mode by default: progress drives broken → fixed
        return (
          <>
            <Scene
              scene={meta.scene as SceneKey}
              sceneProps={{ bus }}
              alt={`${meta.title}: from ${meta.problem.broken.toLowerCase()} to ${meta.fix.fixed.toLowerCase()}`}
              poster={<PosterPair set={solutionPoster(meta.slug)} sizes="100vw" />}
              fallback={<div className="terrazzo absolute inset-0" />}
              className="size-full"
            />
            <StageCopy visible={active === 0}>{problem}</StageCopy>
            <StageCopy visible={active === 1}>{fix(fixStep)}</StageCopy>
          </>
        );
      }}
      stacked={() => (
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-6 px-[var(--gutter)] py-20 md:grid-cols-2">
          {problem}
          {fix(meta.fix.steps.length - 1)}
        </div>
      )}
    />
  );
}
