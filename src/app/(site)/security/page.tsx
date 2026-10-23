import type { Metadata } from "next";
import Content, { meta } from "@/content/company/security.mdx";
import { DocPage } from "@/components/page/DocPage";
import { ExplodedStack } from "@/components/page/ExplodedStack";

export const metadata: Metadata = { title: meta.title, description: meta.description, alternates: { canonical: "/security" } };

export default function Page() {
  return (
    <DocPage meta={meta} aside={meta.layers && <ExplodedStack layers={meta.layers} label="Security layers: access, encryption, audit, backups" />}>
      <Content />
    </DocPage>
  );
}
