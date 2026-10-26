"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * The sidebar for company and legal pages that have none of their own: a contents list built
 * from the article's headings (the one being read is marked), then a framed photograph of the
 * page's room with a short way to talk to the team.
 */
export function DocAside({ image }: { image: string }) {
  const [heads, setHeads] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("main article h2")];
    els.forEach((h, i) => {
      if (!h.id) h.id = `section-${i + 1}`;
    });
    const raf = requestAnimationFrame(() => setHeads(els.map((h) => ({ id: h.id, text: h.textContent ?? "" }))));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLElement));
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );
    els.forEach((h) => io.observe(h));
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);
  return (
    <div className="sticky top-[calc(var(--header-h)+24px)] space-y-8">
      {heads.length > 1 && (
        <nav aria-label="On this page">
          <p className="text-[0.875rem] font-semibold">On this page</p>
          <ol className="mt-4">
            {heads.map((h, i) => (
              <li key={h.id} className="">
                <a href={`#${h.id}`} className={`flex items-baseline gap-3 py-2.5 text-[0.95rem] transition-colors ${i === active ? "font-semibold text-ink" : "text-ink-2 hover:text-ink"}`}>
                  {h.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="tag tag-sm tag-plain overflow-hidden bg-studio-light">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={image} alt="" fill sizes="440px" quality={80} className="object-cover object-[85%_50%]" />
          </div>
        </div>
        <div className="p-5">
          <p className="font-semibold">Questions about this page?</p>
          <p className="mt-1 text-[0.95rem] text-ink-2">Talk to the team that builds and runs Decommerce.</p>
          <Link href="/contact-us" className="link-u mt-4 inline-block text-[0.95rem] font-semibold text-copper">
            Book a demo →
          </Link>
        </div>
      </div>
    </div>
  );
}
