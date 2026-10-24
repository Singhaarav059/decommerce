"use client";

import { Scene } from "@/components/layout/Scene";
import { Headline } from "@/components/ui/Headline";
import { Tabs } from "@/components/ui/Tabs";
import type { Capability } from "@/content/types";
import { inSentence } from "@/lib/text";

/** Capabilities: a close-up of the same place full-bleed, with the capability tabs in its calm side. */
export function Capabilities({ title, items, src, floor }: { title: string; items: Capability[]; src: string; floor: string }) {
  return (
    <Scene id="capabilities" src={src} floor={floor}>
      <p className="eyebrow">Capabilities</p>
      <Headline as="h2" text={`What ${inSentence(title)} does.`} className="mt-2 text-[clamp(1.8rem,4vw,4rem)] md:mt-4" />
      <Tabs
        label={`${title} capabilities`}
        className="mt-6 md:mt-8"
        items={items.map((c) => ({ id: c.title, label: c.title, content: <p className="max-w-[44ch] text-ink-2">{c.body}</p> }))}
      />
    </Scene>
  );
}
