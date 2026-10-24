"use client";

import Link from "next/link";
import { FilmStep } from "@/components/media/FilmStep";
import { ScrollSequence } from "@/components/media/ScrollSequence";
import { Headline } from "@/components/ui/Headline";
import { filmPane, textColumn } from "@/components/layout/split";
import { storefront } from "@/content/home";
import { sequences } from "@/content/media";

/**
 * Homepage chapter 4: the rail in the boutique (the catalog), then the laptop
 * on the counter showing the same garments as a web shop (the storefront).
 */
export function StorefrontChapter() {
  return (
    <div id="ch-storefront" className="relative">
      <ScrollSequence {...sequences.storefront} length={2.4} stillFrame={0} defer alt={storefront.alt} frameClassName={filmPane("4:3")}>
        <div className={textColumn("4:3")}>
          <div className="grid">
            <FilmStep from={0} to={0.47}>
              <p className="eyebrow">{storefront.catalog.eyebrow}</p>
              <Headline as="h2" text={storefront.catalog.headline} className="mt-4 text-[clamp(2.2rem,4.2vw,4.2rem)]" />
              <p className="mt-4 max-w-[40ch] text-ink-2">{storefront.catalog.body}</p>
            </FilmStep>
            <FilmStep from={0.53} to={1}>
              <p className="eyebrow">{storefront.eyebrow}</p>
              <Headline as="h2" text={storefront.headline} className="mt-4 text-[clamp(2.2rem,4.2vw,4.2rem)]" />
              <p className="mt-4 max-w-[40ch] text-ink-2">{storefront.body}</p>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {storefront.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="font-semibold text-copper underline-offset-4 hover:underline">
                      {l.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </FilmStep>
          </div>
        </div>
      </ScrollSequence>
    </div>
  );
}
