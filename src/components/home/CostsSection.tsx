import { Section } from "@/components/ui/Section";
import { costs } from "@/content/home";

/** The problem in full: where separate systems cost a retailer, row by row, against one system. */
export function CostsSection() {
  const c = costs.columns;
  return (
    <Section id="problem" index="02" eyebrow={costs.eyebrow} headline={costs.headline} lead={costs.body}>
      <div role="table" aria-label="Separate systems compared with Decommerce" className="relative">
        {/* the Decommerce column sits on a raised paper band */}
        <div aria-hidden className="absolute inset-y-0 right-0 hidden w-[calc((100%-12rem)/2)] rounded-[var(--radius-lg)] bg-paper shadow-[var(--shadow-sm)] lg:block" />
        <div role="row" className="relative hidden grid-cols-[12rem_1fr_1fr] text-[0.84rem] font-semibold text-ink-2 lg:grid">
          <span role="columnheader" className="py-5">{c.area}</span>
          <span role="columnheader" className="py-5 pr-10">{c.without}</span>
          <span role="columnheader" className="flex items-center gap-2 px-8 py-5 text-copper">
            <span aria-hidden className="size-1.5 rounded-full bg-copper" />
            {c.with}
          </span>
        </div>
        {costs.rows.map((r) => (
          <div key={r.area} role="row" className="rv relative grid gap-3 border-t border-line py-6 lg:grid-cols-[12rem_1fr_1fr] lg:gap-0 lg:py-0">
            <span role="rowheader" className="display t-h3 lg:py-7">{r.area}</span>
            <span role="cell" className="text-ink-2 lg:py-7 lg:pr-10">
              <span className="mb-1 block text-[0.8rem] font-semibold lg:hidden">{c.without}</span>
              <span className="line-through decoration-ink/25 decoration-1 lg:no-underline">{r.without}</span>
            </span>
            <span role="cell" className="rounded-[var(--radius-md)] bg-paper p-4 font-medium lg:rounded-none lg:bg-transparent lg:px-8 lg:py-7">
              <span className="mb-1 block text-[0.8rem] font-semibold text-copper lg:hidden">{c.with}</span>
              {r.with}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}
