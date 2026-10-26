import Image from "next/image";
import Link from "next/link";
import { brand, companyGroup, legalLinks, solutionGroups } from "@/content/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { FooterCta } from "./FooterCta";
import { BackToTop } from "./BackToTop";

/**
 * The floor of every page: the closing band (one word, one link), then the brand promise, the
 * same groups as the header as plain link columns, and the wordmark built large as the last line.
 */
export function Footer() {
  const columns = [...solutionGroups, companyGroup];
  return (
    <footer className="relative z-[var(--z-raised)] overflow-clip bg-studio-light text-ink">
      <FooterCta />
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-20 md:pt-28">

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Wordmark className="text-[1.75rem]" />
            <p className="display rv mt-8 max-w-[14ch] text-[clamp(1.6rem,2.4vw,2.2rem)] text-ink">{brand.promise}</p>
            <p className="mt-5 max-w-[34ch] leading-relaxed text-ink-2">{brand.tagline}</p>
            <Link href={brand.team.href} className="group mt-8 flex max-w-[360px] items-center gap-4">
              <span className="tag tag-sm relative block aspect-[4/3] w-28 shrink-0 overflow-hidden">
                <Image src={brand.team.image} alt="" fill sizes="112px" quality={70} className="object-cover object-right transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.08]" />
              </span>
              <span className="font-semibold transition-colors group-hover:text-copper">
                {brand.team.label} <span aria-hidden>→</span>
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:col-span-8">
            {columns.map((g) => (
              <nav key={g.label} aria-label={g.label}>
                <p className="text-[0.94rem] font-semibold text-ink">{g.label}</p>
                <ul className="mt-4 space-y-2.5">
                  {g.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-[0.94rem] text-ink-2 transition-colors duration-200 hover:text-copper">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 py-6 text-[0.875rem] text-ink-2 md:flex-row md:items-center md:justify-between">
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
      {/* the wordmark built large as the page's last line, sitting on the floor */}
      <p aria-hidden className="pointer-events-none mx-auto -mb-[0.2em] max-w-[var(--max-w)] px-[var(--gutter)] text-[clamp(3.5rem,15.5vw,14.5rem)] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap text-ink select-none">
        {brand.name}
        <span className="text-copper">.</span>
      </p>
    </footer>
  );
}
