"use client";

import { Scene } from "@/components/scene/Scene";
import { SceneLabels } from "@/components/scene/SceneLabels";
import { ScrollStage } from "@/components/scene/ScrollStage";
import { Headline } from "@/components/ui/Headline";
import { PosterPair } from "@/components/media/Poster";
import { hero, islands, unify } from "@/content/home";
import { posters } from "@/content/media";
import type { StageBus } from "@/three/stageBus";

// The hero now lives in HeroFilm; this stage starts with the diorama splitting.
const STEPS: [number, number][] = [
  [0, 0.48],
  [0.5, 1],
];
/** Scene progress 0.24–1 is islands → unify (0–0.24 was the old 3D hero). */
const mapProgress = (p: number) => 0.24 + p * 0.76;

function StockTag({ name, stock, fixed }: { name: string; stock: number; fixed: boolean }) {
  return (
    <div
      className={`rounded-full px-3 py-1.5 text-[0.78rem] whitespace-nowrap transition-colors duration-500 ${
        fixed ? "bg-ink text-stone-50" : "bg-stone-50 text-ink shadow-[0_0_0_1px_var(--line)]"
      }`}
    >
      <span className="mr-1.5">{name}</span>
      <span className={`font-mono tabular-nums ${fixed ? "text-[#e9a27a]" : "text-[var(--alert)]"}`}>{stock}</span>
      <span className={fixed ? "text-stone-50/70" : "text-ink-muted"}> {islands.unit}</span>
    </div>
  );
}

function StepCard({
  step,
  visible,
  children,
}: {
  step: { eyebrow: string; headline: string; body: string };
  visible: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={!visible}
      className={`absolute inset-x-0 bottom-[6svh] z-40 mx-auto max-w-[var(--max-w)] px-[var(--gutter)] transition-[opacity,transform] duration-700 ease-[var(--ease-out)] lg:pl-[calc(var(--gutter)+150px)] ${
        visible ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="max-w-[460px] rounded-[var(--radius-lg)] bg-stone-50 p-6 md:p-7">
        <p className="eyebrow">{step.eyebrow}</p>
        <Headline as="h2" text={step.headline} className="mt-3 text-[clamp(2rem,4.4vw,3.4rem)]" />
        <p className="mt-3 leading-relaxed text-ink-soft">{step.body}</p>
        {children}
      </div>
    </div>
  );
}

function Stage({ bus, active }: { bus: StageBus; active: number }) {
  const fixed = active >= 1;
  return (
    <>
      <Scene
        scene="world"
        className="size-full"
        alt={hero.posterAlt}
        sceneProps={{ bus }}
        poster={<PosterPair set={posters.world} priority />}
        fallback={<div className="terrazzo absolute inset-0" />}
      />
      <SceneLabels
        bus={bus}
        className="z-40"
        items={islands.zones.map((z, i) => ({
          id: `zone-${z.id}`,
          fallback: { left: `${[30, 70, 30, 70][i]}%`, top: `${[58, 58, 34, 34][i]}%` },
          node: <StockTag name={z.name} stock={fixed ? unify.stock : z.stock} fixed={fixed} />,
        }))}
      />
      <StepCard step={islands} visible={active === 0}>
        <p className="mt-4 font-mono text-[0.7rem] tracking-wide text-ink-muted uppercase">{islands.item} · illustrative</p>
      </StepCard>
      <StepCard step={unify} visible={active === 1} />
    </>
  );
}

export function WorldChapter() {
  return (
    <div className="relative">
      {/* anchors for the chapter rail, spread over the pinned length */}
      {STEPS.map(([a, b], i) => (
        <div
          key={i}
          id={["ch-islands", "ch-unify"][i]}
          aria-hidden
          className="pointer-events-none absolute inset-x-0"
          style={{ top: `${a * 100}%`, height: `${(b - a) * 100}%` }}
        />
      ))}
      <ScrollStage
        length={2.8}
        steps={STEPS}
        mapProgress={mapProgress}
        stage={(bus, active) => <Stage bus={bus} active={active} />}
        stacked={() => (
          <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-[calc(var(--header-h)+48px)] pb-16">
            {[islands, unify].map((s, i) => (
              <div key={s.eyebrow} className={`max-w-xl ${i ? "mt-16" : ""}`}>
                <p className="eyebrow">{s.eyebrow}</p>
                <Headline as="h2" text={s.headline} className="mt-3 text-5xl" />
                <p className="mt-3 text-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
}
