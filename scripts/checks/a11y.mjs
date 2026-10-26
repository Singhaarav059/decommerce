// axe-core audit (WCAG 2.1 AA) of every route, desktop and phone, low tier (DOM only).
// node scripts/checks/a11y.mjs [base]
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
const base = process.argv[2] ?? process.env.BASE ?? "http://localhost:3000";
const routes = ["/", "/storefront", "/storefront/brand-showcase", "/b2b", "/quick-commerce", "/marketplace", "/oms", "/wms", "/tms", "/pos", "/clienteling", "/endless-aisle", "/self-checkout", "/about-us", "/contact-us", "/integrations", "/security", "/infrastructure", "/partners", "/glossary", "/ai-instructions", "/privacy-policy", "/terms-and-conditions"];
const b = await chromium.launch();
let total = 0;
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  for (const r of routes) {
    await p.goto(`${base}${r}?tier=low`, { waitUntil: "networkidle" });
    // scroll through like a visitor so reveal-on-scroll content is in its final state
    await p.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      scrollTo(0, 0);
    });
    await p.waitForTimeout(900);
    const res = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).exclude("nextjs-portal").analyze();
    for (const v of res.violations) {
      total += v.nodes.length;
      console.log(`${w} ${r} [${v.impact}] ${v.id}: ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
    }
  }
  await ctx.close();
}
await b.close();
console.log(total ? `${total} violations` : "axe: no WCAG A/AA violations");
process.exit(total ? 1 : 0);
