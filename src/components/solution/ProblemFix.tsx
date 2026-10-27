import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { ChannelSync } from "@/components/ui/ChannelSync";
import { Check } from "@/components/ui/Check";

/**
 * The page's problem in plain words, set against what changes with the module, side by side. Drawn,
 * not photographed (the hero film already shows both scenes): today the channels keep their own
 * counts and drift apart; with Decommerce they read one, and the fix's steps check off in turn.
 */
export function ProblemFix({ title, problem, narrative, fix, steps }: { title: string; problem: string; narrative: ReactNode; fix: string; steps: string[] }) {
  return (
    <Section eyebrow="The problem and the fix" headline={`${title}, before and after.`}>
      <div className="grid items-stretch gap-5 lg:grid-cols-2">
        <div className="rv flex flex-col p-1 lg:pr-10">
          <p className="text-[0.84rem] font-semibold text-ink-2">Today</p>
          <p className="display t-h3 mt-3">{problem.replace(/\*/g, "")}</p>
          <div className="t-lead mt-5 max-w-[48ch] text-ink-2 [&_p]:m-0 [&_p]:max-w-none [&_p]:text-ink-2">{narrative}</div>
          <ChannelSync synced={false} className="mt-auto pt-10" />
        </div>
        <div className="rv tag tag-lg flex flex-col bg-studio-light p-6 pt-12 md:p-8 md:pt-14">
          <p className="flex items-center gap-2 text-[0.84rem] font-semibold text-accent">
            <span aria-hidden className="tag size-2.5 [--cut:4px] bg-accent" />
            With Decommerce
          </p>
          <p className="display t-h3 mt-3">{fix.replace(/\*/g, "")}</p>
          <ol className="mt-6">
            {steps.map((s, i) => (
              <li key={s} className="rv-step flex items-center gap-4 py-2.5" style={{ "--i": i } as React.CSSProperties}>
                <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-[0.8125rem] text-paper">
                  <Check />
                </span>
                {s}
              </li>
            ))}
          </ol>
          <ChannelSync synced className="mt-auto pt-8" />
        </div>
      </div>
    </Section>
  );
}
