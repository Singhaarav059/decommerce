"use client";

import Image from "next/image";
import { useState } from "react";
import { Headline } from "@/components/ui/Headline";
import { Tabs } from "@/components/ui/Tabs";
import type { Capability } from "@/content/types";
import { inSentence } from "@/lib/text";

/** Capabilities: tabs in the text column; each tab shows its own frame of the page's film. */
export function Capabilities({ title, items, frames }: { title: string; items: Capability[]; frames: string[] }) {
  const [i, setI] = useState(0);
  return (
    <section className="border-t border-line">
      <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-10 px-[var(--gutter)] py-[var(--section-gap)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
        <div className="order-2 lg:order-1">
          <p className="eyebrow">Capabilities</p>
          <Headline as="h2" text={`What ${inSentence(title)} does.`} className="mt-4 text-[clamp(2.1rem,4vw,4rem)]" />
          <Tabs
            label={`${title} capabilities`}
            className="mt-8"
            onChange={(_, n) => setI(n)}
            items={items.map((c) => ({ id: c.title, label: c.title, content: <p className="max-w-[44ch] text-ink-2">{c.body}</p> }))}
          />
        </div>
        <div className="feather relative order-1 aspect-[4/3] lg:order-2 lg:aspect-video">
          {frames.map((src, n) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className={`object-cover transition-opacity duration-500 ${n === i % frames.length ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
