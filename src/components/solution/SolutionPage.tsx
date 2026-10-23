import type { Metadata } from "next";
import { solutionBySlug, type SolutionSlug } from "@/content/site";
import { Headline } from "@/components/ui/Headline";
import { SceneThumb } from "@/components/ui/SceneThumb";

export function solutionMetadata(slug: SolutionSlug): Metadata {
  const item = solutionBySlug(slug);
  return { title: item.label, description: item.blurb };
}

/** Phase 1 stub. Replaced by the seven-block template in phase 7. */
export function SolutionPage({ slug }: { slug: SolutionSlug }) {
  const item = solutionBySlug(slug);
  return (
    <main id="main" className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-[calc(var(--header-h)+72px)] pb-24">
      <SceneThumb slug={slug} className="h-24 w-32" />
      <p className="eyebrow mt-8">Solution</p>
      <Headline text={`${item.label}: *coming together*.`} className="mt-4 text-[clamp(2.8rem,8vw,6rem)]" />
      <p className="mt-6 max-w-[48ch] text-lg text-ink-soft">{item.blurb}.</p>
    </main>
  );
}
