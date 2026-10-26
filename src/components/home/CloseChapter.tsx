"use client";

import { DemoForm } from "@/components/forms/DemoForm";
import { PinnedFilm } from "@/components/media/PinnedFilm";
import { Section } from "@/components/ui/Section";
import { close } from "@/content/home";
import { sequences } from "@/content/media";
import { StepText } from "./StepText";

/** Homepage chapter 10: the demo form on the studio surface, then the store closing at dusk, leading into the night footer. */
export function CloseChapter() {
  return (
    <>
      <Section id="ch-close" index="10" eyebrow={close.eyebrow} headline={close.headline} lead={close.body} layout="split">
        <DemoForm className="rv rounded-[var(--radius-xl)] bg-paper p-6 shadow-[var(--shadow-md)] md:p-9" />
      </Section>
      {/* the page darkens from studio to dusk to the night footer */}
      <PinnedFilm
        id="ch-close-film"
        seq={sequences.close}
        alt={close.alt}
        length={1.3}
        floor={sequences.close.floor}
        night
        steps={[<StepText key="a" label={close.film.label} headline={close.film.headline} body={close.film.body} />]}
      />
    </>
  );
}
