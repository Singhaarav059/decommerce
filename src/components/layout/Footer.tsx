import Link from "next/link";
import { brand, companyGroup, legalLinks, solutionGroups } from "@/content/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { FooterCta } from "./FooterCta";

export function Footer() {
  const columns = [...solutionGroups, companyGroup];
  return (
    <footer className="relative z-[var(--z-raised)] overflow-clip bg-night text-paper [--copper:#f4c19e]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-20 md:pt-28">
        <FooterCta />

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pt-14 md:gap-x-8 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-y-12">
          <div className="col-span-2 lg:col-span-1">
            <Wordmark className="text-[1.75rem]" />
            <p className="mt-4 max-w-[32ch] text-[0.95rem] leading-relaxed text-paper/65">{brand.tagline}</p>
          </div>
          {columns.map((g) => (
            <nav key={g.label} aria-label={g.label}>
              <p className="text-[0.8rem] font-semibold text-paper/60">{g.label}</p>
              <ul className="mt-4 space-y-2.5">
                {g.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="link-u text-[0.94rem] text-paper/85 transition-colors hover:text-paper">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/12 py-6 text-[0.84rem] text-paper/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {brand.legalName} · A{" "}
            <a href={brand.parent.href} className="link-u text-paper/80 hover:text-paper">
              {brand.parent.name}
            </a>{" "}
            company · Sister to{" "}
            <a href={brand.sibling.href} className="link-u text-paper/80 hover:text-paper">
              {brand.sibling.name}
            </a>
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-u hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/llms.txt" className="link-u hover:text-paper">
                llms.txt
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* the wordmark set large as the page's last line, cropped by the floor */}
      <p aria-hidden className="pointer-events-none mx-auto -mb-[0.24em] max-w-[var(--max-w)] px-[var(--gutter)] text-[clamp(3.5rem,15vw,14rem)] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap text-paper/[0.07] select-none">
        {brand.name}
        <span className="text-copper/40">.</span>
      </p>
    </footer>
  );
}
