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
  const n = meta.fix.steps.length;
  return (
    <main id="main">
      <PinnedFilm
        id="film"
        seq={m.seq}
        floor={m.floor}
        priority
        length={2.8}
        alt={`${meta.title}: ${meta.fix.fixed}`}
        steps={[
          {
            from: 0,
            to: 0.24,
            node: (
              <>
                <p className="eyebrow">{meta.eyebrow}</p>
                <Headline text={meta.headline} className="t-hero mt-3 md:mt-5" />
                <p className="mt-3 max-w-[42ch] t-step text-ink-2 md:mt-6">{meta.promise}</p>
                <div className="mt-5 flex flex-wrap gap-3 md:mt-9">
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
                <div className="mt-3 max-w-[42ch] t-step text-ink-2 md:mt-5 [&_p]:m-0 [&_p]:max-w-none [&_p]:text-ink-2">
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

      <ProblemFix title={meta.title} problem={meta.problem.title} narrative={<Content />} fix={meta.fix.title} steps={meta.fix.steps} />

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
