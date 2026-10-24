import Image from "next/image";
import type { ReactNode } from "react";
import { Headline } from "./Headline";

type Tone = "studio" | "paper" | "night";

const tones: Record<Tone, string> = {
  studio: "bg-studio text-ink",
  paper: "bg-paper text-ink",
  night: "tone-night bg-night",
};

/**
 * The one shell every static section uses, so spacing, header and rhythm match site-wide.
 * Header: index and label, a revealed headline, and the lead set beside it on wide screens.
 */
export function Section({
  id,
  index,
  eyebrow,
  headline,
  lead,
  tone = "studio",
  children,
  className = "",
  headerAside,
  backdrop,
}: {
  id?: string;
  /** Two-digit section number shown before the label, e.g. "02". */
  index?: string;
  eyebrow: string;
  headline: string;
  lead?: ReactNode;
  tone?: Tone;
  children?: ReactNode;
  className?: string;
  /** Replaces the lead column, e.g. a button. */
  headerAside?: ReactNode;
  /** A photograph behind the section (night tone): darkened so text stays above 7:1, drifting slowly as you scroll. */
  backdrop?: string;
}) {
  return (
    <section id={id} className={`relative isolate overflow-clip ${tones[tone]} ${className}`}>
      {backdrop && (
        <div aria-hidden className="rv-media absolute inset-0 -z-10">
          <div className="absolute inset-0">
            <Image src={backdrop} alt="" fill sizes="100vw" quality={70} className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(28_23_18/0.94)_0%,rgb(28_23_18/0.8)_45%,rgb(28_23_18/0.94)_100%)]" />
        </div>
      )}
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-[var(--section-gap)]">
        <header className="grid gap-6 border-t border-line-strong pt-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">
              {index && <span className="tabular text-copper">{index}</span>}
              {eyebrow}
            </p>
            <Headline as="h2" reveal text={headline} className="t-h2 mt-6 max-w-[18ch]" />
          </div>
          {(lead || headerAside) && (
            <div className="rv self-end lg:col-span-5">
              {lead && <p className="t-lead max-w-[46ch] text-ink-2">{lead}</p>}
              {headerAside}
            </div>
          )}
        </header>
        {children && <div className="mt-12 md:mt-16">{children}</div>}
      </div>
    </section>
  );
}
