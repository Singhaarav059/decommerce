import Link from "next/link";
import type { ReactNode } from "react";
import { Headline } from "@/components/ui/Headline";

/** The text inside one pinned-film step: label, headline, body, extras, links. */
export function StepText({
  label,
  headline,
  body,
  children,
  links,
}: {
  label: string;
  headline: string;
  body?: string;
  children?: ReactNode;
  links?: { label: string; href: string }[];
}) {
  return (
    <>
      <p className="eyebrow">{label}</p>
      <Headline as="h2" text={headline} className="mt-4 text-[clamp(2.1rem,4vw,4rem)]" />
      {body && <p className="mt-4 max-w-[40ch] text-ink-2">{body}</p>}
      {children}
      {links && links.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="font-semibold text-copper underline-offset-4 hover:underline">
                {l.label} →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** A hairline list where one row can be marked as the active / chosen one. */
export function RowList({ rows, active }: { rows: { key: string; left: ReactNode; right?: ReactNode }[]; active?: number }) {
  return (
    <ol className="mt-6 max-w-md border-t border-line">
      {rows.map((r, i) => (
        <li key={r.key} className={`flex items-baseline justify-between gap-4 border-b border-line py-2 ${i === active ? "font-semibold text-ink" : "text-ink-2"}`}>
          <span>{r.left}</span>
          {r.right != null && <span className="text-right">{r.right}</span>}
        </li>
      ))}
    </ol>
  );
}

/** A hairline list of titles with a short description stacked under each. */
export function StackList({ rows }: { rows: { key: string; title: ReactNode; body: string }[] }) {
  return (
    <ul className="mt-6 max-w-md border-t border-line">
      {rows.map((r) => (
        <li key={r.key} className="border-b border-line py-2.5">
          <p className="font-semibold text-ink">{r.title}</p>
          <p className="mt-0.5 text-[0.92rem] leading-snug text-ink-2">{r.body}</p>
        </li>
      ))}
    </ul>
  );
}
