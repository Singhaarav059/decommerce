"use client";

import { Scene } from "@/components/scene/Scene";
import { SceneLabels } from "@/components/scene/SceneLabels";
import { ScrollStage } from "@/components/scene/ScrollStage";
import { ButtonLink } from "@/components/ui/Button";
import { Headline } from "@/components/ui/Headline";
import { Poster, PosterPair } from "@/components/media/Poster";
import { hero, islands, unify } from "@/content/home";
import { posters } from "@/content/media";
import type { StageBus } from "@/three/stageBus";

const STEPS: [number, number][] = [
  [0, 0.2],
  [0.22, 0.58],
  [0.6, 1],
];

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

function HeroCopy({ visible }: { visible: boolean }) {
  return (
    <div
      className={`absolute inset-x-0 top-[calc(var(--header-h)+5svh)] z-40 mx-auto max-w-[var(--max-w)] px-[var(--gutter)] transition-[opacity,transform] duration-700 ease-[var(--ease-out)] lg:pl-[calc(var(--gutter)+150px)] ${
        visible ? "opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
      }`}
    >
      <p className="eyebrow">{hero.eyebrow}</p>
      <Headline text={hero.headline} className="mt-4 max-w-[11ch] text-[clamp(3rem,8.4vw,7.6rem)]" />
      <p className="mt-5 max-w-[38ch] text-[1.05rem] leading-relaxed text-ink-soft md:text-lg">{hero.body}</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <ButtonLink href={hero.primary.href} arrow>
          {hero.primary.label}
        </ButtonLink>
        <ButtonLink href={hero.secondary.href} variant="secondary">
          {hero.secondary.label}
        </ButtonLink>
      </div>
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
  const fixed = active >= 2;
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
        className={`z-40 transition-opacity duration-500 ${active >= 1 ? "opacity-100" : "opacity-0"}`}
        items={islands.zones.map((z, i) => ({
          id: `zone-${z.id}`,
          fallback: { left: `${[30, 70, 30, 70][i]}%`, top: `${[58, 58, 34, 34][i]}%` },
          node: <StockTag name={z.name} stock={fixed ? unify.stock : z.stock} fixed={fixed} />,
        }))}
      />
      <HeroCopy visible={active === 0} />
      <StepCard step={islands} visible={active === 1}>
        <p className="mt-4 font-mono text-[0.7rem] tracking-wide text-ink-muted uppercase">{islands.item} · illustrative</p>
      </StepCard>
      <StepCard step={unify} visible={active === 2} />
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
          id={["ch-store", "ch-islands", "ch-unify"][i]}
          aria-hidden
          className="pointer-events-none absolute inset-x-0"
          style={{ top: `${a * 100}%`, height: `${(b - a) * 100}%` }}
        />
      ))}
      <ScrollStage
        length={3.6}
        steps={STEPS}
        stage={(bus, active) => <Stage bus={bus} active={active} />}
        stacked={() => (
          <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-[calc(var(--header-h)+48px)] pb-16">
            <p className="eyebrow">{hero.eyebrow}</p>
            <Headline text={hero.headline} className="mt-4 max-w-[11ch] text-[clamp(3rem,8.4vw,7.6rem)]" />
            <p className="mt-5 max-w-[38ch] text-lg text-ink-soft">{hero.body}</p>
            <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)]">
              <Poster src={posters.world.desktop} alt={hero.posterAlt} />
            </div>
            {[islands, unify].map((s) => (
              <div key={s.eyebrow} className="mt-16 max-w-xl">
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
