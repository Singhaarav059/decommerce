import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SolutionHero } from "./SolutionHero";
import { SolutionFeatures } from "./SolutionFeatures";
import { SolutionFlow } from "./SolutionFlow";
import { Faq } from "@/components/ui/Faq";
import { solutionBySlug, type SolutionSlug } from "@/content/site";
import { solutions } from "@/content/solutions";
import { solutionEditorial } from "@/content/solutions/editorial";
import { features, connects } from "@/content/solutions/features";

export function solutionMetadata(slug: SolutionSlug): Metadata {
  const { meta } = solutions[slug];
  return { title: meta.title, description: meta.description, alternates: { canonical: solutionBySlug(slug).href }, openGraph: { title: `${meta.title} · Decommerce`, description: meta.description } };
}

export function SolutionPage({ slug }: { slug: SolutionSlug }) {
  const { meta, Content } = solutions[slug];
  const editorial = solutionEditorial[slug];
  return <main id="main">
    <SolutionHero title={meta.title} eyebrow={meta.eyebrow} headline={meta.headline} body={meta.promise} poster={editorial} />
    <section id="solution-story" className="solution-story"><div className="solution-story-heading"><p className="section-kicker"><span /> A BETTER WAY</p><h2>{meta.fix.title.replace(/\*/g, "")}</h2></div><div className="solution-story-grid"><SolutionFlow title={meta.title} steps={meta.fix.steps} /><div className="solution-story-text"><p className="mini-label">THE OPPORTUNITY</p><h3>{meta.problem.title.replace(/\*/g, "")}</h3><div className="solution-narrative"><Content /></div><p className="solution-story-guide">Select each step to explore how the workflow comes together.</p><a className="solution-story-link" href="#capabilities">Explore what’s inside ↗</a></div></div></section>
    <SolutionFeatures title={meta.title} items={features[slug]} connects={connects[slug]} image={editorial} />
    <section className="solution-related"><div className="solution-related-head"><div><p className="section-kicker"><span /> THE BIGGER PICTURE</p><h2>Better together.</h2></div><p>One catalog connects every part of your commerce world.</p></div><div className="solution-related-grid">{meta.worksWith.map(s => { const item = solutionBySlug(s); return <Link href={item.href} key={s}><div><Image src={solutionEditorial[s]} alt="" fill sizes="(max-width: 767px) 70vw, 25vw" className="object-cover" /></div><p>{item.label}<span>↗</span></p><small>{item.blurb}</small></Link>; })}</div></section>
    <section className="solution-faq"><div><p className="section-kicker"><span /> GOOD TO KNOW</p><h2>Questions?<br /><em>Let’s clear them up.</em></h2></div><Faq items={meta.faq} /></section>
  </main>;
}
