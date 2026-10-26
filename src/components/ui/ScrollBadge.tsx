import { useId } from "react";

/** A round badge with lettering turning around an arrow, set on the seam between a photo and the page. */
export function ScrollBadge({ label = "Scroll to look inside", className = "" }: { label?: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  const text = `${label} · ${label} · `;
  return (
    <span aria-hidden className={`relative flex size-[104px] items-center justify-center rounded-full bg-paper shadow-[var(--shadow-md)] ring-1 ring-black/5 ${className}`}>
      <svg viewBox="0 0 100 100" className="badge-ring absolute inset-0 size-full">
        <defs>
          <path id={`badge-${id}`} d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" />
        </defs>
        <text className="fill-[var(--ink-2)] text-[8.6px] font-medium tracking-[0.12em] uppercase">
          <textPath href={`#badge-${id}`}>{text}</textPath>
        </text>
      </svg>
      <span className="flex size-9 items-center justify-center rounded-full bg-ink text-paper">↓</span>
    </span>
  );
}
