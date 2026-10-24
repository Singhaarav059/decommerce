"use client";

import Link from "next/link";
import { PinnedFilm } from "@/components/media/PinnedFilm";
import { inStore as s } from "@/content/home";
import { sequences } from "@/content/media";
import { StackList, StepText } from "./StepText";

/** Homepage chapter 8: tap to pay at the counter, then the in-store modules. */
export function InStoreChapter() {
  const modules = [...s.panels.map((p) => ({ title: p.title, body: p.body, href: p.href })), { title: s.more.label, body: "Each customer's sizes and history on the associate's tablet.", href: s.more.href }];
  return (
    <PinnedFilm
      id="ch-instore"
      seq={sequences.counter}
      alt={s.alt}
      steps={[
        <StepText key="a" label={s.pay.label} headline={s.pay.headline} body={s.pay.body} />,
        <StepText key="b" label={s.modules.label} headline={s.modules.headline}>
          <StackList
            rows={modules.map((m) => ({
              key: m.href,
              title: (
                <Link href={m.href} className="underline-offset-4 hover:underline">
                  {m.title} →
                </Link>
              ),
              body: m.body,
            }))}
          />
        </StepText>,
      ]}
    />
  );
}
