"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import { modules } from "@/content/home";
import { moduleScreens, solutionGroups, type SolutionSlug } from "@/content/site";

const STEP = 360 / 12; // degrees between cards on the ring

/**
 * Every module as one numbered index, grouped by where it works. Desktop: beside the list the
 * twelve module photos stand on a 3D ring that turns as the list scrolls past and swings to
 * any module hovered or focused, with that module's example screen under the front card.
 * Phones: the list alone.
 */
export function ModulesIndex() {
  const all = solutionGroups.flatMap((g) => g.items);
  const [active, setActive] = useState(all[0].slug!);
  const [angle, setAngle] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const hovered = useRef(0);
  const current = all.find((i) => i.slug === active)!;
  const idx = all.findIndex((i) => i.slug === active);

  // turn the ring the short way round to the chosen card
  const turnTo = (slug: SolutionSlug) => {
    const to = all.findIndex((i) => i.slug === slug);
    setActive(slug);
    setAngle((a) => {
      const from = Math.round(-a / STEP);
      let d = (to - from) % 12;
      if (d > 6) d -= 12;
      if (d < -6) d += 12;
      return a - d * STEP;
    });
  };
  // `at` is the event's timeStamp (same clock as performance.now)
  const pick = (slug: SolutionSlug, at: number) => {
    hovered.current = at;
    turnTo(slug);
  };

  // scrolling through the list turns the ring module by module (a recent hover wins)
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let raf = 0;
    let last = -1;
    const update = () => {
      if (performance.now() - hovered.current < 1600) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(0.999, Math.max(0, (innerHeight * 0.5 - r.top) / r.height));
      const i = Math.floor(p * all.length);
      if (i !== last) {
        last = i;
        turnTo(all[i].slug!);
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let n = 0;
  return (
    <Section id="modules" index="04" tone="soft" headlineMedia={{ after: 1, srcs: ["/assets/sol/storefront/end.webp", "/assets/sol/wms/end.webp", "/assets/sol/pos/end.webp"] }} eyebrow={modules.eyebrow} headline={modules.headline} lead={modules.body}>
      <div className="grid gap-12 lg:grid-cols-12">
        <div ref={listRef} className="lg:col-span-7">
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
                        onPointerEnter={(e) => pick(item.slug!, e.timeStamp)}
                        onFocus={(e) => pick(item.slug!, e.timeStamp)}
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
            {/* the ring */}
            <div className="relative aspect-[5/6] overflow-hidden rounded-[var(--radius-xl)] bg-paper ring-1 ring-black/5 [perspective:1300px]">
              <div className="ring-turn absolute inset-0 [transform-style:preserve-3d]" style={{ transform: `translateZ(-380px) rotateY(${angle}deg)` }}>
                {all.map((item, i) => {
                  // how far round the ring this card is from the front (0 to 180 degrees)
                  const off = Math.abs(((((i * STEP + angle) % 360) + 540) % 360) - 180);
                  return (
                    <div
                      key={item.slug}
                      className="absolute top-[16%] left-1/2 aspect-[3/4] w-[44%] -translate-x-1/2 overflow-hidden rounded-[var(--radius-lg)] bg-studio-light shadow-[var(--shadow-md)] [backface-visibility:hidden]"
                      style={{ transform: `rotateY(${i * STEP}deg) translateZ(380px)`, opacity: Math.max(0.12, 1 - off / 140), transition: "opacity 600ms" }}
                    >
                      <Image src={`/assets/sol/${item.slug}/end.webp`} alt="" fill sizes="260px" quality={75} className="object-cover object-[75%_50%]" />
                      <span className="absolute inset-x-2 bottom-2 rounded-full bg-paper/95 px-3 py-1.5 text-center text-[0.78rem] font-semibold">{item.label}</span>
                    </div>
                  );
                })}
              </div>
              {/* the front module's example screen */}
              <div key={`ui-${current.slug}`} className="absolute inset-x-5 bottom-5 animate-[rise_600ms_var(--ease-out)_both] rounded-[var(--radius-lg)] bg-paper/95 p-4 shadow-[var(--shadow-md)] ring-1 ring-black/5">
                <div className="flex items-center justify-between text-[0.72rem] text-ink-2">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="size-1.5 animate-pulse rounded-full bg-copper-bright" />
                    <span className="tabular">{String(idx + 1).padStart(2, "0")}</span> {current.label}
                  </span>
                  <span>Example</span>
                </div>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <p className="display text-[1.25rem] leading-none">{moduleScreens[current.slug!].title}</p>
                  <dl className="flex gap-4 text-right text-[0.78rem]">
                    {moduleScreens[current.slug!].rows.map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-ink-2">{k}</dt>
                        <dd className="font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
