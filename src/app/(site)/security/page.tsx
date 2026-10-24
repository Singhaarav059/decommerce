import type { Metadata } from "next";
import Content, { meta } from "@/content/company/security.mdx";
import { DocPage } from "@/components/page/DocPage";
import { PageLegend } from "@/components/page/PageLegend";

export const metadata: Metadata = { title: meta.title, description: meta.description, alternates: { canonical: "/security" } };

export default function Page() {
  return (
    <DocPage meta={meta} scene="security" aside={meta.layers && <PageLegend label="On this page" legend={meta.layers} />}>
      <Content />
    </DocPage>
  );
}
