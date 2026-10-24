import type { Metadata } from "next";
import Content, { meta } from "@/content/company/contact-us.mdx";
import { DocPage } from "@/components/page/DocPage";
import { DemoForm } from "@/components/forms/DemoForm";
import { brand } from "@/content/site";
import { Steps } from "@/components/page/Steps";
import { HomeFaq } from "@/components/home/HomeFaq";
import { contactInclude, contactNext } from "@/content/company";

export const metadata: Metadata = { title: meta.title, description: meta.description, alternates: { canonical: "/contact-us" } };

export default function Page() {
  return (
    <DocPage
      meta={meta}
      scene="contact-us"
      after={
        <>
          <Steps index="01" {...contactNext} backdrop="/assets/company/scene-office.webp" />
          <HomeFaq index="02" />
        </>
      }
      aside={
        <div className="rounded-[var(--radius-xl)] bg-paper p-6 shadow-[var(--shadow-sm)] md:p-8 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <DemoForm />
        </div>
      }
    >
      <Content />
      <div className="not-prose mt-10 max-w-[56ch] rounded-[var(--radius-lg)] border border-line-strong p-6">
        <p className="eyebrow">{contactInclude.title}</p>
        <ul className="mt-4 space-y-2.5">
          {contactInclude.items.map((i) => (
            <li key={i} className="flex items-baseline gap-3 text-ink">
              <span aria-hidden className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-copper" />
              {i}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-8 text-ink-soft">
        Prefer email? Write to{" "}
        <a className="text-copper-ink underline decoration-copper/40 decoration-[1.5px] underline-offset-4 hover:decoration-copper" href={`mailto:${brand.demoEmail}`}>
          {brand.demoEmail}
        </a>
        .
      </p>
    </DocPage>
  );
}
