import Link from "next/link";
import type { ReactNode } from "react";
import { Headline } from "@/components/ui/Headline";

/** The text inside one pinned-film step: label, headline, body, extras, links. */
export function StepText({
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
      <Headline as="h2" text={headline} className="t-step-h" />
      {body && <p className="mt-3 max-w-[40ch] t-step text-ink-2 md:mt-5">{body}</p>}
      {children}
      {links && links.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 md:mt-7">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="link-u font-semibold text-copper">
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
    <ol className="mt-4 max-w-md text-[0.92rem] md:mt-7 md:text-base">
      {rows.map((r, i) => (
        <li
          key={r.key}
          className={`relative flex items-baseline justify-between gap-4 py-1.5 transition-[color,padding] duration-300 md:py-2.5 ${i === active ? "pl-4 font-semibold text-ink" : "text-ink-2"}`}
        >
          <span aria-hidden className={`absolute top-1/2 left-0 tag tag-plain size-2.5 -translate-y-1/2 bg-copper [--cut:4px] transition-[opacity,scale] duration-300 ${i === active ? "scale-100 opacity-100" : "scale-75 opacity-0"}`} />
          <span>{r.left}</span>
          {r.right != null && <span className="tabular text-right">{r.right}</span>}
        </li>
      ))}
    </ol>
  );
}

/** A hairline list of titles with a short description stacked under each. */
export function StackList({ rows }: { rows: { key: string; title: ReactNode; body: string }[] }) {
  return (
    <ul className="mt-4 max-w-md md:mt-7">
      {rows.map((r) => (
        <li key={r.key} className=" py-1.5 md:py-2.5">
          <p className="font-semibold text-ink">{r.title}</p>
          <p className="mt-0.5 text-[0.92rem] leading-snug text-ink-2">{r.body}</p>
        </li>
      ))}
    </ul>
  );
}
