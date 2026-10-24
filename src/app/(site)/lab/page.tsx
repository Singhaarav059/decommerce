import type { Metadata } from "next";
import { DragFilm } from "@/components/media/DragFilm";
import { RowList, StackList } from "@/components/home/StepText";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Headline } from "@/components/ui/Headline";
import { Tabs } from "@/components/ui/Tabs";
import { sequences } from "@/content/media";

export const metadata: Metadata = { title: "Lab", robots: { index: false, follow: false } };

const swatches = [
  ["studio", "#CEC5BD"],
  ["studio-light", "#DCD5CE"],
  ["ink", "#1B1915"],
  ["ink-2", "#45403A"],
  ["copper", "#74320F"],
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-16">
      <p className="eyebrow mb-8">{title}</p>
      {children}
    </section>
  );
}

/** The design system on one page (not linked, not indexed). */
export default function LabPage() {
  return (
    <main id="main" className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-[calc(var(--header-h)+56px)] pb-24">
      <Headline text="Design system." className="text-[clamp(2.6rem,6vw,6rem)]" />
      <Block title="Colour">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {swatches.map(([name, hex]) => (
            <li key={name}>
              <span className="block aspect-[4/3] rounded-[var(--radius-md)] shadow-[inset_0_0_0_1px_var(--line)]" style={{ background: hex }} />
              <span className="mt-2 block text-[0.9rem] font-semibold">{name}</span>
              <span className="block text-[0.9rem] text-ink-2">{hex}</span>
            </li>
          ))}
        </ul>
      </Block>
      <Block title="Type">
        <Headline as="p" text="One system behind every sale." className="text-[clamp(2.4rem,5.2vw,5.6rem)]" />
        <Headline as="p" text="Four systems, four answers." className="mt-8 text-[clamp(2.1rem,4vw,4rem)]" />
        <p className="mt-6 max-w-[60ch] text-ink-2">Body text is 18 pixels at 1.55 line height, never wider than sixty characters, in the same family as every headline.</p>
      </Block>
      <Block title="Buttons and links">
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="/contact-us" arrow>
            Book a demo
          </ButtonLink>
          <Button variant="secondary">See it work</Button>
          <a href="#" className="font-semibold text-copper underline-offset-4 hover:underline">
            Order management →
          </a>
        </div>
      </Block>
      <Block title="Lists">
        <div className="grid gap-12 md:grid-cols-2">
          <RowList active={1} rows={[{ key: "a", left: "Central warehouse", right: "In stock · 18 km" }, { key: "b", left: "Riverside store", right: "In stock · 2.4 km" }, { key: "c", left: "Old Town store", right: "Out of size M" }]} />
          <StackList rows={[{ key: "a", title: "Discover", body: "We map how you sell today." }, { key: "b", title: "Design", body: "One catalog and one stock model." }]} />
        </div>
      </Block>
      <Block title="Tabs and questions">
        <div className="grid gap-12 md:grid-cols-2">
          <Tabs label="Capabilities" items={[{ id: "a", label: "Routing", content: <p className="text-ink-2">Each order checks every location.</p> }, { id: "b", label: "Returns", content: <p className="text-ink-2">Return anything anywhere.</p> }]} />
          <Faq items={[{ q: "Is the order data real?", a: "No. ORD-1042 and every SKU shown are illustrative." }, { q: "Does it work on phones?", a: "Yes. Every film has a phone crop and loads after the page." }]} />
        </div>
      </Block>
      <Block title="Drag film">
        <DragFilm pattern={sequences.hero.pattern} mobilePattern={sequences.hero.mobilePattern} from={0} to={sequences.hero.count - 1} label="Drag to look around" alt="The miniature store" className="max-w-4xl" />
      </Block>
    </main>
  );
}
