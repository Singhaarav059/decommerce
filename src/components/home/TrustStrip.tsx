import { trust } from "@/content/home";

/** Right under the hero: who builds and runs Decommerce, in Demaze's own numbers. */
export function TrustStrip() {
  return (
    <section aria-label={trust.label} className="border-b border-line bg-studio">
      <div className="mx-auto flex max-w-[var(--max-w)] flex-wrap items-center justify-between gap-x-10 gap-y-5 px-[var(--gutter)] py-7">
        <p className="eyebrow">{trust.label}</p>
        <dl className="flex flex-wrap gap-x-10 gap-y-3 md:gap-x-14">
          {trust.stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-2.5">
              <dt className="sr-only">{s.label}</dt>
              <dd className="display text-[clamp(1.8rem,2.6vw,2.4rem)] leading-none">{s.value}</dd>
              <span aria-hidden className="text-[0.92rem] text-ink-2">{s.label}</span>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
