"use client";

import { PosterPair } from "@/components/media/Poster";
import { posters } from "@/content/media";

import { useState } from "react";
import { ClothingRack } from "@/components/rack/ClothingRack";
import { Scene } from "@/components/scene/Scene";
import { Reveal } from "@/components/ui/Reveal";
import { storefront } from "@/content/home";
import { StageBus } from "@/three/stageBus";
import { ChapterCard } from "./ChapterCard";

const START = 2;

/** Chapter 4: the laptop builds a store page; the rack below re-skins it. */
export function StorefrontChapter() {
  const [bus] = useState(() => {
    const b = new StageBus();
    b.setMode("live");
    b.setStep(START);
    return b;
  });
  return (
    <section id="ch-storefront" className="relative z-10 py-20 md:py-32">
      <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-10 px-[var(--gutter)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:pl-[calc(var(--gutter)+150px)]">
        <Reveal className="lg:sticky lg:top-[calc(var(--header-h)+40px)] lg:self-start">
          <ChapterCard
            eyebrow={storefront.eyebrow}
            headline={storefront.headline}
            body={storefront.body}
            links={storefront.links}
            className="!bg-transparent !p-0"
          />
          <p className="mt-6 text-sm text-ink-muted">{storefront.rackHint}</p>
        </Reveal>
        <div className="grid min-w-0 grid-cols-1 gap-6">
          <Scene
            scene="laptop"
            poster={<PosterPair set={posters.laptop} sizes="(max-width: 1024px) 100vw, 60vw" />}
            sceneProps={{ bus }}
            alt="A laptop on the shop counter showing the store website in the chosen theme"
            className="aspect-[16/11] overflow-hidden rounded-[var(--radius-lg)] shadow-[inset_0_0_0_1px_var(--line)]"
          />
          <ClothingRack
            initial={START}
            onChange={(theme, lifted) => {
              bus.setStep(["linen", "olive", "ink", "terrazzo", "kraft", "stone", "copper"].indexOf(theme.key));
              bus.setFocus(lifted ? "lifted" : null);
            }}
          />
        </div>
      </div>
    </section>
  );
}
