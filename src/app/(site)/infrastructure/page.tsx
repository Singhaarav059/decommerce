import type { Metadata } from "next";
import Content, { meta } from "@/content/company/infrastructure.mdx";
import { DocPage } from "@/components/page/DocPage";
import { ExplodedStack } from "@/components/page/ExplodedStack";

export const metadata: Metadata = { title: meta.title, description: meta.description, alternates: { canonical: "/infrastructure" } };

export default function Page() {
  return (
    <DocPage meta={meta} aside={meta.layers && <ExplodedStack layers={meta.layers} variant="rack" label="Exploded server rack: storefronts, APIs, background jobs, database, backups" />}>
      <Content />
    </DocPage>
  );
}
