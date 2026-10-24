import type { ReactNode } from "react";
import type { DocMeta } from "@/content/types";
import { Scene } from "@/components/layout/Scene";
import { Headline } from "@/components/ui/Headline";
import scenes from "@/content/company/scenes.json";

export type SceneKey = keyof typeof scenes;

/**
 * Company and legal pages: the page opens on a full-bleed room of the store
 * that fits the page (the meeting table for Contact, the server cabinet for
 * Infrastructure), and the text continues on that room's floor colour.
 */
export function DocPage({ meta, scene, children, aside, after }: { meta: DocMeta; scene: SceneKey; children: ReactNode; aside?: ReactNode; after?: ReactNode }) {
  const { floor } = scenes[scene];
  return (
    <main id="main">
      <Scene src={`/assets/company/scene-${scene}.webp`} floor={floor} label={meta.title} priority>
        <div className="intro">
          <p className="eyebrow">{meta.eyebrow}</p>
          <Headline text={meta.headline} className="t-hero mt-3 md:mt-5" />
          <p className="t-lead mt-4 max-w-[44ch] text-ink-2 md:mt-6">{meta.description}</p>
        </div>
      </Scene>
      <div style={{ background: floor }} className="[--ink-2:var(--ink)] [--ink-soft:var(--ink)]">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 border-t border-ink/10 px-[var(--gutter)] py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
          <article className="prose-copy text-[1.05rem] [&>*:first-child]:mt-0">
            {meta.draftNote && <p className="mb-10 max-w-[62ch] rounded-[var(--radius-md)] border border-copper/60 bg-paper/60 px-4 py-3 text-sm text-ink">{meta.draftNote}</p>}
            {children}
          </article>
          {aside && <aside className="min-w-0">{aside}</aside>}
        </div>
        {after}
      </div>
    </main>
  );
}
