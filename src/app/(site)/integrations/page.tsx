import type { Metadata } from "next";
import { PageHero } from "@/components/page/PageHero";
import { Related } from "@/components/page/Related";
import { IntegrationHub } from "@/components/page/IntegrationHub";
import { Steps } from "@/components/page/Steps";
import { Faq } from "@/components/ui/Faq";
import { integrations as it } from "@/content/integrations";
import { integrationEditorial } from "@/content/company/editorial";

export const metadata: Metadata = { title: it.meta.title, description: it.meta.description, alternates: { canonical: "/integrations" } };
export default function Page() {
  return <main id="main">
    <PageHero eyebrow="Integrations" headline="Keep what works. Connect the rest." description={it.meta.description} image={integrationEditorial.image} />
    <section className="integration-intro"><div><p className="section-kicker"><span /> CONNECTED BY DESIGN</p><h2>Everything in<br /><em>its right place.</em></h2><p>{it.body}</p><span>ILLUSTRATIVE LIVE SYNC →</span></div><IntegrationHub /></section>
    <section className="solution-features integrations-categories"><div className="solution-features-head"><p className="section-kicker"><span /> YOUR COMMERCE ECOSYSTEM</p><h2>Keep the tools.<br /><em>Connect the dots.</em></h2><p>Our team connects Decommerce with the systems you choose to keep.</p></div><div className="solution-features-grid">{it.categories.map((category, i) => <article key={category.name}><span>{String(i+1).padStart(2,"0")} / {String(it.categories.length).padStart(2,"0")}</span><h3>{category.name}</h3><p>{category.body}</p></article>)}<article><span>BEYOND THE LIST</span><h3>{it.apis.title}</h3><p>{it.apis.body}</p></article></div></section>
    <Steps eyebrow="HOW WE CONNECT" headline="A smoother way to move." body="Bring your systems together one step at a time." steps={it.steps} />
    <section className="solution-faq"><div><p className="section-kicker"><span /> GOOD TO KNOW</p><h2>Questions?<br /><em>Let’s clear them up.</em></h2></div><Faq items={it.faq} /></section>
    <Related />
  </main>;
}
