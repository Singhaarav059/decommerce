import { ButtonLink } from "@/components/ui/Button";
import { Headline } from "@/components/ui/Headline";

/** Phase 1 placeholder. The ten-chapter homepage lands in phase 6. */
export default function HomePage() {
  return (
    <main id="main" className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-[calc(var(--header-h)+96px)] pb-32">
      <p className="eyebrow">Unified commerce</p>
      <Headline text="One system behind *every sale*." className="mt-5 max-w-[12ch] text-[clamp(3.2rem,10vw,8.5rem)]" />
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/contact-us" arrow>
          Book a demo
        </ButtonLink>
        <ButtonLink href="#story" variant="secondary">
          See it work
        </ButtonLink>
      </div>
    </main>
  );
}
