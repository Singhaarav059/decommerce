import Link from "next/link";
import { CinematicMedia } from "@/components/media/CinematicMedia";

export function HomeHero() {
  return <section id="ch-store" className="new-hero" aria-labelledby="hero-title">
    <div className="new-hero-scene"><CinematicMedia image="/assets/editorial/commerce-studio-v1.png" alt="A 3D illustration of a connected retail counter, garments and parcel" priority /><div className="new-hero-image-label"><span>ONE CONNECTED WORLD</span><span>01 / 03</span></div></div>
    <div className="new-hero-content"><div className="new-hero-topline"><span>THE COMMERCE COLLECTION</span><span>BUILT FOR WHAT’S NEXT</span></div><div className="new-hero-main"><p className="new-hero-eyebrow"><span /> ONE PLATFORM. EVERY POSSIBILITY.</p><h1 id="hero-title">Make every<br /><em>sale connect.</em></h1><div className="new-hero-bottom"><p>From your online store to the shop floor and beyond, bring your entire commerce world together.</p><div className="new-hero-actions"><Link href="/contact-us" className="new-hero-primary">Let’s talk <span aria-hidden="true">↗</span></Link><Link href="#what-we-do" className="new-hero-secondary">Explore the platform <span aria-hidden="true">↓</span></Link></div></div></div><div className="new-hero-foot"><span>ONE CATALOG · ONE CONNECTED BUSINESS</span><span>SCROLL TO EXPLORE ↓</span></div></div>
  </section>;
}
