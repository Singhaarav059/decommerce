"use client";

import { useEffect, useRef, useState } from "react";
import { PosterPair } from "@/components/media/Poster";
import { ClothingRack } from "@/components/rack/ClothingRack";
import { Scene } from "@/components/scene/Scene";
import { ButtonLink } from "@/components/ui/Button";
import { Headline } from "@/components/ui/Headline";
import { solutionPoster } from "@/content/media";
import { themes } from "@/content/themes";
import type { SolutionMeta } from "@/content/types";
import type { SceneKey } from "@/scenes/registry";
import { StageBus } from "@/three/stageBus";
import { InteractionControl } from "./InteractionControl";

/** Block 1: promise + the scene in its fixed state with the signature interaction. */
export function SolutionHero({ meta }: { meta: SolutionMeta }) {
  const [bus] = useState(() => {
    const b = new StageBus();
    b.setMode("live");
    b.setStep(2);
    return b;
  });
  const surface = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bus.setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, [bus]);
  const it = meta.interaction;

  return (
    <section className="relative mx-auto grid max-w-[var(--max-w)] grid-cols-1 items-center gap-10 px-[var(--gutter)] pt-[calc(var(--header-h)+40px)] pb-16 lg:min-h-[100svh] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:pb-20">
      <div>
        <p className="eyebrow">{meta.eyebrow}</p>
        <Headline text={meta.headline} className="mt-4 text-[clamp(2.8rem,6.4vw,5.6rem)]" />
        <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-ink-soft">{meta.promise}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact-us" arrow>
            Book a demo
          </ButtonLink>
          <ButtonLink href="#fix" variant="secondary">
            See it work
          </ButtonLink>
        </div>
      </div>
      <div className="relative z-10 grid min-w-0 grid-cols-1 gap-4">
        <div ref={surface} className={it.kind === "slider" && it.drag ? "cursor-ew-resize touch-pan-y" : undefined}>
          <Scene
            scene={meta.scene as SceneKey}
            sceneProps={{ bus }}
            alt={`${meta.title}: ${meta.fix.fixed}`}
            poster={<PosterPair set={solutionPoster(meta.slug)} priority sizes="(max-width: 1024px) 100vw, 58vw" />}
            fallback={<div className="terrazzo absolute inset-0" />}
            className="aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] shadow-[inset_0_0_0_1px_var(--line)] lg:aspect-[16/11]"
          />
        </div>
        {it.kind === "rack" ? (
          <ClothingRack
            initial={2}
            label={it.label}
            onChange={(theme, lifted) => {
              bus.setStep(themes.findIndex((t) => t.key === theme.key));
              bus.setFocus(lifted ? "lifted" : null);
            }}
          />
        ) : (
          <InteractionControl interaction={it} bus={bus} surface={surface} />
        )}
      </div>
    </section>
  );
}
