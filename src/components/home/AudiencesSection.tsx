import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { audiences } from "@/content/home";

/** Who Decommerce is for: three kinds of retailer, each with what it usually starts with. */
export function AudiencesSection() {
  return (
    <Section id="who-its-for" index="05" eyebrow={audiences.eyebrow} headline={audiences.headline} lead={audiences.body}>
      <ul className="grid gap-4 md:grid-cols-3">
        {audiences.groups.map((g) => (
          <li key={g.title} className="rv">
            <Link href={g.href} className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] bg-paper shadow-[var(--shadow-sm)] ring-1 ring-black/5 transition-[translate,box-shadow] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
              <span className="relative block aspect-[16/10] overflow-hidden bg-studio-light">
                <Image src={g.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" quality={80} className="object-cover object-[72%_50%] transition-transform duration-1000 ease-[var(--ease-out)] group-hover:scale-[1.05]" />
              </span>
              <span className="flex flex-1 flex-col p-6 md:p-7">
                <span className="display t-h3">{g.title}</span>
                <span className="mt-3 mb-6 text-ink-2">{g.body}</span>
                <span className="mt-auto space-y-2 border-t border-line pt-5 text-[0.95rem]">
                  {g.points.map((p) => (
                    <span key={p} className="flex items-baseline gap-3">
                      <span aria-hidden className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-copper-bright" />
                      {p}
                    </span>
                  ))}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
