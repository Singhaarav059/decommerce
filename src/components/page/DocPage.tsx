import type { ReactNode } from "react";
import type { DocMeta } from "@/content/types";
import { PageHero } from "./PageHero";
import scenes from "@/content/company/scenes.json";
import { Related } from "./Related";
import { DocAside } from "./DocAside";

export type SceneKey = keyof typeof scenes;

/** The scene's short film (scripts/v7/build.mjs), if it has one. */
export const sceneFilm = (k: SceneKey) => ((scenes as Record<string, { film?: boolean }>)[k].film ? `/assets/company/film-${k}.mp4` : undefined);

/**
 * Company and legal pages: a giant headline on the night floor, then the room of the store
 * that fits the page (the meeting table for Contact, the server cabinet for Infrastructure)
 * in a wide window, then the text with its sidebar.
 */
export function DocPage({ meta, scene, children, aside, after, articleClassName = "" }: { meta: DocMeta; scene: SceneKey; children: ReactNode; aside?: ReactNode; after?: ReactNode; articleClassName?: string }) {
  return (
    <main id="main">
      <PageHero eyebrow={meta.eyebrow} headline={meta.headline} description={meta.description} image={`/assets/company/scene-${scene}.webp`} film={sceneFilm(scene)} />
      <div className="bg-studio">
        <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-1 gap-12 px-[var(--gutter)] py-[var(--section-gap)] lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
          <article className={`prose-copy text-[1.05rem] [&>*:first-child]:mt-0 [&>p:first-child]:mb-10 [&>p:first-child]:max-w-[30ch]! [&>p:first-child]:text-[clamp(1.5rem,2.3vw,2.2rem)]! [&>p:first-child]:leading-[1.22]! [&>p:first-child]:font-[450] [&>p:first-child]:tracking-[-0.02em] [&>p:first-child]:text-ink! ${articleClassName}`}>
            {meta.draftNote && <p className="mb-10 max-w-[62ch] rounded-[var(--radius-md)] border border-accent/60 bg-paper/60 px-4 py-3 text-sm text-ink">{meta.draftNote}</p>}
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
