// Screenshot a pinned stage at several progress points.
// node scripts/checks/stage.mjs <path> <sectionSelector> <outdir> [points=0,0.35,0.8] [widths=1440,390]
import { chromium } from "playwright";
const [path = "/", sel = "section", out = "/tmp/dc-shots", pts = "0,0.35,0.8", ws = "1440,390"] = process.argv.slice(2);
const base = process.env.BASE ?? "http://localhost:3000";
const b = await chromium.launch({ args: ["--use-angle=metal", "--ignore-gpu-blocklist"] });
for (const w of ws.split(",").map(Number)) {
  const mobile = w < 768;
  const ctx = await b.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, hasTouch: mobile, isMobile: mobile });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 200)));
  await p.goto(`${base}${path}${path.includes("?") ? "&" : "?"}tier=high`, { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  const geo = await p.evaluate((s) => { const el = document.querySelector(s); const r = el.getBoundingClientRect(); return { top: r.top + scrollY, h: el.offsetHeight - innerHeight }; }, sel);
  for (const f of pts.split(",").map(Number)) {
    await p.evaluate((y) => window.scrollTo(0, y), geo.top + geo.h * f + 1);
    await p.waitForTimeout(1800);
    await p.screenshot({ path: `${out}/stage-${path.replace(/\W+/g, "") || "home"}-${w}-${f}.png` });
  }
  console.log(JSON.stringify({ w, errs: errs.slice(0, 5) }));
  await ctx.close();
}
await b.close();
