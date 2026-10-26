"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { audiences } from "@/content/home";

/**
 * Who Decommerce is for, as one plate: a square photograph cut as a tag on the left, and on the
 * right three plain text tabs (the kinds of retailer), the chosen one's description and what it
 * usually starts with, and two filled action cells along the bottom. Photos crossfade.
 */
export function AudiencesSection() {
  const [at, setAt] = useState(0);
  const g = audiences.groups[at];
  return (
    <Section id="who-its-for" headlineMedia={{ after: 3, srcs: audiences.groups.map((x) => x.image) }} headline={audiences.headline} lead={audiences.body}>
      <div className="rv grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-16">
        <div className="tag tag-xl relative aspect-square overflow-hidden bg-studio-light">
          {audiences.groups.map((x, i) => (
            <Image
              key={x.title}
              src={x.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={80}
              className={`object-cover object-[72%_50%] transition-opacity duration-[1200ms] ease-[var(--ease-in-out)] ${i === at ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
        <div className="flex flex-col justify-between gap-10">
          <div role="tablist" aria-label={audiences.eyebrow} className="flex flex-wrap gap-x-7 gap-y-2">
            {audiences.groups.map((x, i) => (
              <button
                key={x.title}
                type="button"
                role="tab"
                aria-selected={i === at}
                onClick={() => setAt(i)}
                className={`py-1 text-left text-[1.06rem] font-semibold transition-colors duration-300 md:text-[1.125rem] ${i === at ? "text-copper" : "text-ink-2 hover:text-ink"}`}
              >
                {x.title}
              </button>
            ))}
          </div>
          <div key={g.title} role="tabpanel" className="animate-[slide-up_600ms_var(--ease-out)_both]">
            <h3 className="display text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.02] tracking-[-0.03em]">{g.title}</h3>
            <p className="t-lead mt-5 max-w-[36ch] text-ink-2">{g.body}</p>
            <p className="mt-10 text-[0.94rem] font-semibold">{audiences.startLabel}</p>
            <ul className="mt-3 space-y-2.5">
              {g.points.map((p) => (
                <li key={p} className="flex items-baseline gap-3 text-[1.06rem]">
                  <span aria-hidden className="tag tag-plain size-2.5 shrink-0 bg-copper [--cut:4px]" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <Link href={g.href} className="tag tag-sm tag-plain flex h-[72px] items-center justify-between bg-ink px-6 font-semibold text-paper transition-colors hover:bg-copper">
              {audiences.more}
              <span aria-hidden>→</span>
            </Link>
            <Link href="/contact-us" className="flex h-[72px] items-center justify-between bg-studio-light px-6 font-semibold transition-colors hover:bg-ink hover:text-paper">
              {audiences.demo}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
