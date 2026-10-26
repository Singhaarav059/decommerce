import { StepsBand } from "@/components/ui/StepsBand";

/** A company page's step sequence, as the shared row of tinted panels. */
export function Steps({ headline, body, steps, backdrop }: { eyebrow?: string; headline: string; body?: string; steps: { title: string; body: string }[]; backdrop: string }) {
  return <StepsBand headline={headline} lead={body} steps={steps} backdrop={backdrop} />;
}
