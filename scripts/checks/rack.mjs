// Interaction check for the clothing rack (lab page, tier=high).
// node scripts/checks/rack.mjs <outdir>
import { chromium } from "playwright";
const out = process.argv[2] ?? "/tmp/dc-shots";
const base = process.env.BASE ?? "http://localhost:3000";
const b = await chromium.launch({ args: ["--use-angle=metal", "--ignore-gpu-blocklist"] });
for (const [w, h, mobile] of [[1440, 900, false], [390, 844, true]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: mobile, isMobile: mobile });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto(`${base}/lab?tier=high`, { waitUntil: "networkidle" });
  const surf = p.locator('[aria-roledescription="carousel"]');
  await surf.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await p.waitForTimeout(2500);
  const box = await surf.boundingBox();
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  const state = () => p.evaluate(() => { const r = window.__rack; return r && { index: r.index, lifted: r.lifted, frame: r.frame, slotPx: Math.round(r.slotPx), ready: document.querySelector('[data-scene="rack"]')?.dataset.ready }; });
  const s0 = await state();
  await surf.screenshot({ path: `${out}/rack-${w}-0.png` });
  // swipe left one slot (mouse drag works for both since pointer events)
  await p.mouse.move(cx + 60, cy); await p.mouse.down();
  for (let i = 1; i <= 8; i++) { await p.mouse.move(cx + 60 - i * 20, cy); await p.waitForTimeout(16); }
  await p.mouse.up();
  await p.waitForTimeout(250);
  await surf.screenshot({ path: `${out}/rack-${w}-swing.png` });
  await p.waitForTimeout(900);
  const s1 = await state();
  // tap centre to lift
  await p.mouse.click(cx, cy);
  await p.waitForTimeout(700);
  await surf.screenshot({ path: `${out}/rack-${w}-twirl.png` });
  await p.waitForTimeout(1500);
  const s2 = await state();
  await surf.screenshot({ path: `${out}/rack-${w}-lifted.png` });
  // keyboard: Escape puts back, ArrowRight moves one
  await surf.focus(); await p.keyboard.press("Escape"); await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(600);
  const s3 = await state();
  const live = await p.locator('[aria-live="polite"]').last().innerText();
  console.log(JSON.stringify({ w, s0, afterSwipe: s1, afterTap: s2, afterKeys: s3, live: live.replace(/\n/g, " | "), errs }));
  await ctx.close();
}
await b.close();
