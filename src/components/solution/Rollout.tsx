import { StepsBand } from "@/components/ui/StepsBand";
import { rollout } from "@/content/site";
import { inSentence } from "@/lib/text";

/** The service around the module: four rollout steps and what every engagement includes. */
export function Rollout({ title, backdrop, index = "04" }: { title: string; backdrop: string; index?: string }) {
  const x = inSentence(title);
  return (
    <StepsBand
      index={index}
      eyebrow={rollout.eyebrow}
      headline={rollout.headline}
      backdrop={backdrop}
      headerAside={
        <ul className="flex flex-wrap gap-2">
          {rollout.included.map((i) => (
            <li key={i} className="rounded-full px-3.5 py-1.5 text-[0.88rem] shadow-[inset_0_0_0_1px_var(--line-strong)]">
              {i}
            </li>
          ))}
        </ul>
      }
      steps={rollout.steps.map((s) => ({ title: s.title, body: s.body.replace("{x}", x) }))}
    />
  );
}
