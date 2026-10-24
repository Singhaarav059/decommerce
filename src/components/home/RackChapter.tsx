import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Headline } from "@/components/ui/Headline";
import { storefront } from "@/content/home";
import { Rack } from "./Rack";

/**
 * Homepage chapter 3 (storefront): the boutique wall as the section's
 * background, the interactive rack on it, the explanation on the calm side.
 */
export function RackChapter() {
  return (
    <section id="ch-storefront" className="relative overflow-hidden" style={{ background: "#ceb9a4", "--floor": "#ceb9a4" } as CSSProperties}>
      <div className="absolute inset-x-0 top-0 h-[64svh] md:inset-0 md:h-auto">
        <Image src="/assets/rack/wall.webp" alt="" fill sizes="100vw" quality={85} className="object-cover" />
        <div aria-hidden className="scrim absolute inset-0 hidden md:block" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 md:hidden" style={{ background: "linear-gradient(to bottom, transparent, #ceb9a4)" }} />
      </div>
      <div className="relative mx-auto grid min-h-[100svh] max-w-[var(--max-w)] grid-cols-1 content-center gap-8 px-[var(--gutter)] pt-[calc(var(--header-h)+24px)] pb-16 md:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] md:items-center md:gap-10 [--ink-2:var(--ink)]">
        <div className="order-2 md:order-1">
          <p className="eyebrow">{storefront.eyebrow}</p>
          <Headline as="h2" reveal text={storefront.headline} className="t-h2 mt-5" />
          <p className="t-lead mt-5 max-w-[40ch] text-ink-2">{storefront.body}</p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {storefront.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-u font-semibold text-copper">
                  {l.label} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="order-1 -mr-[var(--gutter)] md:order-2">
          <Rack />
        </div>
      </div>
    </section>
  );
}
