import { StepsBand } from "@/components/ui/StepsBand";
import { engagement } from "@/content/home";

/** How an engagement runs: four steps and what you have at the end of each. */
export function EngagementSection() {
  return (
    <StepsBand
      id="how-we-work"
      eyebrow={engagement.eyebrow}
      headline={engagement.headline}
      lead={engagement.body}
      backdrop="/assets/company/scene-contact-us.webp"
      images={["/assets/company/scene-contact-us.webp", "/assets/company/scene-office.webp", "/assets/company/scene-infrastructure.webp", "/assets/company/scene-partners.webp"]}
      steps={engagement.steps.map((s) => ({ title: s.title, body: s.body, result: s.result }))}
    />
  );
}
