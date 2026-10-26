import Image from "next/image";
import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";

/** The page's problem in plain words, set against what changes with the module, side by side. */
export function ProblemFix({ title, problem, narrative, fix, steps, image, after }: { title: string; problem: string; narrative: ReactNode; fix: string; steps: string[]; image: string; after: string }) {
  return (
    <Section eyebrow="The problem and the fix" headline={`${title}, before and after.`}>
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <div className="rv rounded-[var(--radius-lg)] p-1 lg:pr-10">
          <p className="text-[0.84rem] font-semibold text-ink-2">Today</p>
          <p className="display t-h3 mt-3">{problem.replace(/\*/g, "")}</p>
          <div className="t-lead mt-5 max-w-[48ch] text-ink-2 [&_p]:m-0 [&_p]:max-w-none [&_p]:text-ink-2">{narrative}</div>
          <div className="rv-media mt-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] bg-ink/5">
              <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 45vw" quality={80} className="object-cover object-right grayscale-[35%]" />
              <span className="absolute top-3 left-3 tag tag-xs tag-plain bg-paper py-1 pr-3 pl-4 text-[0.8125rem] font-semibold">Before</span>
            </div>
          </div>
        </div>
        <div className="rv tag tag-lg tag-plain bg-studio-light p-6 pt-12 md:p-8 md:pt-14">
          <p className="flex items-center gap-2 text-[0.84rem] font-semibold text-accent">
            <span aria-hidden className="tag tag-plain size-2.5 [--cut:4px] bg-accent" />
            With Decommerce
          </p>
          <p className="display t-h3 mt-3">{fix.replace(/\*/g, "")}</p>
          <ol className="mt-6">
            {steps.map((s) => (
              <li key={s} className="flex items-baseline gap-4 py-3">
                {s}
              </li>
            ))}
          </ol>
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-[var(--radius-md)] bg-ink/5">
            <Image src={after} alt="" fill sizes="(max-width: 1024px) 100vw, 45vw" quality={80} className="object-cover object-right" />
            <span className="absolute top-3 left-3 tag tag-xs tag-plain bg-paper py-1 pr-3 pl-4 text-[0.8125rem] font-semibold text-accent">After</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
