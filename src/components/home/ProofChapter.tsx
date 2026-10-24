"use client";

import { PinnedFilm } from "@/components/media/PinnedFilm";
import { proof, proofAlt } from "@/content/home";
import { sequences } from "@/content/media";
import { StackList, StepText } from "./StepText";

/** Homepage chapter 9: Demaze's real numbers, then the four-step way of working, over a slow orbit of the store. */
export function ProofChapter() {
  return (
    <PinnedFilm
      id="ch-proof"
      seq={sequences.orbit}
      alt={proofAlt}
      phone="16:9"
      length={3}
      steps={[
        <StepText key="a" label={proof.eyebrow} headline={proof.headline} body={proof.body}>
          <dl className="mt-7 grid max-w-md grid-cols-3 border-t border-line pt-4">
            {proof.stats.map((st) => (
              <div key={st.label} className="flex flex-col-reverse">
                <dt className="mt-2 text-[0.9rem] leading-snug text-ink-2">{st.label}</dt>
                <dd className="tabular text-[clamp(2rem,3.4vw,3rem)] leading-none font-medium">
                  {st.value}
                  {st.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </StepText>,
        <StepText key="b" label="How we work" headline="Four steps, nothing switched off.">
          <StackList rows={proof.process.map((p) => ({ key: p.n, title: p.title, body: p.body }))} />
        </StepText>,
      ]}
    />
  );
}
