import Image from "next/image";
import type { ReactNode } from "react";
import { Headline } from "./Headline";
import type { HeadlineMedia } from "./InlinePhotos";

type Tone = "studio" | "soft" | "paper" | "night";

const tones: Record<Tone, string> = {
  studio: "bg-studio text-ink",
  soft: "bg-studio-light text-ink",
  paper: "bg-paper text-ink",
  night: "tone-night bg-night",
};

/**
 * The one shell every static section uses, so spacing, header and rhythm match site-wide.
 * Header: a revealed headline, and the lead set beside it on wide screens. No label, number or rule.
 */
export function Section({
  id,
  headline,
  lead,
  tone = "studio",
  children,
  className = "",
  headerAside,
  backdrop,
  layout = "stack",
  headlineMedia,
  headerMedia,
}: {
  id?: string;
  /** Kept for callers; sections no longer show a number or label. */
  index?: string;
  eyebrow?: string;
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
  /** Small photos set inside the headline, after the given word. */
  headlineMedia?: HeadlineMedia;
  /** A picture (or panel) beside the header on wide screens, so the opening is never half empty. */
  headerMedia?: ReactNode;
}) {
  if (layout === "split")
    return (
      <section id={id} className={`relative isolate ${tones[tone]} ${className}`}>
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-[var(--section-gap)]">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
            <header className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:col-span-5 lg:self-start">
              <Headline as="h2" reveal media={headlineMedia} text={headline} className="t-h2 lg:max-w-[14ch]" />
              {lead && <p className="t-lead mt-6 max-w-[42ch] text-ink-2">{lead}</p>}
              {headerAside}
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
          <div className={`absolute inset-0 ${tone === "night" ? "bg-night/90" : "bg-studio-light/90"}`} />
        </div>
      )}
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-[var(--section-gap)]">
        {/* one header shape on every section: headline, then its lead directly under it, on the left margin */}
        <header className={headerMedia ? "grid items-center gap-10 lg:grid-cols-12 lg:gap-16" : "max-w-[880px]"}>
          <div className={headerMedia ? "lg:col-span-6" : ""}>
            <Headline as="h2" reveal media={headlineMedia} text={headline} className="t-h2 lg:max-w-[20ch]" />
            {(lead || headerAside) && (
              <div className="rv mt-6">
                {lead && <p className="t-lead max-w-[56ch] text-ink-2">{lead}</p>}
                {headerAside}
              </div>
            )}
          </div>
          {headerMedia && <div className="lg:col-span-6">{headerMedia}</div>}
        </header>
        {children && <div className="mt-12 md:mt-16">{children}</div>}
      </div>
    </section>
  );
}

/** Sections carry no label or rule; kept so custom layouts can still mark their start. */
export function SectionLabel(props: { index?: string; eyebrow: string }) {
  void props;
  return null;
}
