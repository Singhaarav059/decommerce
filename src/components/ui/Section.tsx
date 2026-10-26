import Image from "next/image";
import type { ReactNode } from "react";
import { Headline } from "./Headline";

type Tone = "studio" | "soft" | "paper" | "night";

const tones: Record<Tone, string> = {
  studio: "bg-studio text-ink",
  soft: "bg-studio-light text-ink",
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
  layout = "stack",
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
  /** A photograph behind the section, washed toward the surface so text stays above 7:1, drifting slowly as you scroll. */
  backdrop?: string;
  /** stack: header above the content. split: the header stays pinned on the left while the content scrolls on the right. */
  layout?: "stack" | "split";
}) {
  const rule = (
    <div aria-hidden className="relative h-px bg-line-strong">
      <span className="line-draw absolute top-0 left-0 h-[2px] w-28 origin-left bg-copper" />
    </div>
  );
  // the section number set large in outline: quiet decoration that also says where you are
  const numeral = index && (
    <span aria-hidden className="numeral block select-none">
      {index}
    </span>
  );
  const label = (
    <p className="eyebrow">
      {index && <span className="tabular text-copper">{index}</span>}
      {eyebrow}
    </p>
  );
  if (layout === "split")
    return (
      <section id={id} className={`relative isolate ${tones[tone]} ${className}`}>
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-[var(--section-gap)]">
          {rule}
          <div className="grid gap-12 pt-6 lg:grid-cols-12 lg:gap-12">
            <header className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:col-span-5 lg:self-start">
              {label}
              <Headline as="h2" reveal text={headline} className="t-h2 mt-6 max-w-[14ch]" />
              {lead && <p className="t-lead mt-6 max-w-[42ch] text-ink-2">{lead}</p>}
              {headerAside}
              <div className="mt-10 hidden lg:block">{numeral}</div>
            </header>
            <div className="min-w-0 lg:col-span-7">{children}</div>
          </div>
        </div>
      </section>
    );
  return (
    <section id={id} className={`relative isolate overflow-clip ${tones[tone]} ${className}`}>
      {backdrop && (
        <div aria-hidden className="rv-media absolute inset-0 -z-10">
          <div className="absolute inset-0">
            <Image src={backdrop} alt="" fill sizes="100vw" quality={70} className="object-cover" />
          </div>
          {/* the photo is washed toward the section's own surface so text stays well above 7:1 */}
          <div className={`absolute inset-0 ${tone === "night" ? "bg-[linear-gradient(180deg,rgb(28_23_18/0.94)_0%,rgb(28_23_18/0.8)_45%,rgb(28_23_18/0.94)_100%)]" : "bg-[linear-gradient(180deg,rgb(245_244_241/0.96)_0%,rgb(245_244_241/0.86)_45%,rgb(245_244_241/0.96)_100%)]"}`} />
        </div>
      )}
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-[var(--section-gap)]">
        {rule}
        <header className="grid gap-6 pt-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {label}
            <Headline as="h2" reveal text={headline} className="t-h2 mt-6 max-w-[18ch]" />
          </div>
          <div className="flex flex-col justify-between gap-6 lg:col-span-5">
            <div className="hidden justify-end lg:flex">{numeral}</div>
            {(lead || headerAside) && (
              <div className="rv">
                {lead && <p className="t-lead max-w-[46ch] text-ink-2">{lead}</p>}
                {headerAside}
              </div>
            )}
          </div>
        </header>
        {children && <div className="mt-12 md:mt-16">{children}</div>}
      </div>
    </section>
  );
}

/** The section rule and label on their own, for sections with a custom layout (framed scenes). */
export function SectionLabel({ index, eyebrow }: { index?: string; eyebrow: string }) {
  return (
    <>
      <div aria-hidden className="relative h-px bg-line-strong">
        <span className="line-draw absolute top-0 left-0 h-[2px] w-28 origin-left bg-copper" />
      </div>
      <p className="eyebrow mt-6">
        {index && <span className="tabular text-copper">{index}</span>}
        {eyebrow}
      </p>
    </>
  );
}
