import Link from "next/link";
import { CinematicMedia } from "@/components/media/CinematicMedia";

export function SolutionHero({ title, eyebrow, headline, body, poster }: { title: string; eyebrow: string; headline: string; body: string; poster: string }) {
  return <section className="solution-cinema" aria-labelledby="solution-title">
    <div className="solution-cinema-frame"><CinematicMedia image={poster} priority /></div>
    <div className="solution-cinema-overlay"><div className="solution-cinema-copy"><p className="solution-hero-series">THE COMMERCE COLLECTION <span>DECOMMERCE</span></p><p className="editorial-kicker"><span /> {eyebrow} / {title}</p><h1 id="solution-title">{headline.replace(/\*/g, "")}</h1><div className="solution-cinema-bottom"><p>{body}</p><div><Link href="/contact-us" className="new-hero-primary">Book a demo ↗</Link><a href="#solution-story" className="solution-explore">Explore this solution ↓</a></div></div></div><p className="solution-cinema-caption"><span>SCROLL TO EXPLORE</span><span aria-hidden>↓</span></p></div>
  </section>;
}
