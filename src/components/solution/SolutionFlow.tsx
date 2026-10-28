"use client";

import { useState } from "react";

/** A compact walkthrough of the solution's real sequence, with no simulated metrics. */
export function SolutionFlow({ title, steps }: { title: string; steps: string[] }) {
  const [active, setActive] = useState(0);
  return <div className="solution-flow" role="group" aria-label={`${title} walkthrough`}>
    <div className="solution-flow-top"><span>THE CONNECTED FLOW</span><span>STEP {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span></div>
    <div className="solution-flow-stage"><div className="solution-flow-depth" aria-hidden="true" /><div className="solution-flow-card" aria-live="polite"><span>DECOMMERCE / {title.toUpperCase()}</span><strong>{steps[active]}</strong><p>One step in a connected system.</p></div></div>
    <div className="solution-flow-steps" role="group" aria-label="Choose a step">{steps.map((step, index) => <button key={`${step}-${index}`} type="button" aria-pressed={active === index} aria-label={`${String(index + 1).padStart(2, "0")}: ${step}`} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, "0")}</span><span aria-hidden="true" className="solution-flow-line" /></button>)}</div>
  </div>;
}
