import Link from "next/link";
import type { ReactNode } from "react";
import { Headline } from "@/components/ui/Headline";

/** Copy panel used by the pinned homepage chapters. */
export function ChapterCard({
  eyebrow,
  headline,
  body,
  links,
  children,
  className = "",
}: {
  eyebrow: string;
  headline: string;
  body?: string;
  links?: { label: string; href: string }[];
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-[440px] rounded-[var(--radius-lg)] bg-stone-50 p-6 md:p-7 ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <Headline as="h2" text={headline} className="mt-3 text-[clamp(2rem,4.2vw,3.3rem)]" />
      {body && <p className="mt-3 leading-relaxed text-ink-soft">{body}</p>}
      {children}
      {links && links.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group inline-flex items-center gap-1.5 text-[0.92rem] font-medium text-copper-ink">
                {l.label}
                <span aria-hidden className="transition-transform duration-300 ease-[var(--ease-overshoot)] group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Positions a chapter card over a pinned stage: left-middle on wide screens, bottom on phones. */
export function StageCopy({ children, visible = true }: { children: ReactNode; visible?: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      className={`absolute inset-x-0 bottom-[5svh] z-40 mx-auto max-w-[var(--max-w)] px-[var(--gutter)] transition-[opacity,transform] duration-700 ease-[var(--ease-out)] md:top-1/2 md:bottom-auto md:-translate-y-1/2 lg:pl-[calc(var(--gutter)+150px)] ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
