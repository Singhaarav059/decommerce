// Render a scene to numbered WebP frames for <ScrollSequence>, via /capture.
// node scripts/capture-sequence.mjs <scene> <outDir> [frames=72]
// Writes <outDir>/d/NNN.webp (1280x800) and <outDir>/m/NNN.webp (720x1280 portrait).
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [scene, outDir, framesArg = "72"] = process.argv.slice(2);
const frames = Number(framesArg);
const base = process.env.BASE ?? "http://localhost:3000";
const b = await chromium.launch({ args: ["--use-angle=metal", "--ignore-gpu-blocklist"] });
for (const [tag, w, h, q] of [["d", 1280, 800, 70], ["m", 720, 1280, 68]]) {
  const page = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(`${base}/capture?scene=${scene}&p=0&tier=high`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("[data-ready]"), null, { timeout: 30000 });
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  await page.waitForTimeout(1500);
  const tmp = join(tmpdir(), `dc-cap-${scene}-${tag}`);
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  mkdirSync(join(outDir, tag), { recursive: true });
  for (let i = 0; i < frames; i++) {
    const p = i / (frames - 1);
    await page.evaluate(async (p) => {
      window.__capture.set(p);
      const f0 = window.__capture.frame();
      await new Promise((r) => {
        const tick = () => (window.__capture.frame() > f0 + 2 ? r() : requestAnimationFrame(tick));
        requestAnimationFrame(tick);
      });
    }, p);
    const png = join(tmp, `${String(i).padStart(3, "0")}.png`);
    await page.screenshot({ path: png });
    execFileSync("cwebp", ["-quiet", "-q", String(q), png, "-o", join(outDir, tag, `${String(i).padStart(3, "0")}.webp`)]);
  }
  await page.close();
  console.log(tag, "done");
}
await b.close();
