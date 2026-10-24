import type { Metadata } from "next";
import Content, { meta } from "@/content/company/glossary.mdx";
import { DocPage } from "@/components/page/DocPage";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function Page() {
  return (
    <DocPage meta={meta} scene="office" articleClassName="lg:columns-2 lg:gap-16 [&>h3]:break-after-avoid [&>h3]:border-t [&>h3]:border-line [&>h3]:pt-5 [&>h3]:text-[1.25rem] [&>h3]:first:mt-0 [&>p]:break-inside-avoid">
      <Content />
    </DocPage>
  );
}
