import type { Metadata } from "next";
import Content, { meta } from "@/content/company/ai-instructions.mdx";
import { DocPage } from "@/components/page/DocPage";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function Page() {
  return (
    <DocPage meta={meta}>
      <Content />
    </DocPage>
  );
}
