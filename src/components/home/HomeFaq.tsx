import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Faq } from "@/components/ui/Faq";
import { homeFaq } from "@/content/home";

export function HomeFaq({ index = "07" }: { index?: string }) {
  return (
    <Section id="questions" index={index} eyebrow={homeFaq.eyebrow} headline={homeFaq.headline}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div aria-hidden className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-[calc(var(--header-h)+24px)] aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-ink/5">
            <Image src="/assets/sol/clienteling/end.webp" alt="" fill sizes="40vw" quality={80} className="object-cover object-[72%_50%]" />
          </div>
        </div>
        <Faq items={homeFaq.items} className="lg:col-span-7" />
      </div>
    </Section>
  );
}
