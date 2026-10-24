"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { companyGroup, navImage, navIntro, solutionGroups, type NavGroup } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";

const groups: NavGroup[] = [...solutionGroups, companyGroup];

/**
 * A floating bar on a solid paper surface, so it reads over any photograph.
 * It tucks away while you scroll down and comes back as soon as you scroll up.
 * Desktop: each group opens an editorial index, a numbered list in display type
 * with a photograph of the hovered page beside it. Phones: a full-screen sheet.
 */
export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
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
    setHidden(false);
  }

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - last) < 6) return;
      setHidden(y > 160 && y > last);
      last = y;
    };
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
  const current = (g: NavGroup) => g.items.some((i) => i.href === pathname);
  // the item previewed in the open panel (first item until something is hovered)
  const [hover, setHover] = useState<string | null>(null);
  const preview = panel?.items.find((i) => i.href === hover) ?? panel?.items[0];
  const tucked = hidden && !open && !mobileOpen;

  return (
    <header
      // no translate at all while shown: any transform would trap the fixed mobile sheet inside the header box
      className={`fixed inset-x-0 top-0 z-[var(--z-header)] transition-[translate] duration-500 ease-[var(--ease-out)] ${tucked ? "-translate-y-[calc(100%+8px)]" : ""}`}
    >
      <div ref={navRef} className="relative mx-auto max-w-[var(--max-w)] px-[var(--gutter)] pt-3">
        <div
          className={`relative z-10 flex h-14 items-center rounded-full border border-line bg-paper pr-2 pl-5 transition-shadow duration-300 ${
            scrolled || open ? "shadow-[var(--shadow-md)]" : "shadow-[var(--shadow-sm)]"
          }`}
        >
          <Link href="/" aria-label="Decommerce home" className="mr-8 shrink-0 rounded-full">
            <Wordmark />
          </Link>

          <nav aria-label="Main" className="hidden flex-1 lg:block">
            <ul className="flex items-center justify-center gap-0.5">
              {groups.map((g, gi) => (
                <li key={g.label}>
                  <button
                    type="button"
                    aria-expanded={open === g.label}
                    aria-controls={panelId}
                    onClick={() => {
                      setHover(null);
                      setOpen(open === g.label ? null : g.label);
                    }}
                    onPointerEnter={(e) => {
                      if (e.pointerType !== "mouse" || open === g.label) return;
                      setHover(null);
                      setOpen(g.label);
                    }}
                    className={`relative flex h-10 items-center gap-2 rounded-full px-4 text-[0.92rem] font-medium transition-colors duration-200 ${
                      open === g.label ? "bg-studio-light text-ink" : "text-ink-2 hover:text-ink"
                    }`}
                  >
                    <span aria-hidden className={`tabular text-[0.68rem] font-semibold transition-colors ${open === g.label || current(g) ? "text-copper" : "text-ink-2/85"}`}>
                      {String(gi + 1).padStart(2, "0")}
                    </span>
                    {g.label}
                    {current(g) && <span className="sr-only">(current section)</span>}
                    <svg
                      aria-hidden
                      viewBox="0 0 10 10"
                      className={`size-2.5 opacity-60 transition-transform duration-300 ease-[var(--ease-out)] ${open === g.label ? "rotate-180" : ""}`}
                    >
                      <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <span className="hidden sm:block">
              <ButtonLink href="/contact-us" className="h-10 px-5 text-[0.9rem]" arrow>
                Book a demo
              </ButtonLink>
            </span>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-studio-light lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span aria-hidden className="relative block h-3 w-5">
                <span className={`absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-300 ease-[var(--ease-out)] ${mobileOpen ? "top-1/2 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-300 ease-[var(--ease-out)] ${mobileOpen ? "top-1/2 -rotate-45" : "top-full"}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Desktop mega-menu: stays mounted, CSS fades it (inert while closed) */}
        <div
          id={panelId}
          inert={!active}
          onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(null)}
          className={`absolute inset-x-[var(--gutter)] top-full hidden pt-2 transition-[opacity,translate,scale,visibility] duration-300 ease-[var(--ease-out)] origin-top lg:block ${
            active ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-1.5 scale-[0.985] opacity-0"
          }`}
        >
          {panel && preview && (
            <div className="overflow-hidden rounded-[var(--radius-xl)] border border-line bg-paper shadow-[var(--shadow-md)]">
              <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-8 p-3 pl-8">
                <div className="flex flex-col py-5">
                  <div className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
                    <p className="display t-h3">{panel.label}</p>
                    <p className="max-w-[46ch] text-right text-[0.88rem] leading-snug text-ink-2">{navIntro[panel.label]}</p>
                  </div>
                  <ul key={panel.label} className="mt-2 grid grid-cols-2 gap-x-8">
                    {panel.items.map((item, i) => {
                      const on = item.href === preview.href;
                      return (
                        <li key={item.href} className="animate-[rise_500ms_var(--ease-out)_both] border-b border-line/70" style={{ animationDelay: `${i * 35}ms` }}>
                          <Link
                            href={item.href}
                            aria-current={item.href === pathname ? "page" : undefined}
                            onPointerEnter={() => setHover(item.href)}
                            onFocus={() => setHover(item.href)}
                            className="group flex items-baseline gap-3 py-3"
                          >
                            <span className={`tabular w-6 shrink-0 text-[0.75rem] font-semibold transition-colors ${on ? "text-copper" : "text-ink-2/85"}`}>{String(i + 1).padStart(2, "0")}</span>
                            <span className="min-w-0">
                              <span className={`display block text-[1.35rem] transition-[color,translate] duration-300 ease-[var(--ease-out)] ${on ? "translate-x-1 text-copper" : ""}`}>{item.label}</span>
                              <span className="mt-0.5 block text-[0.84rem] leading-snug text-ink-2">{item.blurb}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-auto flex items-center justify-between gap-6 pt-6 text-[0.84rem] text-ink-2">
                    <span>One catalog, one stock count and one customer record behind every page here.</span>
                    <Link href="/contact-us" className="link-u shrink-0 font-semibold text-copper">
                      Book a demo →
                    </Link>
                  </p>
                </div>
                <div className={`relative overflow-hidden rounded-[var(--radius-lg)] bg-studio ${panel.items.length > 5 ? "aspect-[4/5]" : "aspect-[20/19]"}`}>
                  {panel.items.map((item) => (
                    <Image
                      key={item.href}
                      src={navImage(item)}
                      alt=""
                      fill
                      sizes="340px"
                      quality={75}
                      className={`object-cover object-[75%_50%] transition-[opacity,scale] duration-700 ease-[var(--ease-out)] ${item.href === preview.href ? "scale-100 opacity-100" : "scale-[1.05] opacity-0"}`}
                    />
                  ))}
                  <p key={preview.href} className="absolute inset-x-3 bottom-3 animate-[rise_400ms_var(--ease-out)_both] rounded-[var(--radius-md)] bg-paper px-4 py-3 text-[0.84rem]">
                    <span className="block font-semibold">{preview.label}</span>
                    <span className="text-ink-2">{preview.blurb}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sheet */}
      <nav
        aria-label="Main"
        inert={!mobileOpen}
        className={`fixed inset-0 -z-10 overflow-y-auto bg-paper px-[var(--gutter)] pt-[calc(var(--header-h)+8px)] pb-10 transition-[opacity,visibility] duration-300 lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* links render only while open: hidden-but-mounted links would all be prefetched */}
        {mobileOpen && (
          <>
            {groups.map((g, gi) => (
              <div key={g.label} className="animate-[rise_600ms_var(--ease-out)_both] border-b border-line py-5" style={{ animationDelay: `${gi * 60}ms` }}>
                <p className="eyebrow mb-3">{g.label}</p>
                <ul className="grid gap-0.5">
                  {g.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={item.href === pathname ? "page" : undefined}
                        className="flex min-h-12 items-center gap-3.5 text-[1.15rem] font-medium tracking-[-0.01em] aria-[current=page]:text-copper"
                      >
                        {item.slug && (
                          <span className="relative h-10 w-[52px] shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-studio">
                            <Image src={`/assets/sol/${item.slug}/thumb.webp`} alt="" fill sizes="52px" className="object-cover" />
                          </span>
                        )}
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <ButtonLink href="/contact-us" className="mt-8 w-full animate-[rise_600ms_var(--ease-out)_both] [animation-delay:240ms]" arrow>
              Book a demo
            </ButtonLink>
          </>
        )}
      </nav>
    </header>
  );
}
