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
      <Section id="ch-close" eyebrow={close.eyebrow} headline={close.headline} lead={close.body} layout="split">
        <DemoForm className="rv tag tag-lg tag-plain bg-studio-light p-6 pt-12 md:p-10 md:pt-16" />
      </Section>
      {/* the page moves from studio to dusk, the words on the shop's own calm wall, then the night footer */}
      <PinnedFilm
        id="ch-close-film"
        seq={sequences.close}
        alt={close.alt}
        length={1.3}
        floor={sequences.close.floor}
        bare
        steps={[<StepText key="a" label={close.film.label} headline={close.film.headline} body={close.film.body} />]}
      />
    </>
  );
}
