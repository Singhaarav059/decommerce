import type { Metadata } from "next";
import Content, { meta } from "@/content/company/infrastructure.mdx";
import { DocPage } from "@/components/page/DocPage";
import { PageLegend } from "@/components/page/PageLegend";

export const metadata: Metadata = { title: meta.title, description: meta.description, alternates: { canonical: "/infrastructure" } };

export default function Page() {
  return (
    <DocPage meta={meta} scene="infrastructure" aside={meta.layers && <PageLegend label="On this page" legend={meta.layers} />}>
      <Content />
    </DocPage>
  );
}
