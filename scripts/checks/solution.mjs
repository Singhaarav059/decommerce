// Screenshots one solution page: hero, broken + fixed states, inside (tab 3 + part 1).
// node scripts/checks/solution.mjs <slug|path> <outdir> [widths=1440]
import { chromium } from "playwright";
const [slug = "pos", out = "/tmp/dc-shots", ws = "1440"] = process.argv.slice(2);
const path = slug.startsWith("/") ? slug : `/${slug === "brand-showcase" ? "storefront/brand-showcase" : slug}`;
const base = process.env.BASE ?? "http://localhost:3000";
const b = await chromium.launch({ args: ["--use-angle=metal", "--ignore-gpu-blocklist"] });
for (const w of ws.split(",").map(Number)) {
  const mobile = w < 768;
  const ctx = await b.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, hasTouch: mobile, isMobile: mobile });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 200)));
  await p.goto(`${base}${path}?tier=high`, { waitUntil: "networkidle" });
  await p.waitForTimeout(3500);
  const name = (s) => `${out}/sol-${slug.replace(/\W+/g, "")}-${w}-${s}.png`;
  await p.screenshot({ path: name("hero") });
  const geo = await p.evaluate(() => { const el = document.querySelector("#fix"); const r = el.getBoundingClientRect(); return { top: r.top + scrollY, h: el.offsetHeight - innerHeight }; });
  for (const f of [0.08, 0.95]) {
    await p.evaluate((y) => scrollTo(0, y), geo.top + geo.h * f + 1);
    await p.waitForTimeout(2200);
    await p.screenshot({ path: name(`fix${f}`) });
  }
  const tabs = p.locator('[role="tab"]');
  await tabs.nth(2).scrollIntoViewIfNeeded();
  await tabs.nth(2).click();
  await p.locator('main button[aria-expanded]').first().click();
  await p.waitForTimeout(2500);
  await p.screenshot({ path: name("inside") });
  const ready = await p.evaluate(() => [...document.querySelectorAll("[data-scene]")].map((e) => e.dataset.scene + ":" + (e.dataset.ready ?? "-")).join(" "));
  console.log(JSON.stringify({ slug, w, ready, errs: errs.slice(0, 4) }));
  await ctx.close();
}
await b.close();
