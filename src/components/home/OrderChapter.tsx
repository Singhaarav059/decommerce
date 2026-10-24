"use client";

import { PinnedFilm } from "@/components/media/PinnedFilm";
import { order, orderLands as o } from "@/content/home";
import { sequences } from "@/content/media";
import { RowList, StepText } from "./StepText";

const rows = (active?: number) => (
  <RowList active={active} rows={o.locations.map((l) => ({ key: l.id, left: l.name, right: l.detail }))} />
);

/** Homepage chapter 5: ORD-1042 arrives, three locations are checked, the nearest store ships it. */
export function OrderChapter() {
  return (
    <PinnedFilm
      id="ch-order"
      seq={sequences.order}
      alt={o.alt}
      steps={[
        <StepText key="a" label={o.arrive.label} headline={o.arrive.headline} body={o.arrive.body}>
          <p className="mt-6 text-[0.9rem] text-ink-2">
            {order.sku}, illustrative.
          </p>
        </StepText>,
        <StepText key="b" label={o.check.label} headline={o.check.headline}>
          {rows()}
        </StepText>,
        <StepText key="c" label={o.route.label} headline={o.route.headline} body={o.route.body} links={o.links}>
          {rows(o.locations.findIndex((l) => l.chosen))}
        </StepText>,
      ]}
    />
  );
}
