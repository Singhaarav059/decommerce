import { Section } from "@/components/ui/Section";
import { service } from "@/content/home";

/** What Decommerce is: the platform, the setup and the running, as three ruled columns. */
export function ServiceSection() {
  return (
    <Section id="what-we-do" index="01" eyebrow={service.eyebrow} headline={service.headline} lead={service.body}>
      <ol className="grid border-line md:grid-cols-3 md:divide-x md:divide-line">
        {service.pillars.map((p) => (
          <li key={p.n} className="group rv relative border-t border-line py-8 md:border-t-0 md:px-8 md:py-2 md:first:pl-0 md:last:pr-0">
            <span aria-hidden className="absolute -top-px left-0 h-[2px] w-0 bg-copper transition-[width] duration-700 ease-[var(--ease-out)] group-hover:w-16 md:hidden" />
            <p className="display tabular text-[clamp(2.6rem,4vw,3.6rem)] text-copper">{p.n}</p>
            <h3 className="display t-h3 mt-6">{p.title}</h3>
            <p className="mt-4 max-w-[38ch] text-ink-2">{p.body}</p>
            <ul className="mt-6 space-y-2 border-t border-line pt-5 text-[0.95rem]">
              {p.points.map((pt) => (
                <li key={pt} className="flex items-baseline gap-3">
                  <span aria-hidden className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-copper" />
                  {pt}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
