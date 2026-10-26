import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { service } from "@/content/home";
import { SyncDiagram } from "./SyncDiagram";

const PHOTOS = ["/assets/sol/storefront/detail.webp", "/assets/sol/wms/detail.webp", "/assets/sol/clienteling/detail.webp"];

/**
 * What Decommerce is. The intro stays pinned on the left; on the right, the idea in motion
 * (one stock count feeding every channel), then the platform, the setup and the running as
 * cards that stack over each other as you scroll.
 */
export function ServiceSection() {
  return (
    <Section
      id="what-we-do"
      index="01"
      eyebrow={service.eyebrow}
      headline={service.headline}
      lead={service.body}
      layout="split"
      headerAside={
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact-us" arrow>
            Book a demo
          </ButtonLink>
          <ButtonLink href="#how-we-work" variant="secondary">
            How we work
          </ButtonLink>
        </div>
      }
    >
      <div className="space-y-6">
        <article className="tone-night rv rounded-[var(--radius-xl)] bg-night p-6 shadow-[var(--shadow-md)] md:p-9 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <p className="eyebrow">The idea</p>
          <h3 className="display t-h3 mt-4 max-w-[22ch]">One stock count, read by every channel at the same moment.</h3>
          <SyncDiagram className="mt-6" />
        </article>
        {service.pillars.map((p, i) => (
          <article
            key={p.n}
            className="group rv grid overflow-hidden rounded-[var(--radius-xl)] bg-paper shadow-[var(--shadow-md)] sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:sticky"
            style={{ top: `calc(var(--header-h) + ${48 + i * 28}px)` }}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-ink/5 sm:aspect-auto sm:min-h-[340px]">
              <Image src={PHOTOS[i]} alt="" fill sizes="(max-width: 640px) 100vw, 30vw" quality={80} className="object-cover object-right transition-transform duration-1000 ease-[var(--ease-out)] group-hover:scale-[1.05]" />
            </div>
            <div className="flex flex-col p-6 md:p-8">
              <p className="display tabular text-[2.4rem] leading-none text-copper">{p.n}</p>
              <h3 className="display t-h3 mt-5">{p.title}</h3>
              <p className="mt-3 mb-6 text-ink-2">{p.body}</p>
              <ul className="mt-auto space-y-2 border-t border-line pt-5 text-[0.95rem]">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-baseline gap-3">
                    <span aria-hidden className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-copper" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
