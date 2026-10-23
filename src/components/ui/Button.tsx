import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 h-11 text-[0.92rem] font-medium tracking-tight " +
  "transition-[background-color,color,transform,box-shadow] duration-200 ease-[var(--ease-out)] active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-stone-50 hover:bg-copper",
  secondary: "bg-transparent text-ink shadow-[inset_0_0_0_1px_var(--ink)] hover:bg-ink hover:text-stone-50",
  ghost: "bg-transparent text-ink hover:text-copper-ink px-2",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="size-3.5 transition-transform duration-300 ease-[var(--ease-overshoot)] group-hover:translate-x-0.5"
    >
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
