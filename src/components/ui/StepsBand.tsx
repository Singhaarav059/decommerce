import type { ReactNode } from "react";
import { Section } from "./Section";

export type BandStep = { title: string; body: string; result?: string };

/**
 * The one design for every "how it works" sequence: a band over a pale wash of a photograph
 * of the store, four numbered steps on a copper line that draws itself as you scroll, and an
 * optional "you have" result under each step, aligned along the bottom.
 */
export function StepsBand({
  id,
  index,
  eyebrow,
  headline,
  lead,
  steps,
  backdrop,
  resultLabel = "You have",
  headerAside,
}: {
  id?: string;
  index: string;
  eyebrow: string;
  headline: string;
  lead?: string;
  steps: BandStep[];
  backdrop: string;
  resultLabel?: string;
  headerAside?: ReactNode;
}) {
  return (
    <Section id={id} index={index} eyebrow={eyebrow} headline={headline} lead={lead} tone="soft" backdrop={backdrop} headerAside={headerAside}>
      <ol className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <span aria-hidden className="absolute top-[11px] right-0 left-0 hidden h-px bg-line-strong lg:block" />
        <span aria-hidden className="line-draw absolute top-[11px] right-0 left-0 hidden h-[2px] origin-left bg-copper lg:block" />
        {steps.map((s, i) => (
          <li key={s.title} className="rv relative flex flex-col">
            <span aria-hidden className="relative z-[1] flex size-6 items-center justify-center rounded-full bg-studio-light shadow-[inset_0_0_0_1.5px_var(--copper)]">
              <span className="size-2 animate-pulse rounded-full bg-copper [animation-duration:2.4s]" style={{ animationDelay: `${i * 0.6}s` }} />
            </span>
            <p className="tabular mt-6 text-[0.84rem] font-semibold text-copper">Step {String(i + 1).padStart(2, "0")}</p>
            <h3 className="display t-h3 mt-2">{s.title}</h3>
            <p className="mt-3 mb-6 text-ink-2">{s.body}</p>
            {s.result && (
              <div className="mt-auto rounded-[var(--radius-md)] bg-paper p-4 text-[0.95rem] shadow-[var(--shadow-sm)]">
                <p className="text-[0.8rem] font-semibold text-copper">{resultLabel}</p>
                <p className="mt-1">{s.result}</p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
