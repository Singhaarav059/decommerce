"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { companyGroup } from "@/content/site";
import { companyEditorial, integrationEditorial } from "@/content/company/editorial";

export function Related() {
  const path = usePathname();
  const items = companyGroup.items.filter(item => item.href !== path).slice(0, 4);
  const art = (href: string) => href === "/integrations" ? integrationEditorial.image : href === "/security" ? companyEditorial.security.image : href === "/infrastructure" ? companyEditorial.infrastructure.image : companyEditorial["about-us"].image;
  return <section className="solution-related company-related" aria-labelledby="related-heading"><div className="solution-related-head"><div><p className="section-kicker"><span /> KEEP EXPLORING</p><h2 id="related-heading">More to the story.</h2></div><p>Get to know the people and ideas behind Decommerce.</p></div><div className="solution-related-grid">{items.map(item => <Link href={item.href} key={item.href}><div><Image src={art(item.href)} alt="" fill sizes="(max-width: 767px) 50vw, 25vw" className="object-cover" /></div><p>{item.label}<span aria-hidden>↗</span></p><small>{item.blurb}</small></Link>)}</div></section>;
}
