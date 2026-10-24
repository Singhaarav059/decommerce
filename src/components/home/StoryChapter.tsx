"use client";

import { PinnedFilm } from "@/components/media/PinnedFilm";
import type { Chapter } from "@/content/home";
import { sequences } from "@/content/media";
import { RowList, StepText } from "./StepText";

/** A homepage chapter: one continuous film of a real place, explained in 2–3 text steps. */
export function StoryChapter({ chapter }: { chapter: Chapter }) {
  const seq = sequences[chapter.seq as keyof typeof sequences];
  return (
    <PinnedFilm
      id={chapter.id}
      seq={seq}
      floor={seq.floor}
      alt={chapter.alt}
      length={1 + chapter.steps.length * 0.8}
      steps={chapter.steps.map((s, i) => (
        <StepText key={i} label={s.label} headline={s.headline} body={s.body} links={s.links}>
          {s.rows && <RowList active={s.active} rows={s.rows.map((r) => ({ key: r.left, left: r.left, right: r.right }))} />}
        </StepText>
      ))}
    />
  );
}
