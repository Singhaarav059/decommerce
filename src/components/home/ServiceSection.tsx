import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { service } from "@/content/home";
import { SyncDiagram } from "./SyncDiagram";

const PHOTOS = ["/assets/sol/storefront/detail.webp", "/assets/sol/wms/detail.webp", "/assets/sol/clienteling/detail.webp"];

/**
 * What Decommerce is: the idea in motion on a dark panel (a sale at the store updates one stock
 * count that every channel reads), then the three things a client gets, as three photo cards.
 */
export function ServiceSection() {
  const { idea } = service;
  return (
    <Section
      id="what-we-do"
      index="01"
      eyebrow={service.eyebrow}
      headline={service.headline}
      lead={service.body}
      headerAside={
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href="/contact-us" arrow>
            Book a demo
          </ButtonLink>
          <ButtonLink href="#how-we-work" variant="secondary">
            How we work
          </ButtonLink>
        </div>
      }
    >
      <div className="tone-night rv grid items-center gap-8 overflow-hidden rounded-[var(--radius-xl)] bg-night p-6 shadow-[var(--shadow-md)] md:p-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">{idea.eyebrow}</p>
          <h3 className="display mt-5 text-[clamp(1.7rem,2.8vw,2.6rem)] leading-[1.05]">{idea.headline}</h3>
          <ol className="mt-8 space-y-4">
            {idea.steps.map((s, i) => (
              <li key={s} className="flex gap-4">
                <span className="tabular flex size-7 shrink-0 items-center justify-center rounded-full bg-copper text-[0.8rem] font-semibold text-night">{i + 1}</span>
                <span className="pt-0.5 text-ink-2">{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-[var(--radius-lg)] bg-white/[0.04] p-4 ring-1 ring-white/10 md:p-6 lg:col-span-7">
          <SyncDiagram />
        </div>
      </div>

      <ol className="mt-6 grid gap-6 md:grid-cols-3">
        {service.pillars.map((p, i) => (
          <li key={p.n} className="group rv flex flex-col overflow-hidden rounded-[var(--radius-xl)] bg-paper shadow-[var(--shadow-sm)] transition-[translate,box-shadow] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
            <div className="relative aspect-[16/11] overflow-hidden bg-ink/5">
              <Image src={PHOTOS[i]} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" quality={80} className="object-cover object-right transition-transform duration-1000 ease-[var(--ease-out)] group-hover:scale-[1.06]" />
              <span className="display tabular absolute top-4 left-4 flex size-11 items-center justify-center rounded-full bg-copper text-[1rem] text-paper shadow-[var(--shadow-md)]">{p.n}</span>
            </div>
            <div className="flex flex-1 flex-col p-6 md:p-7">
              <h3 className="display t-h3">{p.title}</h3>
              <p className="mt-3 mb-6 text-ink-2">{p.body}</p>
              <ul className="mt-auto space-y-2 border-t border-line pt-5 text-[0.95rem]">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-baseline gap-3">
                    <span aria-hidden className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-copper-bright" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
