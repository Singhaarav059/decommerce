"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * A sticky photographed still beside a long text page, with a legend of the
 * page's sections. The legend item for the section being read is highlighted.
 */
export function PageStill({ src, alt, legend }: { src: string; alt: string; legend?: { label: string; detail: string }[] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!legend) return;
    const heads = [...document.querySelectorAll<HTMLElement>("article h2")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(heads.indexOf(e.target as HTMLElement));
      },
      { rootMargin: "-30% 0px -50% 0px" },
    );
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [legend]);
  return (
    <figure className="sticky top-[calc(var(--header-h)+24px)]">
      <div className="feather relative aspect-[4/3]">
        <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 400px" className="object-cover" />
      </div>
      {legend && (
        <figcaption>
          <ol className="mt-4 border-t border-line">
            {legend.map((l, i) => (
              <li key={l.label} className={`flex items-baseline justify-between gap-4 border-b border-line py-2 text-[0.95rem] ${i === active ? "font-semibold text-ink" : "text-ink-2"}`}>
                <span>{l.label}</span>
                <span className="text-right text-[0.9rem] font-normal text-ink-2">{l.detail}</span>
              </li>
            ))}
          </ol>
        </figcaption>
      )}
    </figure>
  );
}
