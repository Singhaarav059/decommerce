"use client";

import { useState } from "react";
import { PosterPair } from "@/components/media/Poster";
import { Scene } from "@/components/scene/Scene";
import { SceneLabels } from "@/components/scene/SceneLabels";
import { Headline } from "@/components/ui/Headline";
import { Tabs } from "@/components/ui/Tabs";
import { solutionPoster } from "@/content/media";
import type { SolutionMeta } from "@/content/types";
import type { SceneKey } from "@/scenes/registry";
import { StageBus } from "@/three/stageBus";

/**
 * Blocks 4–5: anatomy (numbered pins on the 3D parts) and capabilities (tabs
 * that move the camera), around one sticky scene in "inside" mode.
 */
export function Inside({ meta }: { meta: SolutionMeta }) {
  const [bus] = useState(() => {
    const b = new StageBus();
    b.setMode("inside");
    return b;
  });
  const [focus, setFocus] = useState<string | null>(null);

  const pick = (id: string | null) => {
    setFocus(id);
    bus.setFocus(id);
  };

  return (
    <section className="relative border-t border-line">
      <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-10 px-[var(--gutter)] py-20 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="order-2 lg:order-1">
          <p className="eyebrow">Anatomy</p>
          <Headline as="h2" text={`What's inside.`} className="mt-3 text-[clamp(2.2rem,4.6vw,3.6rem)]" />
          <ol className="mt-8 space-y-2">
            {meta.anatomy.map((part, i) => {
              const on = focus === part.id;
              return (
                <li key={part.id}>
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => pick(on ? null : part.id)}
                    onMouseEnter={() => pick(part.id)}
                    className={`flex w-full gap-4 rounded-[var(--radius-md)] p-4 text-left transition-colors ${on ? "bg-ink text-stone-50" : "hover:bg-travertine/70"}`}
                  >
                    <span className={`flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[0.72rem] ${on ? "bg-copper text-stone-50" : "bg-travertine"}`}>{i + 1}</span>
                    <span>
                      <span className="block font-medium">{part.label}</span>
                      <span className={`mt-1 block text-[0.92rem] leading-relaxed ${on ? "text-stone-50/75" : "text-ink-soft"}`}>{part.detail}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-16">
            <p className="eyebrow">Capabilities</p>
            <Tabs
              label={`${meta.title} capabilities`}
              className="mt-4"
              onChange={(_, i) => bus.setStep(i)}
              items={meta.capabilities.map((c) => ({
                id: c.title,
                label: c.title,
                content: <p className="max-w-[48ch] text-lg leading-relaxed text-ink-soft">{c.body}</p>,
              }))}
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          {/* sticky = own stacking context: z-40 keeps the pins above the shared canvas */}
          <div className="sticky top-[calc(var(--header-h)+16px)] z-40">
            <Scene
              scene={meta.scene as SceneKey}
              sceneProps={{ bus }}
              alt={`${meta.title}, labelled parts`}
              poster={<PosterPair set={solutionPoster(meta.slug)} sizes="(max-width: 1024px) 100vw, 58vw" />}
              fallback={<div className="terrazzo absolute inset-0" />}
              className="aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] shadow-[inset_0_0_0_1px_var(--line)]"
            >
              <SceneLabels
                bus={bus}
                className="z-10"
                items={meta.anatomy.map((part, i) => ({
                  id: `part-${part.id}`,
                  fallback: { left: `${20 + ((i * 23) % 60)}%`, top: `${30 + ((i * 17) % 45)}%` },
                  node: (
                    <button
                      type="button"
                      aria-label={`${i + 1}. ${part.label}`}
                      onClick={() => pick(focus === part.id ? null : part.id)}
                      className={`pointer-events-auto mb-1 flex size-8 items-center justify-center rounded-full font-mono text-[0.72rem] transition-[background-color,color,transform] duration-300 ease-[var(--ease-overshoot)] ${
                        focus === part.id ? "scale-110 bg-copper text-stone-50" : "bg-stone-50 text-ink shadow-[0_0_0_1px_var(--line)] hover:scale-110"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ),
                }))}
              />
            </Scene>
          </div>
        </div>
      </div>
    </section>
  );
}
