import { trust } from "@/content/home";

/** Right under the hero: who builds and runs Decommerce, in Demaze's own numbers. */
export function TrustStrip() {
  return (
    <section aria-label={trust.label} className="bg-studio">
      <div className="mx-auto flex max-w-[var(--max-w)] flex-col-reverse gap-6 px-[var(--gutter)] py-12 md:py-16 lg:flex-row lg:items-baseline lg:justify-between lg:gap-10">
        <p className="t-lead max-w-[22ch] font-semibold">{trust.label}</p>
        <dl className="flex flex-wrap gap-x-10 gap-y-3 md:gap-x-14">
          {trust.stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-2.5">
              <dt className="sr-only">{s.label}</dt>
              <dd className="display text-[clamp(2.6rem,4.4vw,4.2rem)] leading-none tracking-[-0.04em] text-copper">{s.value}</dd>
              <span aria-hidden className="max-w-[9ch] text-[0.94rem] leading-tight text-ink-2">{s.label}</span>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
