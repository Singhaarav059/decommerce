import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SyncDiagram } from "./SyncDiagram";

const PHOTOS = ["/assets/sol/storefront/detail.webp", "/assets/sol/wms/detail.webp", "/assets/sol/clienteling/detail.webp"];
import { service } from "@/content/home";

/** What Decommerce is: the platform, the setup and the running, as three ruled columns. */
export function ServiceSection() {
  return (
    <Section id="what-we-do" index="01" eyebrow={service.eyebrow} headline={service.headline} lead={service.body} headerAside={<SyncDiagram className="mt-8 max-w-[560px] rounded-[var(--radius-lg)] bg-paper p-5 shadow-[var(--shadow-sm)]" />}>
      <ol className="grid border-line md:grid-cols-3 md:divide-x md:divide-line">
        {service.pillars.map((p, i) => (
          <li key={p.n} className="group rv relative border-t border-line py-8 md:border-t-0 md:px-8 md:py-2 md:first:pl-0 md:last:pr-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-ink/5">
              <Image src={PHOTOS[i]} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" quality={80} className="object-cover object-right transition-transform duration-1000 ease-[var(--ease-out)] group-hover:scale-[1.05]" />
              <span className="display tabular absolute top-3 left-3 rounded-full bg-paper px-3 py-1 text-[1rem] text-copper">{p.n}</span>
            </div>
            <h3 className="display t-h3 mt-7">{p.title}</h3>
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
