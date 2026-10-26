"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Phase = "idle" | "cover" | "reveal";

/**
 * Page changes through a lens: clicking an internal link grows a dark circle from the click
 * point until it covers the page, the next page loads underneath, then the lens closes into the
 * centre to reveal it. Skipped for reduced motion, new tabs, modified clicks, downloads, hash
 * links and the current page.
 */
export function LensTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [at, setAt] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const timers: number[] = [];
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || a.getAttribute("href")?.startsWith("#")) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // take the click before the link's own handler, so navigation waits for the lens
      e.preventDefault();
      e.stopPropagation();
      const href = url.pathname + url.search + url.hash;
      router.prefetch(href);
      setAt({ x: (e.clientX / innerWidth) * 100, y: (e.clientY / innerHeight) * 100 });
      setPhase("cover");
      timers.push(
        window.setTimeout(() => router.push(href), 560),
        // never leave the page covered if navigation stalls
        window.setTimeout(() => setPhase((p) => (p === "cover" ? "reveal" : p)), 6000),
      );
    };
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("click", onClick, true);
      timers.forEach(clearTimeout);
    };
  }, [router]);

  // the new page is in: close the lens
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (phase === "cover") setPhase("reveal");
  }
  useEffect(() => {
    if (phase !== "reveal") return;
    const t = window.setTimeout(() => setPhase("idle"), 720);
    return () => clearTimeout(t);
  }, [phase]);

  const { x, y } = at;
  const clip = phase === "cover" ? `circle(150% at ${x}% ${y}%)` : phase === "reveal" ? "circle(0% at 50% 50%)" : `circle(0% at ${x}% ${y}%)`;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-ink"
      style={{
        clipPath: clip,
        transition: phase === "idle" ? "none" : `clip-path ${phase === "cover" ? 560 : 700}ms cubic-bezier(0.65, 0, 0.35, 1)`,
        pointerEvents: phase === "idle" ? "none" : "auto",
      }}
    >
      <span className={`display text-[clamp(2rem,5vw,3.6rem)] text-paper transition-opacity duration-300 ${phase === "cover" ? "opacity-100 delay-200" : "opacity-0"}`}>
        decommerce<span className="text-accent-bright">.</span>
      </span>
    </div>
  );
}
