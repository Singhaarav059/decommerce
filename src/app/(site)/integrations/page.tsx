import type { Metadata } from "next";
import { PageHero } from "@/components/page/PageHero";
import { Related } from "@/components/page/Related";
import { IntegrationsSection } from "@/components/home/IntegrationsSection";
import { Section } from "@/components/ui/Section";
import { Faq } from "@/components/ui/Faq";
import { AskPreview } from "@/components/ui/AskPreview";
import { integrations as it } from "@/content/integrations";
import { sceneFilm } from "@/components/page/DocPage";

export const metadata: Metadata = { title: it.meta.title, description: it.meta.description, alternates: { canonical: "/integrations" } };

/** Integrations: how Decommerce connects to the systems a retailer keeps, by kind of system. */
export default function Page() {
  return (
    <main id="main">
      <PageHero eyebrow="Company" headline="Keep what works. Connect the rest." description={it.meta.description} image="/assets/company/scene-infrastructure.webp" film={sceneFilm("infrastructure")} />
      <IntegrationsSection link={false} />
      <Section eyebrow="By kind of system" headline="What Decommerce connects to." lead="Ready connections and custom links, set up by our team as part of every engagement.">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {it.categories.map((c) => (
            <li key={c.name} className="rv flex flex-col rounded-[var(--radius-lg)] bg-studio-light p-6">
              <h3 className="mt-4 text-[1.15rem] font-semibold">{c.name}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{c.body}</p>
            </li>
          ))}
          <li className="rv flex flex-col rounded-[var(--radius-lg)] bg-ink p-6 text-paper sm:col-span-2 lg:col-span-4">
            <h3 className="text-[1.15rem] font-semibold">{it.apis.title}</h3>
            <p className="mt-2 max-w-[70ch] text-[0.95rem] leading-relaxed text-paper/80">{it.apis.body}</p>
          </li>
        </ul>
      </Section>
      <Section tone="soft" eyebrow="Questions" headline="Integrations, answered.">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <Faq items={it.faq} />
          </div>
          <AskPreview className="lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:col-span-4 lg:row-start-1 lg:self-start" prompt="How does Decommerce (unified commerce from Demaze Technologies) integrate with an existing ERP, accounting, payments, couriers and marketplaces?" />
        </div>
      </Section>
      <Related />
    </main>
  );
}
