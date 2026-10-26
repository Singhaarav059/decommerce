import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroWindow } from "@/components/media/HeroWindow";
import { SolutionHeroCards } from "./SolutionHeroCards";
import { ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { solutionBySlug, type SolutionSlug } from "@/content/site";
import { solutions } from "@/content/solutions";
import { solutionFocus } from "@/content/solutions/focus";
import { solutionMedia } from "@/content/solutions/media";
import { Anatomy } from "./Anatomy";
import { ProblemFix } from "./ProblemFix";
import { Rollout } from "./Rollout";
import { Section } from "@/components/ui/Section";
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
 * The solution template: one continuous film of the module at work (the pitch,
 * the problem, the steps ticking off), then numbered sections on the studio
 * surface: 01 problem and fix, 02 anatomy, 03 capabilities, 04 how we set it up,
 * 05 works with, 06 questions.
 */
export function SolutionPage({ slug }: { slug: SolutionSlug }) {
  const { meta, Content } = solutions[slug];
  const m = solutionMedia(slug);
  return (
    <main id="main">
      <HeroWindow
        id="film"
        seq={m.seq}
        priority
        length={2.6}
        alt={`${meta.title}: ${meta.fix.fixed}`}
        eyebrow={meta.eyebrow}
        headline={meta.headline.replace(/\*/g, "")}
        body={meta.promise}
        actions={
          <>
            <ButtonLink href="/contact-us" arrow>
              Book a demo
            </ButtonLink>
            <ButtonLink href="#anatomy" variant="secondary">
              What&rsquo;s inside
            </ButtonLink>
          </>
        }
        overlay={<SolutionHeroCards slug={slug} label={meta.title} fix={meta.fix.title} steps={meta.fix.steps} />}
      />

      <ProblemFix title={meta.title} problem={meta.problem.title} narrative={<Content />} fix={meta.fix.title} steps={meta.fix.steps} image={m.seq.pattern.replace("{i}", "000")} after={m.end} />

      <Anatomy title={meta.title} parts={meta.anatomy} src={m.end} floor={m.floor} focus={solutionFocus[slug] ?? {}} />

      <Capabilities title={meta.title} items={meta.capabilities} src={m.detail} floor={m.floor} />

      <Rollout title={meta.title} backdrop={m.detail} />

      <Section index="05" eyebrow="Works with" headline="Same catalog, same stock, same customer." lead={`${meta.title} shares its data with every other module. These are the ones it works with most closely.`}>
        <ul className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {meta.worksWith.map((s) => {
            const other = solutionBySlug(s);
            return (
              <li key={s} className="rv">
                <Link href={other.href} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-ink/5">
                    <Image src={solutionMedia(s).end} alt="" fill quality={85} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover object-[70%_50%] transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.05]" />
                  </div>
                  <p className="mt-4 flex items-center justify-between gap-3 text-[1.05rem] font-semibold">
                    {other.label}
                    <span aria-hidden className="flex size-8 items-center justify-center rounded-full text-copper shadow-[inset_0_0_0_1.5px_var(--line-strong)] transition-[background-color,color,translate] duration-300 group-hover:translate-x-0.5 group-hover:bg-ink group-hover:text-paper group-hover:shadow-none">→</span>
                  </p>
                  <p className="mt-1 text-[0.95rem] text-ink-2">{other.blurb}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section
        index="06"
        eyebrow="Questions"
        headline={`${meta.title}, answered.`}
        lead={`See ${inSentence(meta.title)} running on a sample of your own catalog.`}
        headerAside={
          <ButtonLink href="/contact-us" arrow className="mt-6">
            Book a demo
          </ButtonLink>
        }
      >
        <div className="grid lg:grid-cols-12">
          <Faq items={meta.faq} className="lg:col-span-7 lg:col-start-6" />
        </div>
      </Section>
    </main>
  );
}
