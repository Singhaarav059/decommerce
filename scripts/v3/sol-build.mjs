// Build each solution page's web media from its v3 sources: scroll frames from the clip (phones get a
// 4:5 crop on the subject), the end and detail stills as full-bleed backgrounds, a menu thumbnail,
// and the scene's floor colour (bottom edge of the phone crop) for the phone text panels.
// node scripts/v3/sol-build.mjs [slug...]
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
const cfg = JSON.parse(readFileSync("scripts/v3/sol-shots.json", "utf8"));
const media = JSON.parse(readFileSync("src/content/solutions/media.json", "utf8"));
const only = process.argv.slice(2);
const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }).toString();
for (const k of Object.keys(cfg).filter((k) => !k.startsWith("_") && (!only.length || only.includes(k)))) {
  const clip = [`-fix`, `-trim`, ``].map((x) => `assets-src/vertex/v3-sol-${k}${x}.mp4`).find((f) => existsSync(f));
  if (!clip) { console.log("no clip", k); continue; }
  const dir = `public/assets/sol/${k}`, src = "assets-src/stills/v3/sol";
  sh("scripts/frames-from-video.sh", [clip, `${dir}/seq`, "4", "1280", "720", "50", "4:5@0.7", "none"]);
  for (const f of ["still.webp", "broken.webp"]) rmSync(`${dir}/${f}`, { force: true });
  sh("cwebp", ["-quiet", "-q", "70", "-resize", "1920", "0", `${src}/${k}-end.png`, "-o", `${dir}/end.webp`]);
  sh("cwebp", ["-quiet", "-q", "70", "-resize", "1920", "0", `${src}/${k}-detail.png`, "-o", `${dir}/detail.webp`]);
  const [thumbX, cw, h] = sh("python3", ["-c", `
from PIL import Image
e=Image.open("${src}/${k}-end.png"); W,H=e.size; cw=H*4//3; x=max(0,min(W-cw,int(W*0.7-cw/2)))
print(x, cw, H)`]).trim().split(" ");
  const floor = sh("python3", ["scripts/v3/floor.py", `${src}/${k}.png`, "0.7", "0.8"]).trim();
  sh("cwebp", ["-quiet", "-q", "70", "-crop", thumbX, "0", cw, h, "-resize", "160", "120", `${src}/${k}-end.png`, "-o", `${dir}/thumb.webp`]);
  media[k] = { count: readdirSync(`${dir}/seq/d`).length, floor };
  console.log(k, media[k]);
}
writeFileSync("src/content/solutions/media.json", JSON.stringify(media, null, 2) + "\n");
