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
// Solution heroes: live mode, the scene's fixed state with a representative interaction value.
const SOLUTION_SCENES = {
  storefront: ["laptop", 0, "", 2],
  "brand-showcase": ["showcase", 0.5],
  b2b: ["b2b", 0.35],
  "quick-commerce": ["quick", 0.55],
  marketplace: ["market", 15],
  oms: ["oms", 0, "focus=t1"],
  wms: ["packing", 0.62],
  tms: ["tms", 0.35],
  pos: ["pos", 0.35],
  clienteling: ["client", 3],
  "endless-aisle": ["aisle", 0.7],
  "self-checkout": ["kiosk", 0.6],
};
for (const [slug, [scene, v, extra, step]] of Object.entries(SOLUTION_SCENES)) {
  SHOTS[`sol-${slug}`] = { scene, p: 1, step, query: `mode=live&v=${v}${extra ? "&" + extra : ""}`, d: [1100, 756], m: [390, 292] };
}
const only = process.argv.slice(2).filter((a) => a !== "--solutions");
const solutionsOnly = process.argv.includes("--solutions");
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ args: ["--use-angle=metal", "--ignore-gpu-blocklist"] });
for (const [name, s] of Object.entries(SHOTS)) {
  if (only.length && !only.includes(name)) continue;
  if (solutionsOnly && !name.startsWith("sol-")) continue;
  for (const [tag, [w, h], dpr] of [["d", s.d, 1], ["m", s.m, 2]]) {
    const page = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
    await page.goto(`${base}/capture?scene=${s.scene}&p=${s.p}&step=${s.step ?? 0}&tier=high${s.query ? "&" + s.query : ""}`, { waitUntil: "networkidle" });
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
