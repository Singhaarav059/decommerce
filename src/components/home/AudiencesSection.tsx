"use client";

import Image from "next/image";
import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { audiences } from "@/content/home";
import { focusOf, type SolutionSlug } from "@/content/site";

/**
 * Who Decommerce is for, as one plate: a photograph cut as a tag on the left; on the right a row
 * of three equal tabs (the kinds of retailer), then the chosen one's title, description, what it
 * usually starts with and the two actions, all on one left edge. Photos crossfade between tabs.
 */
export function AudiencesSection() {
  const [at, setAt] = useState(0);
  const g = audiences.groups[at];
  return (
    <Section id="who-its-for" headline={audiences.headline} lead={audiences.body}>
      <div className="rv grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="tag tag-xl relative aspect-[4/3] overflow-hidden bg-studio-light lg:col-span-6 lg:aspect-square">
          {audiences.groups.map((x, i) => (
            <Image
              key={x.title}
              src={x.image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              quality={80}
              style={{ objectPosition: focusOf(x.image.split("/")[3] as SolutionSlug) }}
              className={`object-cover transition-opacity ease-[var(--ease-in-out)] ${i === at ? "z-[1] opacity-100 duration-[900ms]" : "z-0 opacity-0 delay-[900ms] duration-0"}`}
            />
          ))}
        </div>
        <div className="lg:col-span-6">
          <div role="tablist" aria-label={audiences.eyebrow} className="grid grid-cols-3 gap-1">
            {audiences.groups.map((x, i) => (
              <button
                key={x.title}
                type="button"
                role="tab"
                aria-selected={i === at}
                onClick={() => setAt(i)}
                className={`flex min-h-[68px] items-center px-4 text-left text-[0.94rem] leading-tight font-semibold transition-colors duration-300 ${i === 0 ? "tag tag-xs tag-plain" : ""} ${i === at ? "bg-ink text-paper" : "bg-studio-light text-ink hover:bg-ink/10"}`}
              >
                {x.title}
              </button>
            ))}
          </div>
          <div key={g.title} role="tabpanel" className="mt-10 animate-[slide-up_600ms_var(--ease-out)_both]">
            <h3 className="display text-[clamp(2rem,3.2vw,3rem)] leading-[1.02] tracking-[-0.03em]">{g.title}</h3>
            <p className="t-lead mt-4 max-w-[44ch] text-ink-2">{g.body}</p>
            <p className="mt-8 font-semibold">{audiences.startLabel}</p>
            <ul className="mt-3 grid gap-2.5">
              {g.points.map((p) => (
                <li key={p} className="flex items-baseline gap-3 text-[1.06rem]">
                  <span aria-hidden className="tag tag-plain size-2.5 shrink-0 bg-accent [--cut:4px]" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={g.href} arrow>
                {audiences.more}
              </ButtonLink>
              <ButtonLink href="/contact-us" variant="secondary">
                {audiences.demo}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
