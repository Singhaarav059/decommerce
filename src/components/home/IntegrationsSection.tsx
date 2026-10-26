import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { IntegrationHub } from "@/components/page/IntegrationHub";
import { integrations as it } from "@/content/integrations";

/** Works with what you run today: connect, sync, migrate, consolidate, beside the integration hub. */
export function IntegrationsSection({ index = "06", link = true }: { index?: string; link?: boolean }) {
  return (
    <Section id="integrations" index={index} tone="soft" eyebrow={it.eyebrow} headline={it.headline} lead={it.body}>
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <ol className="space-y-3 lg:col-span-5">
          {it.steps.map((s, i) => (
            <li key={s.title} className="rv flex gap-5 rounded-[var(--radius-lg)] bg-paper p-5 ring-1 ring-black/5">
              <span className="display flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-[0.95rem] text-paper">{i + 1}</span>
              <div>
                <h3 className="text-[1.1rem] font-semibold">{s.title}</h3>
                <p className="mt-1 text-[0.95rem] text-ink-2">{s.body}</p>
              </div>
            </li>
          ))}
          {link && (
            <li className="pt-3">
              <Link href="/integrations" className="link-u font-semibold text-copper">
                See every kind of integration →
              </Link>
            </li>
          )}
        </ol>
        <div className="lg:col-span-7">
          <IntegrationHub />
        </div>
      </div>
    </Section>
  );
}
