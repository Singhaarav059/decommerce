import Image from "next/image";
import { ScrollBadge } from "@/components/ui/ScrollBadge";

/**
 * The opening of a company or legal page, in the homepage's language: the label and a giant
 * headline on the night floor (words rise in), the description beside it, then the page's
 * room of the store in a wide window that opens as it scrolls into view and dissolves into the page
 * at its foot, with a turning scroll badge on the seam.
 */
export function PageHero({ eyebrow, headline, description, image }: { eyebrow: string; headline: string; description: string; image: string }) {
  const plain = headline.replace(/\*/g, "");
  const words = plain.split(" ");
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-[var(--max-w)] gap-8 px-[var(--gutter)] pt-[calc(var(--header-h)+clamp(32px,7vh,96px))] lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="eyebrow intro">{eyebrow}</p>
          <h1 className="display mt-5 text-[clamp(2.8rem,7.4vw,7.6rem)] leading-[0.92] tracking-[-0.045em]" aria-label={plain}>
            {words.map((w, i) => (
              <span key={i} aria-hidden className="inline-block overflow-clip pb-[0.06em] align-top">
                <span className="hero-word inline-block" style={{ animationDelay: `${120 + i * 70}ms` }}>
                  {w}
                  {i < words.length - 1 ? " " : ""}
                </span>
              </span>
            ))}
          </h1>
        </div>
        <p className="intro t-lead max-w-[40ch] text-ink-2 lg:col-span-4 lg:pb-3">{description}</p>
      </div>
      <div className="relative mx-auto mt-10 max-w-[var(--max-w)] px-[var(--gutter)] md:mt-14">
        {/* the room dissolves into the page at its foot instead of ending on a hard edge */}
        <div className="rv-media">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-[var(--radius-xl)] [mask-image:linear-gradient(to_bottom,#000_62%,transparent)] md:aspect-[21/9]">
            <Image src={image} alt="" fill priority sizes="100vw" quality={85} className="object-cover object-[70%_50%]" />
          </div>
        </div>
        <ScrollBadge label="Scroll to read on" className="absolute bottom-[8%] left-1/2 -translate-x-1/2 max-md:hidden" />
      </div>
    </section>
  );
}
