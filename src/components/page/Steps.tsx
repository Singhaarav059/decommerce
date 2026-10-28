import type { StepGraphicKind } from "@/components/ui/StepGraphic";

export function Steps({ eyebrow = "HOW IT WORKS", headline, body, steps }: { eyebrow?: string; headline: string; body?: string; steps: { title: string; body: string }[]; graphics?: StepGraphicKind[] }) {
  return <section className="process-section"><div className="process-heading"><div><p className="section-kicker"><span /> {eyebrow}</p><h2>{headline}</h2></div>{body && <p>{body}</p>}</div><ol className="process-grid">{steps.map((step, i) => <li key={step.title}><span>0{i + 1} / 0{steps.length}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol></section>;
}
