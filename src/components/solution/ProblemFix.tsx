import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";

/** The page's problem in plain words, set against what changes with the module, side by side. */
export function ProblemFix({ title, problem, narrative, fix, steps }: { title: string; problem: string; narrative: ReactNode; fix: string; steps: string[] }) {
  return (
    <Section index="01" eyebrow="The problem and the fix" headline={`${title}, before and after.`}>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rv rounded-[var(--radius-lg)] p-1 lg:pr-10">
          <p className="text-[0.84rem] font-semibold text-ink-2">Today</p>
          <p className="display t-h3 mt-3">{problem.replace(/\*/g, "")}</p>
          <div className="t-lead mt-5 max-w-[48ch] text-ink-2 [&_p]:m-0 [&_p]:max-w-none [&_p]:text-ink-2">{narrative}</div>
        </div>
        <div className="rv rounded-[var(--radius-lg)] bg-paper p-6 shadow-[var(--shadow-sm)] md:p-8">
          <p className="flex items-center gap-2 text-[0.84rem] font-semibold text-copper">
            <span aria-hidden className="size-1.5 rounded-full bg-copper" />
            With Decommerce
          </p>
          <p className="display t-h3 mt-3">{fix.replace(/\*/g, "")}</p>
          <ol className="mt-6 border-t border-line">
            {steps.map((s, i) => (
              <li key={s} className="flex items-baseline gap-4 border-b border-line py-3">
                <span className="tabular text-[0.84rem] font-semibold text-copper">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
