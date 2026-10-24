import Image from "next/image";
import Link from "next/link";
import type { DocMeta } from "@/content/types";
import { Headline } from "@/components/ui/Headline";
import { Reveal } from "@/components/ui/Reveal";

/** About: numbered principles (revealed one by one) and the three-company family as linked rooms. */
export function AboutExtras({ meta }: { meta: DocMeta }) {
  return (
    <>
      {meta.principles && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-20 md:py-28">
            <h2 className="eyebrow">Decommerce principles</h2>
            <Reveal as="ol" className="mt-10 divide-y divide-line border-y border-line" stagger={120}>
              {meta.principles.map((p, i) => (
                <li key={p.title} data-reveal-item className="grid grid-cols-[3.5rem_1fr] gap-4 py-7 md:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1.2fr)] md:gap-10">
                  <span className="display text-4xl text-copper-ink md:text-6xl">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display self-center text-3xl md:text-4xl">{p.title}</h3>
                  <p className="col-start-2 max-w-[48ch] self-center leading-relaxed text-ink-soft md:col-start-3">{p.body}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      )}
      {meta.family && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-20 md:py-28">
            <p className="eyebrow">The family</p>
            <Headline as="h2" text="Three companies, one team." className="mt-3 text-[clamp(2.4rem,5vw,4rem)]" />
            <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {meta.family.map((f) => {
                const external = f.href.startsWith("http");
                const body = (
                  <>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-travertine">
                      <Image src={f.poster} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]" />
                      
                    </div>
                    <p className="mt-4 flex items-center justify-between text-lg font-medium">
                      {f.name}
                      {!f.current && <span aria-hidden className="text-copper-ink">{external ? "↗" : "→"}</span>}
                    </p>
                    <p className="mt-1 text-ink-soft">{f.role}</p>
                  </>
                );
                return (
                  <li key={f.name}>
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
          </div>
        </section>
      )}
    </>
  );
}
