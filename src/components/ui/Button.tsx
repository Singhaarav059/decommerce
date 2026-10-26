import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-6 h-12 text-[0.95rem] font-semibold tracking-[-0.005em] " +
  "transition-[background-color,color,transform,box-shadow] duration-300 ease-[var(--ease-out)] active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-copper hover:shadow-[0_8px_20px_-8px_rgb(168_72_26/0.6)]",
  secondary: "bg-paper text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] hover:shadow-[inset_0_0_0_1px_var(--ink)]",
  ghost: "bg-transparent text-ink px-0 h-auto link-u rounded-none",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

/** Arrow that slides out to the right on hover while a second one slides in behind it. */
function Arrow() {
  return (
    <span aria-hidden className="relative -mr-1 inline-flex size-4 overflow-hidden">
      {[0, 1].map((k) => (
        <svg
          key={k}
          viewBox="0 0 16 16"
          className={`absolute inset-0 size-4 transition-transform duration-500 ease-[var(--ease-out)] ${k ? "-translate-x-full group-hover:translate-x-0" : "group-hover:translate-x-full"}`}
        >
          <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  arrow = false,
  className = "",
  children,
  ...rest
}: { href: string; variant?: Variant; arrow?: boolean; children: ReactNode } & Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  arrow = false,
  className = "",
  children,
  ...rest
}: { variant?: Variant; arrow?: boolean } & ComponentProps<"button">) {
  return (
    <button className={buttonClass(variant, className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
