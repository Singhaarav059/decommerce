"use client";

import { Scene } from "@/components/layout/Scene";
import { Headline } from "@/components/ui/Headline";
import { Tabs } from "@/components/ui/Tabs";
import type { Capability } from "@/content/types";
import { inSentence } from "@/lib/text";

/** Capabilities: a close-up of the same place full-bleed, with the capability tabs in its calm side. */
export function Capabilities({ title, items, src, floor }: { title: string; items: Capability[]; src: string; floor: string }) {
  return (
    <Scene id="capabilities" variant="framed" flip src={src} floor={floor}>
      <p className="eyebrow">Capabilities</p>
      <Headline as="h2" reveal text={`What ${inSentence(title)} does.`} className="t-h2 mt-5" />
      <Tabs
        label={`${title} capabilities`}
        className="mt-8 md:mt-10"
        items={items.map((c) => ({ id: c.title, label: c.title, content: <p className="t-lead max-w-[44ch] animate-[rise_500ms_var(--ease-out)_both] text-ink-2">{c.body}</p> }))}
      />
    </Scene>
  );
}
