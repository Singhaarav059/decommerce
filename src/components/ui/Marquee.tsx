import type { ReactNode } from "react";

/**
 * Endless horizontal strip. The track is duplicated once (hidden from
 * assistive tech) and slid by -50%. Pauses on hover; reduced motion turns it
 * into a static wrapped row (see .marquee rules in globals.css).
 */
export function Marquee({
  items,
  speed = 40,
  className = "",
  label,
}: {
  items: ReactNode[];
  /** seconds per loop */
  speed?: number;
  className?: string;
  label: string;
}) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="marquee-row flex shrink-0 items-center gap-12 pr-12">
      {items.map((item, i) => (
        <li key={i} className="shrink-0">
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <div role="region" aria-label={label} className={`marquee overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max" style={{ animationDuration: `${speed}s` }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
