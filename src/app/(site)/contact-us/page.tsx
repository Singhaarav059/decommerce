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
          <Steps {...contactNext} graphics={["message", "reply", "launch", "build"]} />
          <HomeFaq />
        </>
      }
      aside={
        <div className="tag tag-lg tag-plain bg-studio-light p-6 pt-12 md:p-8 md:pt-14 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <DemoForm />
        </div>
      }
    >
      <Content />
      <div className="not-prose tag tag-sm tag-plain mt-10 max-w-[56ch] bg-studio-light p-6 pt-8">
        <p className="text-[0.875rem] font-semibold">{contactInclude.title}</p>
        <ul className="mt-4 space-y-2.5">
          {contactInclude.items.map((i) => (
            <li key={i} className="flex items-baseline gap-3 text-ink">
              <span aria-hidden className="tag tag-plain size-2.5 shrink-0 [--cut:4px] bg-accent" />
              {i}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-8 text-ink-soft">
        Prefer email? Write to{" "}
        <a className="text-accent-ink underline decoration-accent/40 decoration-[1.5px] underline-offset-4 hover:decoration-accent" href={`mailto:${brand.demoEmail}`}>
          {brand.demoEmail}
        </a>
        .
      </p>
    </DocPage>
  );
}
