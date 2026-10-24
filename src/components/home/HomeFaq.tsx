import { Section } from "@/components/ui/Section";
import { Faq } from "@/components/ui/Faq";
import { homeFaq } from "@/content/home";

export function HomeFaq({ index = "05" }: { index?: string }) {
  return (
    <Section id="questions" index={index} eyebrow={homeFaq.eyebrow} headline={homeFaq.headline}>
      <div className="grid lg:grid-cols-12">
        <Faq items={homeFaq.items} className="lg:col-span-7 lg:col-start-6" />
      </div>
    </Section>
  );
}
