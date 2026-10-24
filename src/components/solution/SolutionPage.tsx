import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PinnedFilm } from "@/components/media/PinnedFilm";
import { DragFilm } from "@/components/media/DragFilm";
import { RowList, StepText } from "@/components/home/StepText";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Headline } from "@/components/ui/Headline";
import { solutionBySlug, type SolutionSlug } from "@/content/site";
import { solutions } from "@/content/solutions";
import { solutionFocus } from "@/content/solutions/focus";
import { solutionMedia } from "@/content/solutions/media";
import { Anatomy } from "./Anatomy";
import { Capabilities } from "./Capabilities";

export function solutionMetadata(slug: SolutionSlug): Metadata {
  const { meta } = solutions[slug];
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: solutionBySlug(slug).href },
    openGraph: { title: `${meta.title} · Decommerce`, description: meta.description },
  };
}

/**
 * The solution template (DESIGN-PLAN §4): hero with a drag-scrub film, the
 * problem → fix film, anatomy, capabilities, works with, questions. Every
 * visual sits in its own pane; text never overlaps it.
 */
export function SolutionPage({ slug }: { slug: SolutionSlug }) {
  const { meta, Content } = solutions[slug];
  const m = solutionMedia(slug);
  return (
    <main id="main">
      {/* 1. Hero */}
      <section className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 items-center gap-8 pt-[calc(var(--header-h)+24px)] pb-[var(--section-gap)] lg:min-h-[100svh] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10 lg:pt-[var(--header-h)]">
        <div className="order-2 px-[var(--gutter)] lg:order-1 lg:pr-0">
          <p className="eyebrow">{meta.eyebrow}</p>
          <Headline text={meta.headline} className="mt-4 text-[clamp(2.4rem,5vw,5.2rem)]" />
          <p className="mt-5 max-w-[42ch] text-ink-2">{meta.promise}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact-us" arrow>
              Book a demo
            </ButtonLink>
            <ButtonLink href="#fix" variant="secondary">
              See it work
            </ButtonLink>
          </div>
        </div>
        <DragFilm
          className="order-1 lg:order-2"
          pattern={m.seq.pattern}
          mobilePattern={m.seq.mobilePattern}
          from={m.fixedFrom}
          to={m.seq.count - 1}
          label="Drag to look around"
          alt={`${meta.title}: ${meta.fix.fixed}`}
          priority
        />
      </section>

      {/* 2–3. Problem → fix */}
      <PinnedFilm
        id="fix"
        seq={m.seq}
        alt={`${meta.title}: from ${meta.problem.broken.toLowerCase()} to ${meta.fix.fixed.toLowerCase()}`}
        steps={[
          <StepText key="p" label="The problem" headline={meta.problem.title}>
            <div className="mt-4 max-w-[40ch] text-ink-2 [&_p]:m-0 [&_p]:max-w-none [&_p]:text-ink-2">
              <Content />
            </div>
          </StepText>,
          <StepText key="f" label="The fix" headline={meta.fix.title}>
            <RowList rows={meta.fix.steps.map((s, i) => ({ key: s, left: `${i + 1}. ${s}` }))} />
          </StepText>,
        ]}
      />

      {/* 4. Anatomy */}
      <Anatomy title={meta.title} parts={meta.anatomy} still={m.still} focus={solutionFocus[slug] ?? {}} />

      {/* 5. Capabilities */}
      <Capabilities title={meta.title} items={meta.capabilities} frames={m.tabFrames} />

      {/* 6. Works with */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-[var(--section-gap)]">
          <p className="eyebrow">Works with</p>
          <Headline as="h2" text="Same catalog, same stock, same customer." className="mt-4 max-w-[20ch] text-[clamp(2.1rem,4vw,4rem)]" />
          <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {meta.worksWith.map((s) => {
              const other = solutionBySlug(s);
              return (
                <li key={s}>
                  <Link href={other.href} className="group block">
                    <div className="feather relative aspect-[4/3] overflow-hidden">
                      <Image src={solutionMedia(s).still} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]" />
                    </div>
                    <p className="mt-3 font-semibold">
                      {other.label} <span aria-hidden className="text-copper">→</span>
                    </p>
                    <p className="text-[0.95rem] text-ink-2">{other.blurb}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 7. Questions + demo */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] py-[var(--section-gap)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <p className="eyebrow">Questions</p>
            <Headline as="h2" text={`${meta.title}, answered.`} className="mt-4 text-[clamp(2.1rem,4vw,4rem)]" />
            <p className="mt-6 max-w-[40ch] text-ink-2">See {meta.title.toLowerCase()} running on a sample of your own catalog.</p>
            <ButtonLink href="/contact-us" arrow className="mt-6">
              Book a demo
            </ButtonLink>
          </div>
          <Faq items={meta.faq} />
        </div>
      </section>
    </main>
  );
}
