"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Section } from "@/components/ui/Section";
import { modules } from "@/content/home";
import { focusOf, navIntro, solutionGroups, type NavGroup } from "@/content/site";

/**
 * The twelve modules in their three groups, side by side. Each group stands under one large
 * photograph cut to the hang-tag shape; pointing at a module crossfades the photograph to that
 * module, and left alone each tag drifts slowly through its modules (not under reduced motion).
 */
export function ModulesIndex() {
  return (
    <Section id="modules" tone="soft" headline={modules.headline} lead={modules.body}>
      <div className="grid gap-16 md:grid-cols-3 md:gap-6 lg:gap-10">
        {solutionGroups.map((g, i) => (
          <Group key={g.label} group={g} offset={i * 1800} />
        ))}
      </div>
    </Section>
  );
}

function Group({ group, offset }: { group: NavGroup; offset: number }) {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  // drift through the group's modules while nobody is pointing at it
  useEffect(() => {
    if (held || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      t = setInterval(() => {
        if (!document.hidden) setActive((a) => (a + 1) % group.items.length);
      }, 5600);
    }, offset);
    return () => {
      clearTimeout(start);
      clearInterval(t);
    };
  }, [held, offset, group.items.length]);

  return (
    <div className="rv flex flex-col" onPointerLeave={() => setHeld(false)}>
      <div className="tag tag-lg relative aspect-[4/3] overflow-hidden bg-studio md:aspect-square">
        {group.items.map((item, i) => (
          <Image
            key={item.slug}
            src={`/assets/sol/${item.slug}/end.webp`}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            quality={80}
            style={{ objectPosition: focusOf(item.slug) }}
            // the new photo fades in over the old one, which only leaves once covered (no ghosting)
            className={`object-cover transition-[opacity,scale] ease-[var(--ease-in-out)] ${i === active ? "z-[1] scale-100 opacity-100 duration-[1000ms]" : "z-0 scale-[1.03] opacity-0 delay-[1000ms] duration-0"}`}
          />
        ))}
      </div>
      <div className="mt-7 flex items-baseline justify-between gap-4">
        <h3 className="display text-[clamp(1.9rem,2.6vw,2.5rem)] leading-none">{group.label}</h3>
        <p className="tabular text-ink-2">{modules.count(group.items.length)}</p>
      </div>
      <p className="mt-3 max-w-[38ch] text-ink-2">{navIntro[group.label]}</p>
      <ul className="mt-6">
        {group.items.map((item, i) => {
          const on = i === active;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onPointerEnter={() => {
                  setHeld(true);
                  setActive(i);
                }}
                onFocus={() => {
                  setHeld(true);
                  setActive(i);
                }}
                className="group flex items-start gap-4 py-3"
              >
                <span aria-hidden className={`tag tag-plain mt-[0.4em] size-3.5 shrink-0 transition-colors duration-300 [--cut:5px] ${on ? "bg-accent" : "bg-ink/15"}`} />
                <span className="min-w-0 flex-1">
                  <span className={`flex items-baseline justify-between gap-3 text-[1.125rem] font-semibold tracking-tight transition-colors duration-300 ${on ? "text-accent" : ""}`}>
                    {item.label}
                    <span aria-hidden className={`transition-[translate,opacity] duration-300 ease-[var(--ease-out)] ${on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>
                      →
                    </span>
                  </span>
                  <span className="mt-0.5 block text-ink-2">{item.blurb}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
