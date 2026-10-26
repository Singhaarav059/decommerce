import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Faq } from "@/components/ui/Faq";
import { homeFaq } from "@/content/home";
import { AskAi } from "@/components/ui/AskAi";

/** The questions retailers ask first: the heading, a photo of the counter and the ask-an-AI buttons stay while the tiles scroll past. */
export function HomeFaq() {
  return (
    <Section
      id="questions"
      tone="soft"
      headline={homeFaq.headline}
      layout="split"
      headerAside={
        <>
          <div className="tag tag-lg relative mt-10 hidden aspect-[5/4] overflow-hidden lg:block">
            <Image src="/assets/sol/clienteling/end.webp" alt="" fill sizes="40vw" quality={75} className="object-cover" style={{ objectPosition: "82% 50%" }} />
          </div>
          <AskAi className="mt-8" />
        </>
      }
    >
      <Faq items={homeFaq.items} tile="bg-paper" />
    </Section>
  );
}
