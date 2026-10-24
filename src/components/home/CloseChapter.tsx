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
      <section id="ch-close" className="border-t border-line">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] py-[var(--section-gap)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <p className="eyebrow">{close.eyebrow}</p>
            <Headline as="h2" text={close.headline} className="mt-4 text-[clamp(2.1rem,4vw,4rem)]" />
            <p className="mt-4 max-w-[40ch] text-ink-2">{close.body}</p>
          </div>
          <DemoForm />
        </div>
      </section>
      {/* the page darkens from studio to dusk to the night footer */}
      <PinnedFilm
        id="ch-close-film"
        seq={sequences.close}
        alt={close.alt}
        length={1.8}
        bg="#8b888d"
        dark
        steps={[<StepText key="a" label={close.film.label} headline={close.film.headline} body={close.film.body} />]}
      />
    </>
  );
}
