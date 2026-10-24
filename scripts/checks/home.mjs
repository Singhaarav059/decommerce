// Screenshot every homepage chapter at its start and end, plus the rack (rail, after a drag, opened piece).
// node scripts/checks/home.mjs <outdir> [widths=1440,390]
import { chromium } from "playwright";
const [out = "/tmp/dc-shots", ws = "1440,390"] = process.argv.slice(2);
const base = process.env.BASE ?? "http://localhost:3000";
const ids = ["ch-store", "ch-problem", "ch-order", "ch-pack", "ch-delivery", "ch-instore", "ch-proof", "ch-close-film"];
const b = await chromium.launch();
for (const w of ws.split(",").map(Number)) {
  const mobile = w < 768;
  const ctx = await b.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, hasTouch: mobile, isMobile: mobile });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  for (const id of ids) {
    const g = await p.evaluate((id) => { const el = document.querySelector(`#${id} > section`) ?? document.getElementById(id); const r = el.getBoundingClientRect(); return { top: r.top + scrollY, h: el.offsetHeight - innerHeight }; }, id);
    for (const f of [0.08, 0.92]) {
      await p.evaluate((y) => scrollTo(0, y), g.top + Math.max(0, g.h) * f + 1);
      await p.waitForTimeout(1600);
      await p.screenshot({ path: `${out}/h-${w}-${id}-${f}.png` });
    }
  }
  const rack = p.locator('[aria-roledescription="carousel"]');
  await rack.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${out}/h-${w}-rack-0.png` });
  const bb = await rack.boundingBox();
  await p.mouse.move(bb.x + bb.width * 0.7, bb.y + bb.height * 0.5); await p.mouse.down();
  for (let i = 1; i <= 10; i++) { await p.mouse.move(bb.x + bb.width * 0.7 - i * 22, bb.y + bb.height * 0.5); await p.waitForTimeout(16); }
  await p.mouse.up(); await p.waitForTimeout(120);
  await p.screenshot({ path: `${out}/h-${w}-rack-swing.png` });
  await p.waitForTimeout(1400);
  await p.screenshot({ path: `${out}/h-${w}-rack-1.png` });
  await p.getByRole("button", { name: "See the piece" }).click(); await p.waitForTimeout(900);
  await p.getByRole("radio", { name: "L", exact: true }).click();
  await p.getByRole("button", { name: /Add to bag/ }).click(); await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}/h-${w}-rack-open.png` });
  console.log(JSON.stringify({ w, errs: errs.slice(0, 4) }));
  await ctx.close();
}
await b.close();
