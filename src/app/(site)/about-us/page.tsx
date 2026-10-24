import type { Metadata } from "next";
import Content, { meta } from "@/content/company/about-us.mdx";
import { DocPage } from "@/components/page/DocPage";
import { AboutExtras } from "@/components/page/AboutExtras";

export const metadata: Metadata = { title: meta.title, description: meta.description, alternates: { canonical: "/about-us" } };

export default function Page() {
  return (
    <DocPage meta={meta} scene="about-us" after={<AboutExtras meta={meta} />}>
      <Content />
    </DocPage>
  );
}
