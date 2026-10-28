"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { companyGroup, solutionGroups } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) { setLastPath(path); setOpen(false); }
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return <header className="site-header">
    <div className="site-header-bar">
      <Link href="/" className="site-logo" aria-label="Decommerce home">decommerce<span>.</span></Link>
      <nav className="site-header-links" aria-label="Quick navigation"><button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="site-menu">Solutions <span aria-hidden="true">⌄</span></button><Link href="/integrations">Integrations</Link><Link href="/about-us">About</Link></nav>
      <div className="site-header-actions"><Link href="/contact-us" className="site-header-cta">Let’s talk <span aria-hidden>↗</span></Link><button type="button" className="site-menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="site-menu">{open ? "Close" : "All pages"}<span aria-hidden>{open ? "×" : "+"}</span></button></div>
    </div>
    <nav id="site-menu" aria-label="Main navigation" className={`site-menu ${open ? "is-open" : ""}`} inert={!open}>
      <div className="site-menu-intro"><span>EXPLORE DECOMMERCE</span><p>Find your<br /><em>next page.</em></p><Link href="/contact-us" onClick={() => setOpen(false)}>Start a conversation ↗</Link></div>
      <div className="site-menu-groups">{[...solutionGroups, companyGroup].map(group => <div key={group.label}><p>{group.label}</p><ul>{group.items.map(item => <li key={item.href}><Link href={item.href} onClick={() => setOpen(false)}>{item.label}<span aria-hidden> ↗</span></Link></li>)}</ul></div>)}</div>
    </nav>
  </header>;
}
