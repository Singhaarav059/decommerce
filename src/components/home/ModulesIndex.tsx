"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { modules } from "@/content/home";
import { moduleScreens, solutionGroups } from "@/content/site";

/**
 * Every module as one numbered index, grouped by where it works. Desktop: hovering or focusing
 * a row swaps the photograph beside the list. Phones: each row carries its own thumbnail.
 */
export function ModulesIndex() {
  const all = solutionGroups.flatMap((g) => g.items);
  const [active, setActive] = useState(all[0].slug!);
  const current = all.find((i) => i.slug === active)!;
  let n = 0;
  return (
    <Section id="modules" index="04" tone="soft" eyebrow={modules.eyebrow} headline={modules.headline} lead={modules.body}>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {solutionGroups.map((g) => (
            <div key={g.label} className="mb-10 last:mb-0">
              <p className="mb-3 text-[0.84rem] font-semibold text-ink-2">{g.label}</p>
              <ul className="border-t border-line">
                {g.items.map((item) => {
                  n++;
                  const on = item.slug === active;
                  return (
                    <li key={item.href} className="border-b border-line">
                      <Link
                        href={item.href}
                        onPointerEnter={() => setActive(item.slug!)}
                        onFocus={() => setActive(item.slug!)}
                        className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-4 md:grid-cols-[3rem_minmax(0,14rem)_1fr_auto]"
                      >
                        <span className={`tabular text-[0.84rem] transition-colors ${on ? "text-copper" : "text-ink-2"}`}>{String(n).padStart(2, "0")}</span>
                        <span className={`display text-[clamp(1.25rem,2vw,1.6rem)] transition-[color,translate] duration-300 ease-[var(--ease-out)] group-hover:translate-x-1 ${on ? "text-copper" : ""}`}>{item.label}</span>
                        <span className="hidden text-[0.92rem] text-ink-2 md:block">{item.blurb}</span>
                        <span aria-hidden className={`flex size-8 items-center justify-center rounded-full transition-[background-color,color] duration-300 ${on ? "bg-ink text-paper" : "text-ink-2 shadow-[inset_0_0_0_1.5px_var(--line-strong)]"}`}>
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div aria-hidden className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-[calc(var(--header-h)+24px)]">
            <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-ink/5">
              {all.map((item) => (
                <Image
                  key={item.slug}
                  src={`/assets/sol/${item.slug}/end.webp`}
                  alt=""
                  fill
                  sizes="40vw"
                  quality={85}
                  className={`object-cover object-[78%_50%] transition-[opacity,scale] duration-700 ease-[var(--ease-out)] ${item.slug === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"}`}
                />
              ))}
            </div>
            {/* an example screen of the module, floating over its photo */}
            <div key={`ui-${current.slug}`} className="absolute top-5 right-5 w-[230px] animate-[rise_600ms_var(--ease-out)_both] rounded-[var(--radius-lg)] bg-paper/95 p-4 shadow-[0_24px_48px_-16px_rgb(27_25_21/0.4)] ring-1 ring-black/5">
              <div className="flex items-center justify-between text-[0.72rem] text-ink-2">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="size-1.5 animate-pulse rounded-full bg-copper-bright" />
                  {current.label}
                </span>
                <span>Example</span>
              </div>
              <p className="display mt-2 text-[1.25rem] leading-none">{moduleScreens[current.slug!].title}</p>
              <dl className="mt-3 divide-y divide-line text-[0.8rem]">
                {moduleScreens[current.slug!].rows.map(([k, v], i) => (
                  <div key={k} className="flex animate-[rise_500ms_var(--ease-out)_both] justify-between gap-3 py-1.5" style={{ animationDelay: `${200 + i * 120}ms` }}>
                    <dt className="text-ink-2">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            </div>
            <p key={current.slug} className="mt-5 animate-[rise_500ms_var(--ease-out)_both]">
              <span className="block font-semibold">{current.label}</span>
              <span className="text-ink-2">{current.blurb}</span>
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
