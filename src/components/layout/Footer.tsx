import Link from "next/link";
import { brand, companyGroup, legalLinks, solutionGroups } from "@/content/site";
import { Wordmark } from "@/components/ui/Wordmark";

export function Footer() {
  const columns = [...solutionGroups, companyGroup];
  return (
    <footer className="relative z-10 bg-ink text-stone-50">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-16 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            <Wordmark className="text-[2rem]" />
            <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-stone-50/65">{brand.tagline}</p>
          </div>
          {columns.map((g) => (
            <div key={g.label}>
              <p className="eyebrow !text-stone-50/70">{g.label}</p>
              <ul className="mt-4 space-y-2.5">
                {g.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[0.92rem] text-stone-50/80 transition-colors hover:text-copper">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-stone-50/15 pt-6 text-[0.82rem] text-stone-50/70 md:flex-row md:items-center md:justify-between">
          <p>
            A{" "}
            <a href={brand.parent.href} className="underline-offset-4 hover:text-stone-50 hover:underline">
              {brand.parent.name}
            </a>{" "}
            company · Sister to{" "}
            <a href={brand.sibling.href} className="underline-offset-4 hover:text-stone-50 hover:underline">
              {brand.sibling.name}
            </a>
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-stone-50">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/llms.txt" className="hover:text-stone-50">
                llms.txt
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
