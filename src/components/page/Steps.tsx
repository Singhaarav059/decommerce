import { Section } from "@/components/ui/Section";

/** A numbered row of steps on a line that draws itself, used by company pages. */
export function Steps({ index, eyebrow, headline, body, steps }: { index: string; eyebrow: string; headline: string; body?: string; steps: { title: string; body: string }[] }) {
  return (
    <Section index={index} eyebrow={eyebrow} headline={headline} lead={body}>
      <ol className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <span aria-hidden className="absolute top-[11px] right-0 left-0 hidden h-px bg-line-strong lg:block" />
        <span aria-hidden className="line-draw absolute top-[11px] right-0 left-0 hidden h-[2px] origin-left bg-copper lg:block" />
        {steps.map((s, i) => (
          <li key={s.title} className="rv relative">
            <span aria-hidden className="relative z-[1] flex size-6 items-center justify-center rounded-full bg-studio shadow-[inset_0_0_0_1.5px_var(--copper)]">
              <span className="size-2 rounded-full bg-copper" />
            </span>
            <p className="tabular mt-6 text-[0.84rem] font-semibold text-copper">Step {String(i + 1).padStart(2, "0")}</p>
            <h3 className="display t-h3 mt-2">{s.title}</h3>
            <p className="mt-3 text-ink-2">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
