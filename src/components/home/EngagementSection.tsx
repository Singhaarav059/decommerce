import { StepsBand } from "@/components/ui/StepsBand";
import { engagement } from "@/content/home";

/** How an engagement runs: four steps and what you have at the end of each. */
export function EngagementSection({ index = "08" }: { index?: string }) {
  return (
    <StepsBand
      id="how-we-work"
      index={index}
      eyebrow={engagement.eyebrow}
      headline={engagement.headline}
      lead={engagement.body}
      backdrop="/assets/company/scene-contact-us.webp"
      steps={engagement.steps.map((s) => ({ title: s.title, body: s.body, result: s.result }))}
    />
  );
}
