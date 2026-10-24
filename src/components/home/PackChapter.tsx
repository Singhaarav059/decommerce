"use client";

import { PinnedFilm } from "@/components/media/PinnedFilm";
import { pack } from "@/content/home";
import { sequences } from "@/content/media";
import { RowList, StepText } from "./StepText";

/** Homepage chapter 6: the picker scans the overshirt and ships it; the step list advances with the film. */
export function PackChapter() {
  return (
    <PinnedFilm
      id="ch-pack"
      seq={sequences.pack}
      alt={pack.alt}
      steps={pack.steps.map((_, i) => (
        <StepText key={i} label={pack.eyebrow} headline={pack.headline} body={pack.body} links={i === pack.steps.length - 1 ? pack.links : undefined}>
          <RowList active={i} rows={pack.steps.map((s, k) => ({ key: s, left: `${k + 1}. ${s}`, right: k < i ? "Done" : k === i ? "Now" : "" }))} />
        </StepText>
      ))}
    />
  );
}
