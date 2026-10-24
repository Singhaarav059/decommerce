import type { Metadata } from "next";
import Content, { meta } from "@/content/company/infrastructure.mdx";
import { DocPage } from "@/components/page/DocPage";
import { PageStill } from "@/components/page/PageStill";

export const metadata: Metadata = { title: meta.title, description: meta.description, alternates: { canonical: "/infrastructure" } };

export default function Page() {
  return (
    <DocPage meta={meta} aside={<PageStill src="/assets/company/infrastructure.webp" alt="A brushed steel server rack with a travertine top on a terrazzo plinth." legend={meta.layers} />}>
      <Content />
    </DocPage>
  );
}
