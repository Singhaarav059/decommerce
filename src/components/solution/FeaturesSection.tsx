import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import type { Feature } from "@/content/solutions/features";
import { inSentence } from "@/lib/text";

/** Everything in a module: its features beside a close-up of it at work, and what it connects to. */
export function FeaturesSection({ title, features, connects, image }: { title: string; features: Feature[]; connects: string[]; image: string }) {
  return (
    <Section id="capabilities" eyebrow="What's included" headline={`Everything in ${inSentence(title)}.`}>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] bg-studio-light lg:aspect-[4/5]">
              <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 40vw" quality={85} className="object-cover object-right" />
              <div className="absolute inset-x-4 bottom-4 rounded-[var(--radius-lg)] bg-paper/95 p-4">
                <p className="text-[0.8rem] font-semibold text-ink-2">Connects to</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {connects.map((c) => (
                    <li key={c} className="bg-studio-light px-3 py-1 text-[0.82rem] font-medium">
                      {c}
                    </li>
                  ))}
                </ul>
                <Link href="/integrations" className="link-u mt-3 inline-block text-[0.85rem] font-semibold text-accent">
                  All integrations →
                </Link>
              </div>
            </div>
          </div>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
          {features.map((f) => (
            <li key={f.title} className="rv flex flex-col rounded-[var(--radius-lg)] bg-studio-light p-6">
              <h3 className="mt-4 text-[1.15rem] font-semibold tracking-[-0.01em]">{f.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{f.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
