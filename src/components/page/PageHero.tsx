import { CinematicMedia } from "@/components/media/CinematicMedia";

export function PageHero({ eyebrow = "Decommerce", headline, description, image }: { eyebrow?: string; headline: string; description: string; image: string }) {
  const plain = headline.replace(/\*/g, "");
  return <section className="editorial-hero">
    <div className="editorial-hero-media"><CinematicMedia image={image} priority sizes="(max-width: 767px) 100vw, 55vw" /></div>
    <div className="editorial-hero-copy"><p className="editorial-kicker"><span /> {eyebrow}</p><h1>{plain}</h1><div className="editorial-hero-bottom"><p>{description}</p><span>THE WORLD OF DECOMMERCE ↓</span></div></div>
  </section>;
}
