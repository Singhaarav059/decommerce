// The running Lenis instance (null on touch devices, reduced motion, or before it loads),
// so other components can glide with it instead of fighting it with native smooth scrolling.
type Glider = { scrollTo: (target: number | HTMLElement, options?: { duration?: number; offset?: number }) => void };
export const smooth: { current: Glider | null } = { current: null };

export function scrollToTop() {
  if (smooth.current) smooth.current.scrollTo(0, { duration: 1.6 });
  else window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}
