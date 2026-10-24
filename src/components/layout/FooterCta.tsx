"use client";

import { usePathname } from "next/navigation";
import { footerCta } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Headline } from "@/components/ui/Headline";

/** The closing call to action, skipped on pages that already end on the demo form. */
export function FooterCta() {
  const path = usePathname();
  if (path === "/" || path === "/contact-us") return null;
  return (
    <div className="grid gap-8 border-b border-paper/12 pb-16 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:pb-20">
      <div>
        <p className="eyebrow !text-paper/70">{footerCta.eyebrow}</p>
        <Headline as="h2" reveal text={footerCta.headline} className="t-h2 mt-5 max-w-[16ch]" />
        <p className="t-lead mt-5 max-w-[46ch] text-paper/70">{footerCta.body}</p>
      </div>
      <ButtonLink href={footerCta.primary.href} arrow className="!bg-paper !text-ink hover:!bg-copper hover:!text-paper">
        {footerCta.primary.label}
      </ButtonLink>
    </div>
  );
}
