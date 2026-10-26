/**
 * A slow ribbon of words in display type that drifts sideways (pauses on hover, stops for
 * reduced motion). Decorative: the same words are on the page as real content elsewhere.
 */
export function MarqueeBand({ items, seconds = 60, className = "" }: { items: string[]; seconds?: number; className?: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="marquee-row flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="display flex items-center gap-8 px-4 text-[clamp(1.8rem,3.4vw,3rem)] whitespace-nowrap md:gap-12 md:px-6">
          {t}
          <span aria-hidden className="size-2.5 rounded-full bg-accent" />
        </li>
      ))}
    </ul>
  );
  return (
    <div aria-hidden className={`marquee overflow-hidden py-6 md:py-8 ${className}`}>
      <div className="marquee-track flex w-max" style={{ animationDuration: `${seconds}s` }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
