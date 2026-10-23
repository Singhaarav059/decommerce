"use client";

import { PosterPair } from "@/components/media/Poster";
import { posters } from "@/content/media";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Scene } from "@/components/scene/Scene";
import { ScrollStage } from "@/components/scene/ScrollStage";
import { Headline } from "@/components/ui/Headline";
import { inStore } from "@/content/home";
import type { SceneKey } from "@/scenes/registry";
import { StageBus } from "@/three/stageBus";

const STEPS: [number, number][] = [
  [0, 0.34],
  [0.34, 0.67],
  [0.67, 1],
];

function Panel({ panel, bus, index }: { panel: (typeof inStore.panels)[number]; bus: StageBus; index: number }) {
  return (
    <article className="flex h-full w-[86vw] shrink-0 flex-col gap-5 md:w-[62vw] lg:w-[54vw]">
      <Scene
        scene={panel.scene as SceneKey}
        poster={<PosterPair set={posters[panel.scene as keyof typeof posters]} sizes="(max-width: 768px) 86vw, 54vw" />}
        sceneProps={{ bus }}
        alt={panel.title}
        fallback={<div className="terrazzo absolute inset-0" />}
        className="min-h-0 flex-1 overflow-hidden rounded-[var(--radius-lg)] shadow-[inset_0_0_0_1px_var(--line)]"
      />
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">0{index + 1} / 03</p>
          <h3 className="mt-2 text-2xl font-medium tracking-tight">{panel.title}</h3>
          <p className="mt-1 max-w-[46ch] text-ink-soft">{panel.body}</p>
        </div>
        <Link href={panel.href} className="shrink-0 font-medium text-copper-ink">
          {panel.title} →
        </Link>
      </div>
    </article>
  );
}

/** Still visitors: show every panel's end state. */
function ShowEndStates({ buses }: { buses: StageBus[] }) {
  useEffect(() => {
    buses.forEach((b) => {
      b.setReduced(true);
      b.setProgress(1);
    });
  }, [buses]);
  return null;
}

/** Chapter 8: three in-store sub-scenes on a horizontal track driven by vertical scroll. */
export function InStoreChapter() {
  const [buses] = useState(() => inStore.panels.map(() => new StageBus()));
  const track = useRef<HTMLDivElement>(null);

  const onProgress = (p: number) => {
    const el = track.current;
    if (el) {
      const max = el.scrollWidth - el.parentElement!.clientWidth;
      el.style.transform = `translate3d(${(-p * max).toFixed(1)}px,0,0)`;
    }
    // each panel plays its own little film while it is the one in view
    buses.forEach((b, i) => b.setProgress(Math.min(1, Math.max(0, (p - STEPS[i][0] + 0.12) / (STEPS[i][1] - STEPS[i][0])))));
  };

  const header = (
    <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] lg:pl-[calc(var(--gutter)+150px)]">
      <p className="eyebrow">{inStore.eyebrow}</p>
      <Headline as="h2" text={inStore.headline} className="mt-3 text-[clamp(2.4rem,5vw,4.2rem)]" />
    </div>
  );

  return (
    <ScrollStage
      id="ch-instore"
      length={3}
      steps={STEPS}
      onProgress={onProgress}
      stage={() => (
        <div className="flex h-full flex-col gap-6 pt-[calc(var(--header-h)+24px)] pb-8">
          {header}
          <div className="min-h-0 flex-1 overflow-hidden">
            <div ref={track} className="flex h-full gap-6 px-[var(--gutter)] will-change-transform lg:pl-[calc(var(--gutter)+150px)]">
              {inStore.panels.map((panel, i) => (
                <Panel key={panel.id} panel={panel} bus={buses[i]} index={i} />
              ))}
              <div aria-hidden className="w-px shrink-0" />
            </div>
          </div>
        </div>
      )}
      stacked={() => {
        return (
          <div className="py-20">
            <ShowEndStates buses={buses} />
            {header}
            <div className="mx-auto mt-8 grid max-w-[var(--max-w)] gap-10 px-[var(--gutter)]">
              {inStore.panels.map((panel, i) => (
                <div key={panel.id} className="h-[70svh]">
                  <Panel panel={panel} bus={buses[i]} index={i} />
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
