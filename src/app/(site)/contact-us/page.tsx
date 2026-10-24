import type { Metadata } from "next";
import Content, { meta } from "@/content/company/contact-us.mdx";
import { DocPage } from "@/components/page/DocPage";
import { DemoForm } from "@/components/forms/DemoForm";
import { brand } from "@/content/site";

export const metadata: Metadata = { title: meta.title, description: meta.description, alternates: { canonical: "/contact-us" } };

export default function Page() {
  return (
    <DocPage
      meta={meta}
      scene="contact-us"
      aside={
        <div className="rounded-[var(--radius-xl)] bg-paper p-6 shadow-[var(--shadow-sm)] md:p-8 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <DemoForm />
        </div>
      }
    >
      <Content />
      <p className="mt-8 text-ink-soft">
        Prefer email? Write to{" "}
        <a className="text-copper-ink underline decoration-copper/40 decoration-[1.5px] underline-offset-4 hover:decoration-copper" href={`mailto:${brand.demoEmail}`}>
          {brand.demoEmail}
        </a>
        .
      </p>
    </DocPage>
  );
}
