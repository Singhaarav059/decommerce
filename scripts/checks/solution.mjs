// Screenshots a solution page: the film at its pitch, problem and steps, anatomy (2nd part open), capabilities (2nd tab).
// node scripts/checks/solution.mjs <slug[,slug...]> <outdir> [widths=1440,390]
import { chromium } from "playwright";
const [slugs = "pos", out = "/tmp/dc-shots", ws = "1440,390"] = process.argv.slice(2);
const base = process.env.BASE ?? "http://localhost:3000";
const b = await chromium.launch();
for (const slug of slugs.split(",")) {
  const path = slug === "brand-showcase" ? "/storefront/brand-showcase" : `/${slug}`;
  for (const w of ws.split(",").map(Number)) {
    const mobile = w < 768;
    const ctx = await b.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, hasTouch: mobile, isMobile: mobile });
    const p = await ctx.newPage();
    const errs = [];
    p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
    p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));
    await p.goto(base + path, { waitUntil: "networkidle" });
    await p.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    const shot = (n) => p.screenshot({ path: `${out}/s-${slug}-${w}-${n}.png` });
    const g = await p.evaluate(() => { const el = document.querySelector("#film > section"); const r = el.getBoundingClientRect(); return { top: r.top + scrollY, h: el.offsetHeight - innerHeight }; });
    for (const [f, n] of [[0.02, "a-pitch"], [0.38, "b-problem"], [0.7, "c-steps"], [0.99, "d-done"]]) {
      await p.evaluate((y) => scrollTo(0, y), g.top + g.h * f);
      await p.waitForTimeout(1600);
      await shot(n);
    }
    const part = p.locator("#anatomy button[aria-pressed]").nth(1);
    await p.evaluate(() => document.getElementById("anatomy").scrollIntoView());
    await part.click(); await p.waitForTimeout(1000);
    await shot("e-anatomy");
    await p.evaluate(() => document.getElementById("capabilities").scrollIntoView());
    await p.locator('#capabilities [role="tab"]').nth(1).click(); await p.waitForTimeout(500);
    await shot("f-capabilities");
    console.log(JSON.stringify({ slug, w, errs: errs.slice(0, 4) }));
    await ctx.close();
  }
}
await b.close();
