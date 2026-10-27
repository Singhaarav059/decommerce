import Image from "next/image";
import { HeroFilm } from "./HeroFilm";

/**
 * The opening of a company or legal page, in the homepage's language: a giant headline (words
 * rise in) with the description beside it, then the page's room of the store in a wide tag-shaped
 * window that opens as it scrolls into view. The scene is composed around its people (scripts/v7),
 * so the window is cropped from the middle and nothing washes over it. `film`, when the scene has one,
 * plays once as the window comes into view (HeroFilm).
 */
export function PageHero({ headline, description, image, film }: { eyebrow?: string; headline: string; description: string; image: string; film?: string }) {
  const plain = headline.replace(/\*/g, "");
  const words = plain.split(" ");
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-[var(--max-w)] gap-8 px-[var(--gutter)] pt-[calc(var(--header-h)+clamp(32px,7vh,96px))] lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h1 className="display text-[clamp(2.8rem,7.4vw,7.6rem)] leading-[0.92] tracking-[-0.045em]" aria-label={plain}>
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
        <div className="rv-media">
          <div className="tag tag-xl relative aspect-[4/3] overflow-hidden md:aspect-[21/9]">
            <Image src={image} alt="" fill priority sizes="100vw" quality={85} className="object-cover object-[50%_45%]" />
            {film && <HeroFilm src={film} className="object-[50%_45%]" />}
          </div>
        </div>
      </div>
    </section>
  );
}
