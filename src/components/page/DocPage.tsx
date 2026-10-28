import type { ReactNode } from "react";
import type { DocMeta } from "@/content/types";
import { PageHero } from "./PageHero";
import scenes from "@/content/company/scenes.json";
import { Related } from "./Related";
import { DocAside } from "./DocAside";
import { companyEditorial } from "@/content/company/editorial";

export type SceneKey = keyof typeof scenes;

export function DocPage({ meta, scene, children, aside, after, articleClassName = "" }: { meta: DocMeta; scene: SceneKey; children: ReactNode; aside?: ReactNode; after?: ReactNode; articleClassName?: string }) {
  return <main id="main">
    <PageHero eyebrow={meta.eyebrow} headline={meta.headline} description={meta.description} image={companyEditorial[scene].image} />
    <div className="document-world"><div className="document-heading"><p className="section-kicker"><span /> {meta.eyebrow}</p><p>THE DETAILS, MADE CLEAR.</p></div><div className="document-grid"><article className={`prose-copy document-copy ${articleClassName}`}>{meta.draftNote && <p className="document-note">{meta.draftNote}</p>}{children}</article><aside>{aside ?? <DocAside />}</aside></div>{after}<Related /></div>
  </main>;
}
