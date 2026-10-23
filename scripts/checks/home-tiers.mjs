// Homepage under the low tier and under reduced motion: no canvas, posters visible, no errors.
import { chromium } from "playwright";
const out = process.argv[2] ?? "/tmp/dc-shots";
const base = process.env.BASE ?? "http://localhost:3000";
const b = await chromium.launch();
for (const [label, opts, q] of [
  ["low", {}, "?tier=low"],
  ["reduced", { reducedMotion: "reduce" }, ""],
]) {
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, ...opts });
    const p = await ctx.newPage();
    const errs = [];
    p.on("pageerror", (e) => errs.push(String(e)));
    p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));
    await p.goto(`${base}/${q}`, { waitUntil: "networkidle" });
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `${out}/home-${label}-${w}.png` });
    const info = await p.evaluate(() => ({
      canvas: document.querySelectorAll("canvas").length,
      opening: !!document.querySelector(".opening") && getComputedStyle(document.querySelector(".opening")).display !== "none",
      height: document.documentElement.scrollHeight,
      posters: [...document.querySelectorAll("img")].filter((i) => i.complete && i.naturalWidth > 0).length,
    }));
    console.log(label, w, JSON.stringify(info), errs.slice(0, 3));
    await ctx.close();
  }
}
await b.close();
