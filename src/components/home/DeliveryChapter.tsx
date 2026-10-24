"use client";

import { PinnedFilm } from "@/components/media/PinnedFilm";
import { delivery as d, order } from "@/content/home";
import { sequences } from "@/content/media";
import { StepText } from "./StepText";

/** Homepage chapter 7: the van crosses the miniature city to the customer's door. */
export function DeliveryChapter() {
  return (
    <PinnedFilm
      id="ch-delivery"
      seq={sequences.van}
      alt={d.alt}
      steps={d.captions.map((c, i) => (
        <StepText key={i} label={`${d.eyebrow} · ${c.eyebrow}`} headline={d.headlines[i]} body={c.text} links={i === d.captions.length - 1 ? d.links : undefined}>
          <p className="mt-6 flex items-baseline justify-between border-y border-line py-2.5 max-w-md">
            <span className="text-ink-2">{order.id}</span>
            <span className="tabular font-semibold">{d.eta[i]}</span>
          </p>
        </StepText>
      ))}
    />
  );
}
