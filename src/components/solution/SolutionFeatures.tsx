"use client";

import { CinematicMedia } from "@/components/media/CinematicMedia";
import Link from "next/link";
import { useState } from "react";
import type { Feature } from "@/content/solutions/features";

export function SolutionFeatures({ title, items, connects, image }: { title: string; items: Feature[]; connects: string[]; image: string }) {
  const [active, setActive] = useState(0);
  const feature = items[active];
  return <section className="solution-discover" id="capabilities">
    <div className="solution-discover-top"><div><p className="section-kicker"><span /> INSIDE {title.toUpperCase()}</p><h2>Made for the<br /><em>way you work.</em></h2></div><p>Explore the details that bring the whole experience together.</p></div>
    <div className="solution-discover-layout"><div className="solution-discover-list" aria-label={`${title} capabilities`}>
      {items.map((item, index) => <button key={item.title} type="button" aria-pressed={active === index} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2,"0")}</span><strong>{item.title}</strong><span aria-hidden>{active === index ? "↗" : "+"}</span>{active === index && <span className="solution-discover-mobile-copy">{item.body}</span>}</button>)}
    </div><div className="solution-discover-stage"><CinematicMedia image={image} /><div className="solution-discover-card" aria-live="polite"><p>CAPABILITY {String(active+1).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</p><h3>{feature.title}</h3><p>{feature.body}</p></div></div></div>
    <div className="solution-discover-connections"><span>WORKS WITH</span><p>{connects.join(" / ")}</p><Link href="/integrations">Explore integrations ↗</Link></div>
  </section>;
}
