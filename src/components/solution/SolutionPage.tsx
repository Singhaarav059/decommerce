import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Headline } from "@/components/ui/Headline";
import { solutionPoster } from "@/content/media";
import { solutionBySlug, type SolutionSlug } from "@/content/site";
import { solutions } from "@/content/solutions";
import { Inside } from "./Inside";
import { ProblemFix } from "./ProblemFix";
import { SolutionHero } from "./SolutionHero";

export function solutionMetadata(slug: SolutionSlug): Metadata {
  const { meta } = solutions[slug];
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: solutionBySlug(slug).href },
    openGraph: { title: `${meta.title} · Decommerce`, description: meta.description },
  };
}

/** The seven-block solution template (PLAN): hero, problem, fix, anatomy, capabilities, works with, FAQ + CTA. */
export function SolutionPage({ slug }: { slug: SolutionSlug }) {
  const { meta, Content } = solutions[slug];
  return (
    <main id="main">
      <SolutionHero meta={meta} />
      <ProblemFix meta={meta}>
        <Content />
      </ProblemFix>
      <Inside meta={meta} />

      {/* 6. Works with */}
      <section className="relative z-10 border-t border-line">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-20 md:py-28">
          <p className="eyebrow">Works with</p>
          <Headline as="h2" text="Same catalog, same stock, *same customer*." className="mt-3 max-w-[18ch] text-[clamp(2.2rem,4.6vw,3.6rem)]" />
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {meta.worksWith.map((s) => {
              const other = solutionBySlug(s);
              return (
                <li key={s}>
                  <Link href={other.href} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-travertine">
                      <Image
                        src={solutionPoster(s).desktop}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                      />
                    </div>
                    <p className="mt-3 flex items-center justify-between font-medium">
                      {other.label}
                      <span aria-hidden className="text-copper-ink transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </p>
                    <p className="text-sm text-ink-muted">{other.blurb}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 7. FAQ + CTA */}
      <section className="relative z-10 border-t border-line">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] py-20 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <p className="eyebrow">Questions</p>
            <Headline as="h2" text={`${meta.title}, *answered*.`} className="mt-3 text-[clamp(2.2rem,4.6vw,3.6rem)]" />
            <div className="mt-8 rounded-[var(--radius-lg)] bg-ink p-7 text-stone-50">
              <p className="display text-3xl">See {meta.title.toLowerCase()} on your catalog.</p>
              <ButtonLink href="/contact-us" variant="secondary" arrow className="mt-6 !text-stone-50 !shadow-[inset_0_0_0_1px_var(--stone-50)] hover:!bg-stone-50 hover:!text-ink">
                Book a demo
              </ButtonLink>
            </div>
          </div>
          <Faq items={meta.faq} />
        </div>
      </section>
    </main>
  );
}
