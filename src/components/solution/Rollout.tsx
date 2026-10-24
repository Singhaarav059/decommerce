import { Section } from "@/components/ui/Section";
import { rollout } from "@/content/site";
import { inSentence } from "@/lib/text";

/** The service around the module: four rollout steps and what every engagement includes. */
export function Rollout({ title, index = "04" }: { title: string; index?: string }) {
  const x = inSentence(title);
  return (
    <Section
      index={index}
      eyebrow={rollout.eyebrow}
      headline={rollout.headline}
      headerAside={
        <ul className="flex flex-wrap gap-2">
          {rollout.included.map((i) => (
            <li key={i} className="rounded-full px-3.5 py-1.5 text-[0.88rem] shadow-[inset_0_0_0_1px_var(--line-strong)]">
              {i}
            </li>
          ))}
        </ul>
      }
    >
      <ol className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <span aria-hidden className="absolute top-[11px] right-0 left-0 hidden h-px bg-line-strong lg:block" />
        <span aria-hidden className="line-draw absolute top-[11px] right-0 left-0 hidden h-[2px] origin-left bg-copper lg:block" />
        {rollout.steps.map((s, i) => (
          <li key={s.title} className="rv relative">
            <span aria-hidden className="relative z-[1] flex size-6 items-center justify-center rounded-full bg-studio shadow-[inset_0_0_0_1.5px_var(--copper)]">
              <span className="size-2 rounded-full bg-copper" />
            </span>
            <p className="tabular mt-6 text-[0.84rem] font-semibold text-copper">Step {String(i + 1).padStart(2, "0")}</p>
            <h3 className="display t-h3 mt-2">{s.title}</h3>
            <p className="mt-3 text-ink-2">{s.body.replace("{x}", x)}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
