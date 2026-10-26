"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerCta } from "@/content/site";

/**
 * The closing call to action as one link: a copper band cut like a giant hang tag, with a single
 * word set across its full width. On hover and focus the band and the word swap colours.
 * Skipped on pages that already end on the demo form.
 */
export function FooterCta() {
  const path = usePathname();
  if (path === "/" || path === "/contact-us") return null;
  return (
    <Link
      href={footerCta.primary.href}
      className="tag tag-xl group relative block bg-copper text-paper transition-colors duration-150 hover:bg-ink focus-visible:bg-ink focus-visible:outline-none"
    >
      <div className="mx-auto flex min-h-[46svh] max-w-[var(--max-w)] flex-col justify-between px-[var(--gutter)] pt-[clamp(104px,13vw,196px)] pb-6 md:min-h-[60svh]">
        <div className="flex items-start justify-between gap-6">
          <p className="max-w-[30ch] text-[1.06rem] leading-snug md:text-[1.25rem]">{footerCta.body}</p>
          <svg aria-hidden viewBox="0 0 48 48" className="size-8 shrink-0 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:-translate-y-1 md:size-12">
            <path d="M12 36 36 12M16 12h20v20" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>
        <p className="text-[clamp(6rem,27vw,24rem)] leading-[0.78] font-bold tracking-[-0.06em] whitespace-nowrap">
          {footerCta.word}
          <span aria-hidden className="text-ink transition-colors duration-150 group-hover:text-copper-bright">.</span>
          <span className="sr-only"> ({footerCta.primary.label})</span>
        </p>
      </div>
    </Link>
  );
}
