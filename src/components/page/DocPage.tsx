import type { ReactNode } from "react";
import type { DocMeta } from "@/content/types";
import { Headline } from "@/components/ui/Headline";

/** Company and legal pages: type-led on the studio surface, an optional sticky still beside the text. */
export function DocPage({ meta, children, aside, after }: { meta: DocMeta; children: ReactNode; aside?: ReactNode; after?: ReactNode }) {
  return (
    <main id="main">
      <section className="border-b border-line pt-[calc(var(--header-h)+clamp(56px,8vw,112px))] pb-[clamp(48px,6vw,88px)]">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)]">
          <p className="eyebrow">{meta.eyebrow}</p>
          <Headline text={meta.headline} className="mt-4 max-w-[18ch] text-[clamp(2.6rem,6vw,6rem)]" />
          <p className="mt-5 max-w-[52ch] text-ink-2">{meta.description}</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_400px]">
        <article className="prose-copy text-[1.05rem] [&>*:first-child]:mt-0">
          {meta.draftNote && (
            <p className="mb-10 max-w-[62ch] rounded-[var(--radius-md)] border border-copper px-4 py-3 text-sm text-ink">
              {meta.draftNote}
            </p>
          )}
          {children}
        </article>
        {aside && <aside className="min-w-0">{aside}</aside>}
      </div>
      {after}
    </main>
  );
}
