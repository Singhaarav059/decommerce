"use client";
import { useEffect, useState } from "react";

export function PageLegend({ legend, label }: { legend: { label: string; detail: string }[]; label: string }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const headings = [...document.querySelectorAll<HTMLElement>("article h2")];
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) setActive(headings.indexOf(entry.target as HTMLElement)); }, { rootMargin: "-30% 0px -50% 0px" });
    headings.forEach(heading => observer.observe(heading));
    return () => observer.disconnect();
  }, []);
  return <nav className="document-legend" aria-label={label}><p>{label}</p><ol>{legend.map((item, i) => <li key={item.label} className={i === active ? "active" : ""}><span>{String(i + 1).padStart(2, "0")}</span><div><strong>{item.label}</strong><small>{item.detail}</small></div></li>)}</ol></nav>;
}
