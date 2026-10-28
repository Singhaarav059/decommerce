import Image from "next/image";
import Link from "next/link";
import type { DocMeta } from "@/content/types";
import { aboutNumbers } from "@/content/company";
import { proof, engagement } from "@/content/home";
import { Steps } from "./Steps";

export function AboutExtras({ meta }: { meta: DocMeta }) {
  return <>
    {meta.principles && <section className="about-principles"><div><p className="section-kicker"><span /> WHAT GUIDES US</p><h2>Built with<br /><em>intention.</em></h2><p>The ideas that shape how we build and work together.</p></div><ol>{meta.principles.map((principle, i) => <li key={principle.title}><span>0{i + 1}</span><div><h3>{principle.title}</h3><p>{principle.body}</p></div></li>)}</ol></section>}
    <section className="about-numbers"><div><p className="section-kicker"><span /> {aboutNumbers.eyebrow}</p><h2>{aboutNumbers.headline}</h2><p>{aboutNumbers.body}</p></div><dl>{proof.stats.map(stat => <div key={stat.label}><dd>{stat.value}{stat.suffix}</dd><dt>{stat.label}</dt></div>)}</dl></section>
    {meta.family && <section className="about-family"><div className="solution-related-head"><div><p className="section-kicker"><span /> THE FAMILY</p><h2>Three companies.<br /><em>One team.</em></h2></div><p>Different perspectives, working together.</p></div><div className="about-family-grid">{meta.family.map((member, index) => <Link href={member.href} key={member.name} className="about-family-card"><div><Image src={["/assets/editorial/team-studio-v1.png", "/assets/editorial/integrations-studio-v1.png", "/assets/editorial/commerce-studio-v1.png"][index] ?? member.poster} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" /></div><h3>{member.name}<span aria-hidden>↗</span></h3><p>{member.role}</p>{member.current && <small>YOU ARE HERE</small>}</Link>)}</div></section>}
    <Steps eyebrow={engagement.eyebrow} headline={engagement.headline} body={engagement.body} steps={engagement.steps} />
  </>;
}
