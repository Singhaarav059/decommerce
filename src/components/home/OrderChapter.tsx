"use client";

import { PosterPair } from "@/components/media/Poster";
import { posters } from "@/content/media";
import { Scene } from "@/components/scene/Scene";
import { SceneLabels } from "@/components/scene/SceneLabels";
import { ScrollStage } from "@/components/scene/ScrollStage";
import { Hotspots } from "@/components/ui/Hotspots";
import { order, orderLands } from "@/content/home";
import type { StageBus } from "@/three/stageBus";
import { ChapterCard, StageCopy } from "./ChapterCard";

const STEPS: [number, number][] = [
  [0, 0.3],
  [0.3, 0.65],
  [0.65, 1],
];
const STATUS = ["Order received", "Checking 3 locations", `Routed to ${order.store}`];

function Stage({ bus, active }: { bus: StageBus; active: number }) {
  return (
    <>
      <Scene
        scene="orders"
        poster={<PosterPair set={posters.orders} sizes="100vw" />}
        className="size-full"
        sceneProps={{ bus }}
        alt="City map with the order ticket and three stock locations"
        fallback={<div className="terrazzo absolute inset-0" />}
      />
      <SceneLabels
        bus={bus}
        className="z-40"
        items={[
          ...orderLands.locations.map((l, i) => ({
            id: `loc-${l.id}`,
            fallback: { left: `${[30, 58, 78][i]}%`, top: `${[30, 48, 30][i]}%` },
            node: (
              <div
                className={`rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[0.74rem] whitespace-nowrap transition-colors duration-500 ${
                  active === 2 && l.chosen
                    ? "bg-ink text-stone-50"
                    : active === 2
                      ? "bg-stone-50/80 text-ink-muted"
                      : "bg-stone-50 text-ink shadow-[0_0_0_1px_var(--line)]"
                }`}
              >
                <span className="block font-medium">{l.name}</span>
                <span className="block opacity-70">{l.detail}</span>
              </div>
            ),
          })),
          {
            id: "home",
            node: <span className="rounded-full bg-copper px-2 py-0.5 font-mono text-[0.68rem] text-stone-50">{order.id}</span>,
          },
        ]}
      />
      <StageCopy>
        <ChapterCard eyebrow={orderLands.eyebrow} headline={orderLands.headline} body={orderLands.body} links={orderLands.links}>
          <ol className="mt-5 space-y-1.5 text-sm">
            {STATUS.map((s, i) => (
              <li key={s} className={`flex items-center gap-2 transition-colors ${i <= active ? "text-ink" : "text-ink-muted"}`}>
                <span className={`size-1.5 rounded-full ${i < active ? "bg-olive" : i === active ? "bg-copper" : "bg-line"}`} />
                {s}
              </li>
            ))}
          </ol>
        </ChapterCard>
      </StageCopy>
      <div
        className={`absolute inset-0 z-40 transition-opacity duration-500 ${active === 2 ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <Hotspots items={orderLands.hotspots} className="pointer-events-auto absolute inset-0 hidden md:block">
          <div className="h-[100svh]" />
        </Hotspots>
      </div>
    </>
  );
}

/** Chapter 5: ORD-1042 lands and routes itself. */
export function OrderChapter() {
  return (
    <ScrollStage
      id="ch-order"
      length={2.8}
      steps={STEPS}
      stage={(bus, active) => <Stage bus={bus} active={active} />}
      stacked={() => (
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-20">
          <ChapterCard eyebrow={orderLands.eyebrow} headline={orderLands.headline} body={orderLands.body} links={orderLands.links} />
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {orderLands.locations.map((l) => (
              <li key={l.id} className={`rounded-[var(--radius-md)] p-4 ${l.chosen ? "bg-ink text-stone-50" : "bg-travertine"}`}>
                <p className="font-medium">{l.name}</p>
                <p className="text-sm opacity-70">{l.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    />
  );
}
