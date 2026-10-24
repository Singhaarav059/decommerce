import { StepsBand } from "@/components/ui/StepsBand";

/** A company page's step sequence, on the shared dark band over one of the store's rooms. */
export function Steps({ index, eyebrow, headline, body, steps, backdrop }: { index: string; eyebrow: string; headline: string; body?: string; steps: { title: string; body: string }[]; backdrop: string }) {
  return <StepsBand index={index} eyebrow={eyebrow} headline={headline} lead={body} steps={steps} backdrop={backdrop} />;
}
