"use client";

import { DemoForm } from "@/components/forms/DemoForm";
import { PinnedFilm } from "@/components/media/PinnedFilm";
import { Headline } from "@/components/ui/Headline";
import { close } from "@/content/home";
import { sequences } from "@/content/media";
import { StepText } from "./StepText";

/** Homepage chapter 10: the demo form on the studio surface, then the store closing at dusk, leading into the night footer. */
export function CloseChapter() {
  return (
    <>
      <section id="ch-close">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] py-[var(--section-gap)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <p className="eyebrow">{close.eyebrow}</p>
            <Headline as="h2" reveal text={close.headline} className="t-h2 mt-5" />
            <p className="t-lead mt-5 max-w-[40ch] text-ink-2">{close.body}</p>
          </div>
          <DemoForm className="rv rounded-[var(--radius-xl)] bg-paper p-6 shadow-[var(--shadow-sm)] md:p-9" />
        </div>
      </section>
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
