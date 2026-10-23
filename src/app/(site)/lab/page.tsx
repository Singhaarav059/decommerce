import type { Metadata } from "next";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ChapterRail } from "@/components/ui/ChapterRail";
import { Faq } from "@/components/ui/Faq";
import { Headline } from "@/components/ui/Headline";
import { Hotspots } from "@/components/ui/Hotspots";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SceneThumb } from "@/components/ui/SceneThumb";
import { StatCounter } from "@/components/ui/StatCounter";
import { Tabs } from "@/components/ui/Tabs";
import { allSolutions } from "@/content/site";

export const metadata: Metadata = { title: "Lab", robots: { index: false, follow: false } };

// Lab-only sample data (illustrative).
const chapters = [
  { id: "lab-type", label: "Type and buttons" },
  { id: "lab-counters", label: "Counters" },
  { id: "lab-hotspots", label: "Hotspots" },
  { id: "lab-tabs", label: "Tabs" },
  { id: "lab-faq", label: "FAQ" },
  { id: "lab-marquee", label: "Marquee" },
];

const hotspots = [
  { id: "screen", label: "Order screen", detail: "Shows ORD-1042 with its route and ETA.", x: 30, y: 30 },
  { id: "reader", label: "Card reader", detail: "Tap-to-pay, receipt in under two seconds (illustrative).", x: 58, y: 62 },
  { id: "printer", label: "Receipt printer", detail: "Prints the receipt and the return label.", x: 82, y: 40 },
];

const swatches = ["stone-50", "travertine", "terrazzo-chip", "ink", "copper", "olive", "steel"];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-16 md:py-24">
      <p className="eyebrow mb-8">{title}</p>
      {children}
    </section>
  );
}

export default function LabPage() {
  return (
    <main id="main" className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-[calc(var(--header-h)+48px)] pb-24 lg:pl-[calc(var(--gutter)+170px)]">
      <ChapterRail chapters={chapters} />
      <Headline text="Component *lab*." className="text-[clamp(3rem,9vw,7rem)]" />

      <Section id="lab-type" title="01 · Type, colour, buttons">
        <Reveal className="grid gap-10 lg:grid-cols-2">
          <div data-reveal-item>
            <Headline as="h2" text="One catalog, one stock count, *everywhere*." className="text-5xl md:text-6xl" />
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
              Body copy in Geist. Headlines in Instrument Serif with one italic accent word. Copper is the only accent.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact-us" arrow>Book a demo</ButtonLink>
              <Button variant="secondary">See it work</Button>
              <Button variant="ghost" arrow>Read more</Button>
            </div>
          </div>
          <ul data-reveal-item className="grid grid-cols-4 gap-3 sm:grid-cols-7 lg:grid-cols-4">
            {swatches.map((s) => (
              <li key={s}>
                <span className="block aspect-square rounded-[var(--radius-md)] shadow-[inset_0_0_0_1px_var(--line)]" style={{ background: `var(--${s})` }} />
                <span className="mt-2 block font-mono text-[0.68rem] text-ink-muted">{s}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <ul className="mt-14 grid grid-cols-3 gap-6 sm:grid-cols-6">
          {allSolutions.map((s) => (
            <li key={s.href} className="text-center">
              {s.slug && <SceneThumb slug={s.slug} className="mx-auto h-14 w-20" />}
              <span className="mt-2 block text-[0.75rem] text-ink-muted">{s.label}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="lab-counters" title="02 · Stat counters">
        <div className="grid gap-10 sm:grid-cols-3">
          <StatCounter value={45} suffix="+" label="Projects delivered by Demaze" />
          <StatCounter value={35} suffix="+" label="People at Demaze" />
          <StatCounter value={6} label="Years building software" />
        </div>
      </Section>

      <Section id="lab-hotspots" title="03 · Hotspots">
        <Hotspots items={hotspots} className="max-w-3xl">
          <div className="terrazzo aspect-[16/10] rounded-[var(--radius-lg)]">
            <SceneThumb slug="pos" className="size-full p-[12%]" />
          </div>
        </Hotspots>
      </Section>

      <Section id="lab-tabs" title="04 · Tabs">
        <Tabs
          label="Capabilities"
          className="max-w-2xl"
          items={[
            { id: "route", label: "Routing", content: <p className="text-ink-soft">Each order checks nearby locations and picks the closest one with stock.</p> },
            { id: "split", label: "Split shipment", content: <p className="text-ink-soft">When no single location has everything, the order ships from two.</p> },
            { id: "returns", label: "Returns", content: <p className="text-ink-soft">A return can go back to any store, not only the one that shipped it.</p> },
          ]}
        />
      </Section>

      <Section id="lab-faq" title="05 · FAQ">
        <Faq
          className="max-w-3xl"
          items={[
            { q: "Is the order data in these scenes real?", a: "No. ORD-1042 and every SKU shown are illustrative examples." },
            { q: "Does it work on phones?", a: "Yes. Phones get lighter scenes, and the slowest devices get still images and short video loops." },
            { q: "Can I use only one module?", a: "Yes. Each module works alone and connects to the others when you add them." },
          ]}
        />
      </Section>

      <Section id="lab-marquee" title="06 · Marquee">
        <Marquee
          label="Channels"
          items={["Website", "Store", "Warehouse", "Marketplace", "B2B portal", "Quick commerce"].map((t) => (
            <span key={t} className="display text-4xl md:text-6xl">
              {t} <span className="text-copper">·</span>
            </span>
          ))}
        />
      </Section>
    </main>
  );
}
