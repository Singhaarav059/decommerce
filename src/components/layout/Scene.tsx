import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

/** Washes the photo out around one point ([x, y] in percent of the photo), so the eye goes there. */
function Spot({ spot, className }: { spot?: [number, number] | null; className: string }) {
  return (
    <div
      aria-hidden
      className={`absolute top-1/2 aspect-video min-h-full min-w-full -translate-y-1/2 transition-opacity duration-500 ease-[var(--ease-out)] ${className}`}
      style={{ opacity: spot ? 1 : 0, background: spot ? `radial-gradient(circle at ${spot[0]}% ${spot[1]}%, transparent 0 9%, rgb(239 231 222 / 0.62) 22%)` : undefined }}
    />
  );
}

/**
 * A section on a photograph of a real place.
 * `full` (default): the photo fills the section and the text sits in its calm left 40 %, over a
 * wash of the scene's floor colour so it always reads. Phones: the photo fills the top and melts
 * into a panel of the floor colour, where the text sits.
 * `framed`: a compact two-column section, the photo in a rounded frame beside the text
 * (`flip` puts the photo first). `spot` lights one part of the photo without moving anything.
 */
export function Scene({
  id,
  src,
  floor,
  children,
  spot,
  label,
  priority = false,
  variant = "full",
  flip = false,
}: {
  id?: string;
  src: string;
  floor: string;
  children: ReactNode;
  spot?: [number, number] | null;
  label?: string;
  priority?: boolean;
  variant?: "full" | "framed";
  flip?: boolean;
}) {
  if (variant === "framed")
    return (
      <section id={id} aria-label={label} style={{ background: floor }}>
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 items-center gap-8 px-[var(--gutter)] py-[var(--section-gap)] md:gap-10 lg:grid-cols-12 lg:gap-12 [--ink-2:var(--ink)]">
          <div className={`rv-media min-w-0 lg:col-span-7 ${flip ? "" : "lg:order-2"}`}>
            {/* cropped to the subject: the photos keep their calm left side empty for full-bleed text */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-ink/5 md:aspect-[5/4]">
              <Image src={src} alt="" fill sizes="(max-width: 1024px) 100vw, 58vw" quality={85} className="object-cover object-right" />
              <Spot spot={spot} className="left-full -translate-x-full" />
            </div>
          </div>
          <div className={`min-w-0 lg:col-span-5 ${flip ? "lg:pl-4" : "lg:pr-4"}`}>{children}</div>
        </div>
      </section>
    );
  return (
    <section id={id} aria-label={label} className="relative overflow-clip" style={{ background: floor, "--floor": floor } as CSSProperties}>
      {/* desktop: the photo stays one screen tall (sticky) so a long text column never crops away the calm side */}
      <div className="absolute inset-x-0 top-0 h-[52svh] md:inset-0 md:h-auto">
        <div className="relative h-full overflow-hidden md:sticky md:top-0 md:h-[100svh]">
          <Image src={src} alt="" fill priority={priority} sizes="100vw" quality={85} className="object-cover object-[70%_50%] md:object-center" />
          {/* the wash is laid out like the cover-fitted photo, so spot coordinates are photo percentages */}
          <Spot spot={spot} className="left-[70%] -translate-x-[70%] md:left-1/2 md:-translate-x-1/2" />
          <div aria-hidden className="scrim absolute inset-0 hidden md:block" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 md:hidden" style={{ background: `linear-gradient(to bottom, transparent, ${floor})` }} />
        </div>
      </div>
      <div className="relative mx-auto flex max-w-[var(--max-w)] px-[var(--gutter)] pt-[calc(52svh+8px)] pb-16 md:min-h-[100svh] md:items-center md:pt-[calc(var(--header-h)+40px)] md:pb-20 [--ink-2:var(--ink)]">
        <div className="w-full md:w-[42%] md:max-w-[580px] md:pr-6">{children}</div>
      </div>
    </section>
  );
}
