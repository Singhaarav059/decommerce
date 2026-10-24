import type { Metadata } from "next";
import Content, { meta } from "@/content/company/security.mdx";
import { DocPage } from "@/components/page/DocPage";
import { PageStill } from "@/components/page/PageStill";

export const metadata: Metadata = { title: meta.title, description: meta.description, alternates: { canonical: "/security" } };

export default function Page() {
  return (
    <DocPage meta={meta} aside={<PageStill src="/assets/company/security.webp" alt="Four stacked slabs, glass, copper, terrazzo and travertine, slightly apart like an exploded view." legend={meta.layers} />}>
      <Content />
    </DocPage>
  );
}
