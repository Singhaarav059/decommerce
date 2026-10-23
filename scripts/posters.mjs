// Capture poster stills from the live scenes via /capture, so the poster a
// visitor sees first matches the 3D that fades in over it.
// node scripts/posters.mjs [name...]   → public/assets/posters/<name>-d.webp / -m.webp
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.BASE ?? "http://localhost:3000";
const OUT = "public/assets/posters";
// name: scene, progress, step, desktop viewport, mobile viewport
const SHOTS = {
  world: { scene: "world", p: 0, d: [1440, 900], m: [390, 844] },
  orders: { scene: "orders", p: 0.9, d: [1440, 900], m: [390, 844] },
  packing: { scene: "packing", p: 0.6, d: [1440, 900], m: [390, 844] },
  rooms: { scene: "rooms", p: 0.0, d: [1440, 900], m: [390, 844] },
  laptop: { scene: "laptop", p: 1, step: 2, d: [1200, 825], m: [390, 268] },
  pos: { scene: "pos", p: 1, d: [1100, 780], m: [360, 420] },
  aisle: { scene: "aisle", p: 1, d: [1100, 780], m: [360, 420] },
  kiosk: { scene: "kiosk", p: 1, d: [1100, 780], m: [360, 420] },
};
const only = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ args: ["--use-angle=metal", "--ignore-gpu-blocklist"] });
for (const [name, s] of Object.entries(SHOTS)) {
  if (only.length && !only.includes(name)) continue;
  for (const [tag, [w, h], dpr] of [["d", s.d, 1], ["m", s.m, 2]]) {
    const page = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
    await page.goto(`${base}/capture?scene=${s.scene}&p=${s.p}&step=${s.step ?? 0}&tier=high`, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    await page.waitForFunction(() => document.querySelector("[data-ready]"), null, { timeout: 30000 });
    await page.waitForTimeout(2500);
    const png = join(tmpdir(), `poster-${name}-${tag}.png`);
    await page.screenshot({ path: png });
    execFileSync("cwebp", ["-quiet", "-q", "78", png, "-o", join(OUT, `${name}-${tag}.webp`)]);
    await page.close();
  }
  console.log("poster", name);
}
await b.close();
