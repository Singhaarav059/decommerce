import Image from "next/image";
import type { ReactNode } from "react";

/**
 * A full-bleed section on a photograph of a real place (no box, no feather).
 * Desktop: the photo fills the section and the text sits in its calm left 40 %.
 * Phones: the photo fills the top and melts into a panel of the scene's floor
 * colour, where the text sits. `spot` ([x, y] in percent) lights one part of the
 * photo and softly washes out the rest, without moving anything under the text.
 */
export function Scene({
  id,
  src,
  floor,
  children,
  spot,
  label,
}: {
  id?: string;
  src: string;
  floor: string;
  children: ReactNode;
  spot?: [number, number] | null;
  label?: string;
}) {
  return (
    <section id={id} aria-label={label} className="relative overflow-clip" style={{ background: floor }}>
      {/* desktop: the photo stays one screen tall (sticky) so a long text column never crops away the calm side */}
      <div className="absolute inset-x-0 top-0 h-[52svh] md:inset-0 md:h-auto">
        <div className="relative h-full overflow-hidden md:sticky md:top-0 md:h-[100svh]">
          <Image src={src} alt="" fill sizes="100vw" className="object-cover object-[70%_50%] md:object-center" />
          {/* the wash is laid out like the cover-fitted photo, so spot coordinates are photo percentages */}
          <div
            aria-hidden
            className="absolute top-1/2 left-[70%] aspect-video min-h-full min-w-full -translate-x-[70%] -translate-y-1/2 transition-opacity duration-500 ease-[var(--ease-out)] md:left-1/2 md:-translate-x-1/2"
            style={{ opacity: spot ? 1 : 0, background: spot ? `radial-gradient(circle at ${spot[0]}% ${spot[1]}%, transparent 0 9%, rgb(239 231 222 / 0.62) 22%)` : undefined }}
          />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 md:hidden" style={{ background: `linear-gradient(to bottom, transparent, ${floor})` }} />
        </div>
      </div>
      <div className="relative mx-auto flex max-w-[var(--max-w)] px-[var(--gutter)] pt-[calc(52svh+8px)] pb-16 md:min-h-[100svh] md:items-center md:pt-[calc(var(--header-h)+32px)] md:pb-16 [--ink-2:var(--ink)]">
        <div className="w-full md:w-[40%] md:max-w-[560px] md:pr-6">{children}</div>
      </div>
    </section>
  );
}
