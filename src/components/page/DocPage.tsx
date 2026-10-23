import type { ReactNode } from "react";
import type { DocMeta } from "@/content/types";
import { Headline } from "@/components/ui/Headline";

/** Company and legal pages: type-led, terrazzo band, no WebGL. */
export function DocPage({ meta, children, aside }: { meta: DocMeta; children: ReactNode; aside?: ReactNode }) {
  return (
    <main id="main">
      <section className="terrazzo relative overflow-hidden pt-[calc(var(--header-h)+72px)] pb-16 md:pb-24">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <p className="eyebrow">{meta.eyebrow}</p>
          <Headline text={meta.headline} className="mt-5 max-w-[14ch] text-[clamp(3rem,9vw,7.5rem)]" />
        </div>
      </section>
      <div className="mx-auto grid max-w-[var(--max-w)] gap-12 px-[var(--gutter)] py-16 md:py-24 lg:grid-cols-[1fr_380px]">
        <article className="prose-copy text-[1.05rem] [&>*:first-child]:mt-0">
          {meta.draftNote && (
            <p className="mb-10 max-w-[62ch] rounded-[var(--radius-md)] border border-copper/40 bg-copper/5 px-4 py-3 text-sm text-copper-ink">
              {meta.draftNote}
            </p>
          )}
          {children}
        </article>
        {aside && <aside>{aside}</aside>}
      </div>
    </main>
  );
}
