import Link from "next/link";
import { brand, companyGroup, legalLinks, solutionGroups } from "@/content/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { FooterCta } from "./FooterCta";
import { BackToTop } from "./BackToTop";

/**
 * The night floor of every page: the closing call to action, the brand promise set large,
 * the same numbered groups as the header, and the wordmark cropped by the page's last edge.
 */
export function Footer() {
  const columns = [...solutionGroups, companyGroup];
  return (
    <footer className="relative z-[var(--z-raised)] overflow-clip bg-studio-light text-ink [--copper:#8a3912]">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-20 md:pt-28">
        <FooterCta />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Wordmark className="text-[1.75rem]" />
            <p className="display rv mt-8 max-w-[14ch] text-[clamp(1.6rem,2.4vw,2.2rem)] text-ink">
              One catalog. One stock count. One customer record.
            </p>
            <p className="mt-5 max-w-[34ch] text-[0.95rem] leading-relaxed text-ink-2">{brand.tagline}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:col-span-8">
            {columns.map((g, gi) => (
              <nav key={g.label} aria-label={g.label}>
                <p className="flex items-center gap-2 border-b border-ink/12 pb-3 text-[0.8rem] font-semibold text-ink-2">
                  <span className="tabular text-copper">{String(gi + 1).padStart(2, "0")}</span>
                  {g.label}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {g.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="group inline-flex items-center gap-2 text-[0.94rem] text-ink transition-colors hover:text-ink">
                        <span aria-hidden className="h-px w-0 bg-copper transition-[width] duration-300 ease-[var(--ease-out)] group-hover:w-3" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-ink/12 py-6 text-[0.84rem] text-ink-2 md:flex-row md:items-center md:justify-between">
          <p>
            © {brand.legalName} · A{" "}
            <a href={brand.parent.href} className="link-u text-ink hover:text-ink">
              {brand.parent.name}
            </a>{" "}
            company · Sister to{" "}
            <a href={brand.sibling.href} className="link-u text-ink hover:text-ink">
              {brand.sibling.name}
            </a>
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-u hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/llms.txt" className="link-u hover:text-ink">
                  llms.txt
                </Link>
              </li>
            </ul>
            <BackToTop />
          </div>
        </div>
      </div>
      {/* the wordmark set large as the page's last line, cropped by the floor; it draws in as an outline, then fills */}
      <p aria-hidden className="pointer-events-none mx-auto -mb-[0.24em] max-w-[var(--max-w)] px-[var(--gutter)] text-[clamp(3.5rem,15vw,14rem)] leading-[0.8] font-semibold tracking-[-0.06em] wordmark-draw whitespace-nowrap text-ink/[0.07] select-none">
        {brand.name}
        <span className="text-copper/40">.</span>
      </p>
    </footer>
  );
}
