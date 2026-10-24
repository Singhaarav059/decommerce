// Screenshots each block of a solution page: hero, problem, fix, anatomy (2nd part open), capabilities (2nd tab).
// node scripts/checks/solution.mjs <slug> <outdir> [widths=1440,390]
import { chromium } from "playwright";
const [slug = "pos", out = "/tmp/dc-shots", ws = "1440,390"] = process.argv.slice(2);
const path = slug === "brand-showcase" ? "/storefront/brand-showcase" : `/${slug}`;
const base = process.env.BASE ?? "http://localhost:3000";
const b = await chromium.launch();
for (const w of ws.split(",").map(Number)) {
  const mobile = w < 768;
  const ctx = await b.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, hasTouch: mobile, isMobile: mobile });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));
  await p.goto(base + path, { waitUntil: "networkidle" });
  await p.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  await p.waitForTimeout(1500);
  const shot = (n) => p.screenshot({ path: `${out}/s-${slug}-${w}-${n}.png` });
  await shot("hero");
  const g = await p.evaluate(() => { const el = document.querySelector("#fix > section"); const r = el.getBoundingClientRect(); return { top: r.top + scrollY, h: el.offsetHeight - innerHeight }; });
  for (const [f, n] of [[0.15, "problem"], [0.9, "fix"]]) {
    await p.evaluate((y) => scrollTo(0, y), g.top + g.h * f);
    await p.waitForTimeout(1800);
    await shot(n);
  }
  const part = p.locator("section:has(> div > div > p.eyebrow:text-is('Anatomy')) button[aria-pressed]").nth(1);
  await part.scrollIntoViewIfNeeded(); await part.click(); await p.waitForTimeout(900);
  await p.evaluate(() => window.scrollBy(0, -120)); await p.waitForTimeout(300);
  await shot("anatomy");
  const tab = p.locator('[role="tab"]').nth(1);
  await tab.scrollIntoViewIfNeeded(); await tab.click(); await p.waitForTimeout(700);
  await shot("caps");
  console.log(JSON.stringify({ slug, w, errs: errs.slice(0, 3) }));
  await ctx.close();
}
await b.close();
