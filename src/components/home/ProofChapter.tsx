"use client";

import { PinnedFilm } from "@/components/media/PinnedFilm";
import { proof } from "@/content/home";
import { sequences } from "@/content/media";
import { StepText } from "./StepText";

/** Who builds it: Demaze's real numbers over a slow pan across the boutique. */
export function ProofChapter() {
  return (
    <PinnedFilm
      id="ch-proof"
      seq={sequences.proof}
      floor={sequences.proof.floor}
      alt={proof.alt}
      length={1.3}
      steps={[
        <StepText key="a" label={proof.eyebrow} headline={proof.headline} body={proof.body}>
          <dl className="mt-5 grid max-w-md grid-cols-3 border-t border-line-strong pt-5 md:mt-6">
            {proof.stats.map((st) => (
              <div key={st.label} className="flex flex-col">
                <dt className="order-2 mt-2 pr-3 text-[0.9rem] leading-snug text-ink-2">{st.label}</dt>
                <dd className="tabular display order-1 text-[clamp(1.8rem,3.2vw,3rem)]">
                  {st.value}
                  {st.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </StepText>,
      ]}
    />
  );
}
