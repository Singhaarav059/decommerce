import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { IntegrationHub } from "@/components/page/IntegrationHub";
import { integrations as it } from "@/content/integrations";

/** Works with what you run today: connect, sync, migrate, consolidate, beside the integration hub. */
export function IntegrationsSection({ link = true }: { link?: boolean }) {
  return (
    <Section id="integrations" tone="soft" eyebrow={it.eyebrow} headline={it.headline} lead={it.body}>
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <ol className="space-y-5 lg:col-span-5">
          {it.steps.map((s) => (
            <li key={s.title} className="rv flex gap-5 py-2">
              <span aria-hidden className="tag tag-plain mt-[0.45em] size-3.5 shrink-0 bg-copper [--cut:5px]" />
              <div>
                <h3 className="display text-[1.5rem] leading-tight">{s.title}</h3>
                <p className="mt-1.5 text-ink-2">{s.body}</p>
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
