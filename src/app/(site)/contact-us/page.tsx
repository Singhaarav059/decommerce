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
      aside={
        <div className="rounded-[var(--radius-lg)] bg-stone-50 p-6 shadow-[inset_0_0_0_1px_var(--line)] md:p-8 lg:-mt-48">
          <DemoForm />
        </div>
      }
    >
      <Content />
      <p className="mt-8 text-ink-soft">
        Prefer email? Write to{" "}
        <a className="text-copper-ink underline underline-offset-4" href={`mailto:${brand.demoEmail}`}>
          {brand.demoEmail}
        </a>
        .
      </p>
    </DocPage>
  );
}
