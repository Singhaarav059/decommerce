import { Section } from "@/components/ui/Section";
import { engagement } from "@/content/home";

/** The four steps of an engagement on a line that draws itself as you scroll, each with what you have at the end. */
export function EngagementSection({ index = "04" }: { index?: string }) {
  return (
    <Section id="how-we-work" index={index} eyebrow={engagement.eyebrow} headline={engagement.headline} lead={engagement.body}>
      <ol className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* the line through the step markers; it fills with copper as the section scrolls through */}
        <span aria-hidden className="absolute top-[11px] right-0 left-0 hidden h-px bg-line-strong lg:block" />
        <span aria-hidden className="line-draw absolute top-[11px] right-0 left-0 hidden h-[2px] origin-left bg-copper lg:block" />
        {engagement.steps.map((s) => (
          <li key={s.n} className="rv relative flex flex-col">
            <span aria-hidden className="relative z-[1] flex size-6 items-center justify-center rounded-full bg-studio shadow-[inset_0_0_0_1.5px_var(--copper)]">
              <span className="size-2 rounded-full bg-copper" />
            </span>
            <p className="tabular mt-6 text-[0.84rem] font-semibold text-copper">Step {s.n}</p>
            <h3 className="display t-h3 mt-2">{s.title}</h3>
            <p className="mt-3 mb-5 text-ink-2">{s.body}</p>
            <div className="mt-auto rounded-[var(--radius-md)] bg-paper p-4 text-[0.95rem]">
              <p className="text-[0.8rem] font-semibold text-ink-2">You have</p>
              <p className="mt-1">{s.result}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
