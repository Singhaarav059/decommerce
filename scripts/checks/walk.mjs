// Viewport screenshots every screen down each page, tiled into one contact sheet per page.
// node scripts/checks/walk.mjs <outDir> <WxH> <path...>   (BASE defaults to http://localhost:3100)
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
const [out, size, ...paths] = process.argv.slice(2);
const [w, h] = size.split("x").map(Number);
const base = process.env.BASE ?? "http://localhost:3100";
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: h }, isMobile: w < 768, hasTouch: w < 768 });
for (const path of paths) {
  await p.goto(base + path, { waitUntil: "networkidle" });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  const name = (path.replace(/\//g, "_") || "_home") + `-${w}`;
  const shots = [];
  for (let y = 0, k = 0; y < H - 200; y += h, k++) {
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(800);
    const f = `${out}/${name}-${String(k).padStart(2, "0")}.png`;
    await p.screenshot({ path: f });
    shots.push(f);
  }
  execFileSync("python3", ["-c", `
import sys
from PIL import Image
fs=sys.argv[2:]; cols=4 if ${w}<768 else 3; tw=300 if ${w}<768 else 480; th=int(tw*${h}/${w})
rows=(len(fs)+cols-1)//cols
S=Image.new('RGB',(cols*tw+(cols-1)*6,rows*th+(rows-1)*6),'#c00')
for i,f in enumerate(fs): S.paste(Image.open(f).convert('RGB').resize((tw,th)),((i%cols)*(tw+6),(i//cols)*(th+6)))
S.save(sys.argv[1],quality=70)`, `${out}/${name}.jpg`, ...shots]);
  console.log(`${out}/${name}.jpg`, shots.length);
}
await b.close();
