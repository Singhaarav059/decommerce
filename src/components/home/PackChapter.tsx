"use client";

import { PosterPair } from "@/components/media/Poster";
import { posters } from "@/content/media";
import { Scene } from "@/components/scene/Scene";
import { SceneLabels } from "@/components/scene/SceneLabels";
import { ScrollStage } from "@/components/scene/ScrollStage";
import { pack } from "@/content/home";
import type { StageBus } from "@/three/stageBus";
import { ChapterCard, StageCopy } from "./ChapterCard";

const STEPS: [number, number][] = [
  [0, 0.22],
  [0.22, 0.47],
  [0.47, 0.68],
  [0.68, 1],
];

function Steps({ active }: { active: number }) {
  return (
    <ol className="mt-5 space-y-2">
      {pack.steps.map((s, i) => (
        <li
          key={s}
          className={`flex items-center gap-3 text-[0.95rem] transition-colors duration-300 ${i <= active ? "text-ink" : "text-ink-muted/60"}`}
        >
          <span
            className={`flex size-6 items-center justify-center rounded-full font-mono text-[0.68rem] transition-colors ${i < active ? "bg-olive text-stone-50" : i === active ? "bg-copper text-stone-50" : "bg-travertine"}`}
          >
            {i + 1}
          </span>
          {s}
        </li>
      ))}
    </ol>
  );
}

function Stage({ bus, active }: { bus: StageBus; active: number }) {
  return (
    <>
      <Scene
        scene="packing"
        poster={<PosterPair set={posters.packing} sizes="100vw" />}
        className="size-full"
        sceneProps={{ bus }}
        alt="Packing station with lit bins, a scanner, a label printer and a conveyor"
        fallback={<div className="terrazzo absolute inset-0" />}
      />
      <SceneLabels
        bus={bus}
        className="z-40"
        items={[
          { id: "bin", node: <span className="rounded-full bg-copper px-2 py-0.5 font-mono text-[0.68rem] text-stone-50">B-14</span> },
          {
            id: "label",
            node: <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[0.68rem] text-stone-50">Label printed</span>,
          },
        ]}
      />
      <StageCopy>
        <ChapterCard eyebrow={pack.eyebrow} headline={pack.headline} body={pack.body} links={pack.links}>
          <Steps active={active} />
        </ChapterCard>
      </StageCopy>
    </>
  );
}

/** Chapter 6: pick and pack. */
export function PackChapter() {
  return (
    <ScrollStage
      id="ch-pack"
      length={2.6}
      steps={STEPS}
      stage={(bus, active) => <Stage bus={bus} active={active} />}
      stacked={() => (
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-20">
          <ChapterCard eyebrow={pack.eyebrow} headline={pack.headline} body={pack.body} links={pack.links}>
            <Steps active={pack.steps.length - 1} />
          </ChapterCard>
        </div>
      )}
    />
  );
}
