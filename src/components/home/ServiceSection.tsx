import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { service, trust } from "@/content/home";
import { LiveSystem } from "./LiveSystem";

const PHOTOS = ["/assets/sol/storefront/detail.webp", "/assets/sol/wms/detail.webp", "/assets/sol/clienteling/detail.webp"];

/**
 * What Decommerce is: the product working (six live example screens), then the three things a
 * client gets, the platform, the setup and the running, each under its photograph cut as a tag.
 */
export function ServiceSection() {
  return (
    <Section
      id="what-we-do"
     
      eyebrow={service.eyebrow}
      headline={service.headline}
      lead={service.body}
      headerMedia={
        <figure className="rv">
          <div className="tag tag-xl relative aspect-[4/5] overflow-hidden bg-studio-light md:aspect-[5/4] lg:aspect-[4/5]">
            <Image src={service.team.image} alt={service.team.alt} fill sizes="(max-width: 1024px) 100vw, 45vw" quality={82} className="object-cover" />
          </div>
          {/* who runs it, in Demaze's own numbers */}
          <figcaption className="mt-6">
            <dl className="grid grid-cols-3 gap-4">
              {trust.stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="display text-[clamp(2.2rem,3.4vw,3.2rem)] leading-none tracking-[-0.04em] text-accent">{s.value}</dd>
                  <span aria-hidden className="mt-1 block text-[0.94rem] leading-tight text-ink-2">{s.label}</span>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[0.94rem] text-ink-2">{trust.label}.</p>
          </figcaption>
        </figure>
      }
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
      <LiveSystem />

      <ol className="mt-20 grid gap-14 md:mt-28 md:grid-cols-3 md:gap-8 lg:gap-12">
        {service.pillars.map((p, i) => (
          <li key={p.title} className="group rv flex flex-col">
            <div className="tag tag-lg relative aspect-[4/3] overflow-hidden bg-studio-light">
              <Image src={PHOTOS[i]} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" quality={80} className="object-cover object-right transition-transform duration-1000 ease-[var(--ease-out)] group-hover:scale-[1.05]" />
            </div>
            <h3 className="display t-h3 mt-7">{p.title}</h3>
            <p className="mt-3 text-ink-2">{p.body}</p>
            <ul className="mt-6 space-y-2.5">
              {p.points.map((pt) => (
                <li key={pt} className="flex items-baseline gap-3">
                  <span aria-hidden className="tag tag-plain size-2.5 shrink-0 bg-accent [--cut:4px]" />
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
