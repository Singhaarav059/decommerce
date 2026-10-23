// Fails if anything (outside an overflow-clipping ancestor) sticks out past the viewport.
// node scripts/checks/overflow.mjs [paths...]   (default: every sitemap route)
import { chromium } from "playwright";
const base = process.env.BASE ?? "http://localhost:3000";
const paths = process.argv.slice(2);
const routes = paths.length ? paths : ["/", "/storefront", "/storefront/brand-showcase", "/b2b", "/quick-commerce", "/marketplace", "/oms", "/wms", "/tms", "/pos", "/clienteling", "/endless-aisle", "/self-checkout", "/about-us", "/contact-us", "/security", "/infrastructure", "/partners", "/glossary", "/ai-instructions", "/privacy-policy", "/terms-and-conditions"];
const b = await chromium.launch();
let bad = 0;
for (const w of [360, 390, 768, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: 844 } });
  for (const r of routes) {
    await p.goto(`${base}${r}${r.includes("?") ? "&" : "?"}tier=low`, { waitUntil: "networkidle" });
    await p.waitForTimeout(600);
    const out = await p.evaluate((w) => {
      const res = [];
      for (const e of document.querySelectorAll("body *")) {
        const rc = e.getBoundingClientRect();
        if (rc.right <= w + 1 || rc.width === 0) continue;
        let clipped = false;
        for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
          const o = getComputedStyle(a).overflowX;
          if (o === "hidden" || o === "clip") { clipped = true; break; }
        }
        if (!clipped && getComputedStyle(e).position !== "fixed") res.push(`${e.tagName}.${String(e.className).slice(0, 50)} R${Math.round(rc.right)}`);
      }
      return res.slice(0, 3);
    }, w);
    if (out.length) { bad++; console.log(w, r, out); }
  }
  await p.close();
}
await b.close();
console.log(bad ? `overflow on ${bad} route/width pairs` : "no horizontal overflow");
process.exit(bad ? 1 : 0);
