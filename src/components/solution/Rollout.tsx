import { StepsBand } from "@/components/ui/StepsBand";
import { rollout } from "@/content/site";
import { inSentence } from "@/lib/text";

/** The service around the module: four rollout steps and what every engagement includes. */
export function Rollout({ title, backdrop }: { title: string; backdrop: string }) {
  const x = inSentence(title);
  return (
    <StepsBand
      eyebrow={rollout.eyebrow}
      headline={rollout.headline}
      backdrop={backdrop}
      headerAside={
        <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {rollout.included.map((i) => (
            <li key={i} className="flex items-center gap-3 text-ink">
              <span aria-hidden className="tag tag-plain size-3 shrink-0 bg-copper [--cut:5px]" />
              {i}
            </li>
          ))}
        </ul>
      }
      steps={rollout.steps.map((s) => ({ title: s.title, body: s.body.replace("{x}", x) }))}
    />
  );
}
