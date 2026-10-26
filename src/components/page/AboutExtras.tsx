import Image from "next/image";
import Link from "next/link";
import type { DocMeta } from "@/content/types";
import { Section } from "@/components/ui/Section";
import { EngagementSection } from "@/components/home/EngagementSection";
import { aboutNumbers } from "@/content/company";
import { proof } from "@/content/home";

/** About: principles, Demaze's own numbers, the three-company family, and how an engagement runs. */
export function AboutExtras({ meta }: { meta: DocMeta }) {
  return (
    <>
      {meta.principles && (
        <Section eyebrow="Decommerce principles" headline="Five rules we build by.">
          <ol className="">
            {meta.principles.map((p) => (
              <li key={p.title} className="rv group grid grid-cols-[2.5rem_1fr] gap-4 py-7 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1.2fr)] md:gap-10">
                <span aria-hidden className="tag tag-plain mt-1 size-6 bg-accent [--cut:8px] transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1 md:size-8 md:[--cut:10px]" />
                <h3 className="display t-h3 self-center">{p.title}</h3>
                <p className="col-start-2 max-w-[48ch] self-center leading-relaxed text-ink-2 md:col-start-3">{p.body}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}
      <Section tone="soft" eyebrow={aboutNumbers.eyebrow} headline={aboutNumbers.headline} lead={aboutNumbers.body}>
        <dl className="grid grid-cols-1 sm:grid-cols-3">
          {proof.stats.map((st) => (
            <div key={st.label} className="rv flex flex-col-reverse py-8 sm:px-8 sm:first:pl-0">
              <dt className="mt-3 text-ink-2">{st.label}</dt>
              <dd className="display tabular text-[clamp(3.4rem,7vw,6.4rem)]">
                {st.value}
                <span className="text-accent">{st.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>
      {meta.family && (
        <Section eyebrow="The family" headline="Three companies, one team.">
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {meta.family.map((f) => {
              const external = f.href.startsWith("http");
              const body = (
                <>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-travertine">
                    <Image src={f.poster} alt="" fill quality={85} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.05]" />
                    {f.current && <span className="absolute top-3 left-3 tag tag-xs tag-plain bg-paper py-1 pr-3 pl-4 text-[0.8125rem] font-semibold">You are here</span>}
                  </div>
                  <p className="mt-4 flex items-center justify-between text-lg font-semibold">
                    {f.name}
                    {!f.current && <span aria-hidden className="text-accent transition-transform duration-300 group-hover:translate-x-1">{external ? "↗" : "→"}</span>}
                  </p>
                  <p className="mt-1 text-ink-2">{f.role}</p>
                </>
              );
              return (
                <li key={f.name} className="rv">
                  {external ? (
                    <a href={f.href} className="group block" rel="noopener">
                      {body}
                    </a>
                  ) : (
                    <Link href={f.href} className="group block">
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </Section>
      )}
      <EngagementSection />
    </>
  );
}
