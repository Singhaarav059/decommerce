"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { companyGroup, navImage, focusOf } from "@/content/site";

/** The other company pages as a row of photographs, so no company page is a dead end. */
export function Related() {
  const path = usePathname();
  const items = companyGroup.items.filter((i) => i.href !== path).slice(0, 4);
  return (
    <section aria-labelledby="related" className="bg-studio">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pb-[var(--section-gap)]">
        <div className="flex items-end justify-between gap-6 pt-6">
          <h2 id="related" className="text-[0.875rem] font-semibold">More about Decommerce</h2>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-5">
          {items.map((i) => (
            <li key={i.href} className="rv">
              <Link href={i.href} className="group block">
                <span className="tag tag-sm relative block aspect-[4/3] overflow-hidden bg-ink/5">
                  <Image src={navImage(i)} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" style={{ objectPosition: focusOf(i.slug) }} className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.05]" />
                </span>
                <span className="mt-3 flex items-center justify-between gap-3 font-semibold">
                  {i.label}
                  <span aria-hidden className="text-copper transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
                <span className="mt-0.5 block text-[0.92rem] text-ink-2">{i.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
