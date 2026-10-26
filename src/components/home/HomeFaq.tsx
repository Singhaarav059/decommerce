import { Section } from "@/components/ui/Section";
import { Faq } from "@/components/ui/Faq";
import { homeFaq } from "@/content/home";
import { AskAi } from "@/components/ui/AskAi";

/** The questions retailers ask first: the heading stays while the tiles scroll past. */
export function HomeFaq() {
  return (
    <Section id="questions" tone="soft" headline={homeFaq.headline} layout="split" headerAside={<AskAi className="mt-10" />}>
      <Faq items={homeFaq.items} tile="bg-paper" />
    </Section>
  );
}
