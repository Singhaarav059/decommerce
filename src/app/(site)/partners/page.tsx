import type { Metadata } from "next";
import Content, { meta } from "@/content/company/partners.mdx";
import { DocPage } from "@/components/page/DocPage";
import { Steps } from "@/components/page/Steps";
import { partnerFlow } from "@/content/company";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function Page() {
  return (
    <DocPage meta={meta} scene="partners" after={<Steps {...partnerFlow} />}>
      <Content />
    </DocPage>
  );
}
