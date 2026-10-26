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
import { FeaturesSection } from "./FeaturesSection";
import { features, connects } from "@/content/solutions/features";
import { AskAi } from "@/components/ui/AskAi";
import { DemoForm } from "@/components/forms/DemoForm";
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
 * surface: 01 problem and fix, 02 anatomy, 03 what's included (features and connections),
 * 04 how we set it up, 05 works with, 06 questions (and ask an AI), 07 book a demo.
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

      <FeaturesSection title={meta.title} features={features[slug]} connects={connects[slug]} image={m.detail} />

      <Rollout title={meta.title} backdrop={m.detail} />

      <Section eyebrow="Works with" headline="Same catalog, same stock, same customer." lead={`${meta.title} shares its data with every other module. These are the ones it works with most closely.`}>
        <ul className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {meta.worksWith.map((s) => {
            const other = solutionBySlug(s);
            return (
              <li key={s} className="rv">
                <Link href={other.href} className="group block">
                  <div className="tag tag-lg relative aspect-[4/3] overflow-hidden bg-ink/5">
                    <Image src={solutionMedia(s).end} alt="" fill quality={85} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover object-[70%_50%] transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.05]" />
                    <span className="tag tag-xs tag-plain absolute right-3 bottom-3 flex items-center gap-2 bg-paper py-1.5 pr-3 pl-4 text-[0.8125rem] font-semibold">
                      <span aria-hidden className="tag tag-plain size-2.5 bg-copper [--cut:4px]" />
                      Shares catalog and stock
                    </span>
                  </div>
                  <p className="mt-4 flex items-center justify-between gap-3 text-[1.05rem] font-semibold">
                    {other.label}
                    <span aria-hidden className="text-copper transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </p>
                  <p className="mt-1 text-ink-2">{other.blurb}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section
       
        tone="soft"
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
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={meta.faq} />
            <AskAi className="mt-10" prompt={`What is ${meta.title} in Decommerce (unified commerce from Demaze Technologies)? What does it do and what does it connect to?`} />
          </div>
        </div>
      </Section>

      <Section id="demo" eyebrow="Book a demo" headline={`See ${inSentence(meta.title)} on your catalog.`} lead="Tell us what you sell and where. We usually reply within one working day and show you a working setup on a sample of your own products." layout="split">
        <DemoForm className="rv tag tag-lg tag-plain bg-studio-light p-6 pt-12 md:p-10 md:pt-16" />
      </Section>
    </main>
  );
}
