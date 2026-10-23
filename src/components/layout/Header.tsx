"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { companyGroup, solutionGroups, type NavGroup } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { SceneThumb } from "@/components/ui/SceneThumb";
import { Wordmark } from "@/components/ui/Wordmark";

const groups: NavGroup[] = [...solutionGroups, companyGroup];

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Close menus on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const active = groups.find((g) => g.label === open);
  // keep the last group rendered while the panel fades out
  const [shown, setShown] = useState<NavGroup | undefined>(undefined);
  if (active && active !== shown) setShown(active);
  const panel = active ?? shown;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        scrolled || open || mobileOpen ? "bg-stone-50 shadow-[0_1px_0_var(--line)]" : "bg-transparent"
      }`}
    >
      <div ref={navRef} className="mx-auto flex h-[var(--header-h)] max-w-[var(--max-w)] items-center px-[var(--gutter)]">
        <Link href="/" aria-label="Decommerce home" className="mr-10 shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {groups.map((g) => (
              <li key={g.label}>
                <button
                  type="button"
                  aria-expanded={open === g.label}
                  aria-controls={panelId}
                  onClick={() => setOpen(open === g.label ? null : g.label)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(g.label)}
                  className={`flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[0.9rem] transition-colors ${
                    open === g.label ? "bg-travertine text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {g.label}
                  <svg
                    aria-hidden
                    viewBox="0 0 10 10"
                    className={`size-2.5 transition-transform duration-300 ${open === g.label ? "rotate-180" : ""}`}
                  >
                    <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:block">
            <ButtonLink href="/contact-us" className="h-10" arrow>
              Book a demo
            </ButtonLink>
          </span>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
              <path
                d={mobileOpen ? "M5 5l10 10M15 5 5 15" : "M3 7h14M3 13h14"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Desktop mega-menu: stays mounted, CSS fades it (inert while closed) */}
        <div
          id={panelId}
          inert={!active}
          onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(null)}
          className={`absolute inset-x-0 top-[var(--header-h)] hidden border-t border-b border-line bg-stone-50 transition-[opacity,translate,visibility] duration-300 ease-[var(--ease-out)] lg:block ${
            active ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          {panel && (
            <div className="mx-auto grid max-w-[var(--max-w)] grid-cols-[220px_1fr] gap-10 px-[var(--gutter)] py-8">
              <div>
                <p className="eyebrow">{panel.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {panel.label === "Company"
                    ? "The people and principles behind the platform."
                    : "Every module shares one catalog, one stock count and one customer record."}
                </p>
              </div>
              <ul className="grid grid-cols-3 gap-2">
                {panel.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-4 rounded-[var(--radius-md)] p-3 transition-colors hover:bg-travertine/70"
                    >
                      {item.slug && (
                        <SceneThumb
                          slug={item.slug}
                          className="h-12 w-16 shrink-0 transition-transform duration-500 ease-[var(--ease-overshoot)] group-hover:-translate-y-0.5"
                        />
                      )}
                      <span>
                        <span className="block text-[0.95rem] font-medium">{item.label}</span>
                        <span className="block text-[0.82rem] leading-snug text-ink-muted">{item.blurb}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sheet */}
      <nav
        aria-label="Main"
        inert={!mobileOpen}
        className={`fixed inset-x-0 top-[var(--header-h)] bottom-0 overflow-y-auto bg-stone-50 px-[var(--gutter)] pb-10 transition-[opacity,visibility] duration-200 lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* links render only while open: hidden-but-mounted links would all be prefetched */}
        {mobileOpen && (
          <>
            {groups.map((g) => (
              <div key={g.label} className="border-b border-line py-5">
                <p className="eyebrow mb-3">{g.label}</p>
                <ul className="grid gap-1">
                  {g.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="flex min-h-11 items-center gap-3 text-[1.05rem]">
                        {item.slug && <SceneThumb slug={item.slug} className="h-8 w-11 shrink-0" />}
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <ButtonLink href="/contact-us" className="mt-6 w-full" arrow>
              Book a demo
            </ButtonLink>
          </>
        )}
      </nav>
    </header>
  );
}
