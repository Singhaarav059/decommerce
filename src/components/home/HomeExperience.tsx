import Image from "next/image";
import Link from "next/link";
import { Rack } from "./Rack";
import { CinematicMedia } from "@/components/media/CinematicMedia";
import { Faq } from "@/components/ui/Faq";
import { homeFaq } from "@/content/home";
import { solutionGroups } from "@/content/site";

const chapters = [
  { n: "01", tag: "THE STOREFRONT", title: "Make every first impression count.", body: "Create a shopping experience that feels like your brand, with products, prices and stock connected to the rest of your business.", image: "/assets/editorial/online-studio-v1.png", href: "/storefront", link: "Explore storefront" },
  { n: "02", tag: "THE JOURNEY", title: "From a click to their doorstep.", body: "Give every order a smoother journey. Find the right stock, route the order and keep your teams moving together.", image: "/assets/editorial/logistics-studio-v1.png", href: "/oms", link: "Explore order management" },
  { n: "03", tag: "THE STORE", title: "Bring the magic back to the shop floor.", body: "Give your people a complete view of products and customers, so they can make every interaction feel personal.", image: "/assets/editorial/store-studio-v1.png", href: "/clienteling", link: "Explore in-store" },
];

export function HomeExperience() {
  return <>
    <section className="world-intro"><p className="section-kicker"><span /> A WORLD BUILT AROUND YOU</p><h2>Every touchpoint.<br /><em>One connected world.</em></h2><p>From the first visit to the final delivery, see how every part of your business can work as one.</p><span aria-hidden>↓</span></section>
    <div className="world-chapters">{chapters.map(chapter => <section className="world-chapter" key={chapter.n}><div className="world-chapter-image"><CinematicMedia image={chapter.image} sizes="(max-width: 767px) 100vw, 65vw" /><span>{chapter.n} / 03</span></div><div className="world-chapter-copy"><p className="section-kicker"><span /> {chapter.tag}</p><h2>{chapter.title}</h2><p>{chapter.body}</p><Link href={chapter.href}>{chapter.link} <span>↗</span></Link></div></section>)}</div>
    <section className="rack-experience"><div className="rack-experience-copy"><p className="section-kicker"><span /> THE STOREFRONT EXPERIENCE</p><h2>Your rail,<br /><em>online.</em></h2><p>Your products are ready for every channel. Explore the collection to see how it could feel.</p><Link href="/storefront">Discover storefront ↗</Link></div><div className="rack-experience-stage"><span aria-hidden>the collection.</span><Rack /></div><p className="rack-hint">DRAG TO EXPLORE THE COLLECTION ↔</p></section>
    <section className="platform-index" id="modules"><div className="platform-index-header"><p className="section-kicker"><span /> EXPLORE THE PLATFORM</p><h2>One platform.<br /><em>All the possibilities.</em></h2><p>Start where you need to. Add more as you grow. Every solution works together.</p></div><div className="platform-groups">{solutionGroups.map((group, i) => <div key={group.label}><div className="platform-group-title"><span>0{i+1}</span><h3>{group.label}</h3></div><ul>{group.items.map(item => <li key={item.href}><Link href={item.href}><span>{item.label}</span><span aria-hidden>↗</span></Link></li>)}</ul></div>)}</div></section>
    <section className="home-manifesto"><div className="home-manifesto-image"><Image src="/assets/editorial/team-studio-v1.png" alt="" fill sizes="100vw" className="object-cover" /></div><div className="home-manifesto-copy"><p className="editorial-kicker"><span /> BUILT WITH YOU</p><h2>Big ideas.<br /><em>Real people.</em></h2><p>Good commerce takes more than great software. Our team helps you connect, launch and keep growing.</p><Link href="/about-us">Meet the team ↗</Link></div></section>
    <section className="solution-faq home-questions"><div><p className="section-kicker"><span /> GOOD TO KNOW</p><h2>A little more<br /><em>clarity.</em></h2><p>Everything you need to know to get started.</p></div><Faq items={homeFaq.items} /></section>
  </>;
}
