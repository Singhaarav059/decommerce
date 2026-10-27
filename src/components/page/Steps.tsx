import { StepsBand } from "@/components/ui/StepsBand";
import type { StepGraphicKind } from "@/components/ui/StepGraphic";

/** A company page's step sequence, as the shared row of tinted panels. */
export function Steps({ headline, body, steps, graphics }: { eyebrow?: string; headline: string; body?: string; steps: { title: string; body: string }[]; graphics?: StepGraphicKind[] }) {
  return <StepsBand headline={headline} lead={body} steps={steps} graphics={graphics} />;
}
