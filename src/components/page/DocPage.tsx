import type { ReactNode } from "react";
import type { DocMeta } from "@/content/types";
import { Scene } from "@/components/layout/Scene";
import { Headline } from "@/components/ui/Headline";
import scenes from "@/content/company/scenes.json";
import { Related } from "./Related";
import { DocAside } from "./DocAside";

export type SceneKey = keyof typeof scenes;

/**
 * Company and legal pages: the page opens on a full-bleed room of the store
 * that fits the page (the meeting table for Contact, the server cabinet for
 * Infrastructure), and the text continues on the studio surface.
 */
export function DocPage({ meta, scene, children, aside, after, articleClassName = "" }: { meta: DocMeta; scene: SceneKey; children: ReactNode; aside?: ReactNode; after?: ReactNode; articleClassName?: string }) {
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
      <div className="bg-studio">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] py-[var(--section-gap)] lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
          <article className={`prose-copy text-[1.05rem] [&>*:first-child]:mt-0 [&>p:first-child]:text-[length:var(--fs-lead)] [&>p:first-child]:text-ink ${articleClassName}`}>
            {meta.draftNote && <p className="mb-10 max-w-[62ch] rounded-[var(--radius-md)] border border-copper/60 bg-paper/60 px-4 py-3 text-sm text-ink">{meta.draftNote}</p>}
            {children}
          </article>
          <aside className="min-w-0">{aside ?? <DocAside image={`/assets/company/scene-${scene}.webp`} />}</aside>
        </div>
        {after}
        <Related />
      </div>
    </main>
  );
}
