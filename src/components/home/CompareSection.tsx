import { Section } from "@/components/ui/Section";
import { compare } from "@/content/home";

/** How Decommerce compares with a website builder plus plugins, and with separate systems. */
export function CompareSection() {
  const [a, b, d] = compare.columns;
  return (
    <Section id="compare" index="07" eyebrow={compare.eyebrow} headline={compare.headline} lead={compare.body}>
      <div role="region" aria-label="Comparison table, scrolls sideways on small screens" tabIndex={0} className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] [scrollbar-width:thin]">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
          <caption className="sr-only">Decommerce compared with a website builder and with separate systems</caption>
          <thead>
            <tr className="text-[0.85rem]">
              <th scope="col" className="w-[16%] py-4 pr-4 font-semibold text-ink-2">
                <span className="sr-only">Area</span>
              </th>
              <th scope="col" className="w-[26%] py-4 pr-6 font-semibold text-ink-2">{a}</th>
              <th scope="col" className="w-[26%] py-4 pr-6 font-semibold text-ink-2">{b}</th>
              <th scope="col" className="w-[32%] rounded-t-[var(--radius-lg)] bg-ink px-6 py-4 font-semibold text-paper">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="size-1.5 rounded-full bg-copper-bright" />
                  {d}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {compare.rows.map((r, i) => {
              const last = i === compare.rows.length - 1;
              return (
                <tr key={r.area} className="rv align-top">
                  <th scope="row" className="border-t border-line py-5 pr-4 text-[1.05rem] font-semibold">{r.area}</th>
                  <td className="border-t border-line py-5 pr-6 text-ink-2">
                    <span aria-hidden className="mr-2 text-ink-2/70">×</span>
                    {r.cells[0]}
                  </td>
                  <td className="border-t border-line py-5 pr-6 text-ink-2">
                    <span aria-hidden className="mr-2 text-ink-2/70">×</span>
                    {r.cells[1]}
                  </td>
                  <td className={`border-t border-white/10 bg-ink px-6 py-5 font-medium text-paper ${last ? "rounded-b-[var(--radius-lg)]" : ""}`}>
                    <span aria-hidden className="mr-2 text-copper-bright">✓</span>
                    {r.cells[2]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
