"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function DocAside() {
  const [heads, setHeads] = useState<{ id: string; text: string }[]>([]);
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("main article h2")];
    els.forEach((heading, i) => { if (!heading.id) heading.id = `section-${i + 1}`; });
    const frame = requestAnimationFrame(() => setHeads(els.map(heading => ({ id: heading.id, text: heading.textContent ?? "" }))));
    return () => cancelAnimationFrame(frame);
  }, []);
  return <div className="document-aside">{heads.length > 1 && <nav aria-label="On this page"><p>ON THIS PAGE</p><ol>{heads.map((heading, i) => <li key={heading.id}><a href={`#${heading.id}`}><span>{String(i + 1).padStart(2, "0")}</span>{heading.text}</a></li>)}</ol></nav>}<div className="document-aside-card"><p>LET’S TALK</p><h2>Have a question?</h2><span>We’re here to help you find the right next step.</span><Link href="/contact-us">Start a conversation ↗</Link></div></div>;
}
