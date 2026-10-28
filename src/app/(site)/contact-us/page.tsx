import type { Metadata } from "next";
import Content, { meta } from "@/content/company/contact-us.mdx";
import { DocPage } from "@/components/page/DocPage";
import { DemoForm } from "@/components/forms/DemoForm";
import { Steps } from "@/components/page/Steps";
import { HomeFaq } from "@/components/home/HomeFaq";
import { contactInclude, contactNext } from "@/content/company";

export const metadata: Metadata = { title: meta.title, description: meta.description, alternates: { canonical: "/contact-us" } };

export default function Page() {
  const demoMode = process.env.DEMO_PREVIEW_MODE === "1";
  const configuredEmail = process.env.DEMO_CONTACT_EMAIL?.trim();
  const contactEmail = configuredEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail) ? configuredEmail : undefined;
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
          <DemoForm contactEmail={demoMode ? undefined : contactEmail} demoMode={demoMode} />
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
      {contactEmail && <p className="mt-8 text-ink-soft">{demoMode ? <>Example contact: {contactEmail} (placeholder only).</> : <>Prefer email? Write to <a className="text-accent-ink underline underline-offset-4" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</>}</p>}
    </DocPage>
  );
}
