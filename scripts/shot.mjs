// Headless verification: screenshots a route at phone and desktop widths,
// prints console errors and an optional in-page probe.
// Usage: node scripts/shot.mjs <path> [--widths 390,1440] [--scroll "#id"] [--wait 2500] [--eval "expr"] [--out dir]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const args = process.argv.slice(2);
const path = args[0] ?? "/";
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 ? args[i + 1] : def;
};
const base = process.env.BASE ?? "http://localhost:3000";
const widths = opt("widths", "390,1440").split(",").map(Number);
const scroll = opt("scroll", null);
const wait = Number(opt("wait", "2500"));
const probe = opt("eval", null);
const out = opt("out", "/tmp/dc-shots");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] });
for (const w of widths) {
  const mobile = w < 768;
  const ctx = await browser.newContext({
    viewport: { width: w, height: mobile ? 844 : 900 },
    deviceScaleFactor: 1,
    hasTouch: mobile,
    isMobile: mobile,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(base + path, { waitUntil: "networkidle" });
  if (scroll) await page.locator(scroll).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(wait);
  const file = `${out}/${path.replace(/[^a-z0-9]+/gi, "_") || "home"}-${w}${scroll ? "-" + scroll.replace(/[^a-z0-9]+/gi, "") : ""}.png`;
  await page.screenshot({ path: file });
  const metrics = await page.evaluate(() => ({
    overflowX: document.documentElement.scrollWidth - innerWidth,
    tier: document.documentElement.dataset.tier,
    canvas: document.querySelectorAll("canvas").length,
  }));
  const extra = probe ? await page.evaluate(probe) : undefined;
  console.log(JSON.stringify({ width: w, file, ...metrics, probe: extra, errors }));
  await ctx.close();
}
await browser.close();
