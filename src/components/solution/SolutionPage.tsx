import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PinnedFilm } from "@/components/media/PinnedFilm";
import { FilmRows } from "@/components/media/FilmRows";
import { StepText } from "@/components/home/StepText";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Headline } from "@/components/ui/Headline";
import { solutionBySlug, type SolutionSlug } from "@/content/site";
import { solutions } from "@/content/solutions";
import { solutionFocus } from "@/content/solutions/focus";
import { solutionMedia } from "@/content/solutions/media";
import { Anatomy } from "./Anatomy";
import { Capabilities } from "./Capabilities";
import { inSentence } from "@/lib/text";

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
 * The solution template (DESIGN-PLAN §10): every section is a full-bleed real
 * place. 1. One continuous film of the product at work: the pitch, the
 * problem, then the steps ticking off as they happen. 2. Anatomy on the
 * finished scene. 3. Capabilities on a close-up. 4. Works with. 5. Questions.
 */
export function SolutionPage({ slug }: { slug: SolutionSlug }) {
  const { meta, Content } = solutions[slug];
  const m = solutionMedia(slug);
  const n = meta.fix.steps.length;
  return (
    <main id="main">
      <PinnedFilm
        id="film"
        seq={m.seq}
        floor={m.floor}
        priority
        length={1 + 3 * 0.9}
        alt={`${meta.title}: ${meta.fix.fixed}`}
        steps={[
          {
            from: 0,
            to: 0.24,
            node: (
              <>
                <p className="eyebrow">{meta.eyebrow}</p>
                <Headline text={meta.headline} className="mt-2 text-[clamp(2rem,5vw,5.2rem)] md:mt-4" />
                <p className="mt-3 max-w-[42ch] text-[0.95rem] leading-snug text-ink-2 md:mt-5 md:text-base md:leading-normal">{meta.promise}</p>
                <div className="mt-5 flex flex-wrap gap-3 md:mt-8">
                  <ButtonLink href="/contact-us" arrow>
                    Book a demo
                  </ButtonLink>
                  <ButtonLink href="#anatomy" variant="secondary">
                    What&rsquo;s inside
                  </ButtonLink>
                </div>
              </>
            ),
          },
          {
            from: 0.28,
            to: 0.46,
            node: (
              <StepText label="The problem" headline={meta.problem.title}>
                <div className="mt-2 max-w-[40ch] text-[0.95rem] leading-snug text-ink-2 md:mt-4 md:text-base md:leading-normal [&_p]:m-0 [&_p]:max-w-none [&_p]:text-ink-2">
                  <Content />
                </div>
              </StepText>
            ),
          },
          {
            from: 0.5,
            to: 1,
            node: (
              <StepText label="With Decommerce" headline={meta.fix.title}>
                <FilmRows rows={meta.fix.steps} from={0.5} to={0.5 + 0.5 * (n / (n + 0.4))} />
              </StepText>
            ),
          },
        ]}
      />

      <Anatomy title={meta.title} parts={meta.anatomy} src={m.end} floor={m.floor} focus={solutionFocus[slug] ?? {}} />

      <Capabilities title={meta.title} items={meta.capabilities} src={m.detail} floor={m.floor} />

      {/* Works with */}
      <section style={{ background: m.floor }}>
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-[var(--section-gap)] [--ink-2:var(--ink)]">
          <p className="eyebrow">Works with</p>
          <Headline as="h2" text="Same catalog, same stock, same customer." className="mt-4 max-w-[20ch] text-[clamp(1.8rem,4vw,4rem)]" />
          <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {meta.worksWith.map((s) => {
              const other = solutionBySlug(s);
              return (
                <li key={s}>
                  <Link href={other.href} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)]">
                      <Image src={solutionMedia(s).end} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover object-[70%_50%] transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]" />
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

      {/* Questions + demo */}
      <section className="border-t border-ink/10" style={{ background: m.floor }}>
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] py-[var(--section-gap)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] [--ink-2:var(--ink)]">
          <div>
            <p className="eyebrow">Questions</p>
            <Headline as="h2" text={`${meta.title}, answered.`} className="mt-4 text-[clamp(1.8rem,4vw,4rem)]" />
            <p className="mt-6 max-w-[40ch] text-ink-2">See {inSentence(meta.title)} running on a sample of your own catalog.</p>
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
