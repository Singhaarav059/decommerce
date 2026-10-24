// Headless look-through: runs a list of steps and saves viewport screenshots.
// node scripts/checks/look.mjs <path> <WxH> '<steps json>' [outDir]
// steps: [{ "to": "#id", "at": 0.5 } | { "y": 1200 } | { "click": "css" } | { "hover": "css" } | { "wait": 800 } | { "shot": "name" }]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const [path = "/", size = "1440x900", stepsJson = "[]", out = "/tmp/dc-look"] = process.argv.slice(2);
const [w, h] = size.split("x").map(Number);
const base = process.env.BASE ?? "http://localhost:3000";
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 768, hasTouch: w < 768 });
const p = await ctx.newPage();
p.on("pageerror", (e) => console.log("pageerror", e.message));
await p.goto(base + path, { waitUntil: "networkidle" });
await p.waitForTimeout(1200);
for (const s of JSON.parse(stepsJson)) {
  if (s.to) await p.evaluate(({ to, at }) => { const e = document.querySelector(to); const top = e.getBoundingClientRect().top + scrollY; scrollTo(0, top + (e.offsetHeight - innerHeight) * (at ?? 0)); }, s);
  if (s.y != null) await p.evaluate((y) => scrollTo(0, y), s.y);
  if (s.click) await p.click(s.click);
  if (s.hover) await p.hover(s.hover);
  await p.waitForTimeout(s.wait ?? 900);
  if (s.shot) await p.screenshot({ path: `${out}/${s.shot}.jpg`, quality: 70, type: "jpeg" });
}
await b.close();
