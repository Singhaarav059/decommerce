"use client";

import { useRef } from "react";
import Link from "next/link";
import { ScrollSequence, useSequenceProgress } from "@/components/media/ScrollSequence";
import { delivery, order } from "@/content/home";
import { sequences } from "@/content/media";

const ETA_MIN = parseInt(order.eta, 10);

/** Live ETA chip: counts down while the van is on the road (film 0.26–0.78). */
function EtaChip() {
  const mins = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useSequenceProgress((p) => {
    const drive = Math.min(1, Math.max(0, (p - 0.26) / 0.52));
    if (mins.current) mins.current.textContent = p > 0.82 ? "0" : String(Math.round(ETA_MIN * (1 - drive)));
    if (label.current) label.current.textContent = p > 0.82 ? "Delivered" : p > 0.26 ? "Arriving in" : "Leaving the store";
  });
  return (
    <div className="absolute top-[calc(var(--header-h)+20px)] right-[var(--gutter)] z-10 rounded-full bg-ink py-2 pr-4 pl-3 text-stone-50">
      <span className="mr-2 inline-block size-2 rounded-full bg-copper align-middle" />
      <span className="font-mono text-[0.72rem] text-stone-50/70">{order.id} · </span>
      <span ref={label} className="text-[0.85rem]">
        Leaving the store
      </span>{" "}
      <span className="font-mono text-[0.85rem] tabular-nums">
        <span ref={mins}>{ETA_MIN}</span> min
      </span>
    </div>
  );
}

/** Chapter 7: the delivery film, scrubbed by scroll. */
export function DeliveryChapter() {
  return (
    <div id="ch-delivery" className="relative">
      <ScrollSequence {...sequences.delivery} length={3} stillFrame={70} alt={delivery.alt} captions={delivery.captions}>
        <EtaChip />
        <div className="absolute bottom-[4svh] left-[var(--gutter)] z-10 flex gap-4 text-sm lg:left-[calc(var(--gutter)+150px)]">
          <span className="eyebrow self-center">{delivery.eyebrow}</span>
          {delivery.links.map((l) => (
            <Link key={l.href} href={l.href} className="font-medium text-copper-ink">
              {l.label} →
            </Link>
          ))}
        </div>
      </ScrollSequence>
    </div>
  );
}
