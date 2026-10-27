import { Section } from "@/components/ui/Section";
import { Faq } from "@/components/ui/Faq";
import { homeFaq, askAi } from "@/content/home";
import { AskPreview } from "@/components/ui/AskPreview";

/** The questions retailers ask first: the heading and the question an AI assistant would be sent stay while the tiles scroll past. */
export function HomeFaq() {
  return (
    <Section id="questions" tone="soft" headline={homeFaq.headline} layout="split" headerAside={<AskPreview className="mt-10" prompt={askAi.prompt} />}>
      <Faq items={homeFaq.items} tile="bg-paper" />
    </Section>
  );
}
