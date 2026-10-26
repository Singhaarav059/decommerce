// Build the site's media from the v5 (animated-feature) sources: home scroll films, module films and
// stills, company scenes, the family posters and the rail wall. Same sizes and crops as the v3 build.
// node scripts/v5/build.mjs [home|sol|co|rack ...]
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }).toString();
const V5 = "assets-src/stills/v5";
const parts = process.argv.slice(2);
const on = (p) => !parts.length || parts.includes(p);
const webp = (src, out, w = 1920) => sh("cwebp", ["-quiet", "-q", "70", "-resize", String(w), "0", src, "-o", out]);

if (on("home")) {
  // phone focus per film: where the subject sits in the 16:9 frame
  const fx = { hero: 0.6, problem: 0.62, order: 0.72, pack: 0.7, delivery: 0.66, counter: 0.7, proof: 0.7, close: 0.55 };
  for (const [k, f] of Object.entries(fx)) {
    const clip = `assets-src/vertex/v5-${k}.mp4`;
    if (!existsSync(clip)) { console.log("no clip", k); continue; }
    sh("scripts/frames-from-video.sh", [clip, `public/assets/seq/${k}`, "4", "1920", "864", "58", `4:5@${f}`, "none"]);
    console.log("home", k, readdirSync(`public/assets/seq/${k}/d`).length);
  }
}

if (on("sol")) {
  const media = JSON.parse(readFileSync("src/content/solutions/media.json", "utf8"));
  for (const k of Object.keys(media)) {
    const dir = `public/assets/sol/${k}`, src = `${V5}/sol`;
    const clip = `assets-src/vertex/v5-sol-${k}.mp4`;
    if (existsSync(clip)) sh("scripts/frames-from-video.sh", [clip, `${dir}/seq`, "4", "1920", "864", "58", "4:5@0.7", "none"]);
    if (existsSync(`${src}/${k}-end.png`)) webp(`${src}/${k}-end.png`, `${dir}/end.webp`);
    if (existsSync(`${src}/${k}-detail.png`)) webp(`${src}/${k}-detail.png`, `${dir}/detail.webp`);
    if (existsSync(`${src}/${k}-end.png`)) {
      const [x, cw, h] = sh("python3", ["-c", `
from PIL import Image
e=Image.open("${src}/${k}-end.png"); W,H=e.size; cw=H*4//3; x=max(0,min(W-cw,int(W*0.7-cw/2)))
print(x, cw, H)`]).trim().split(" ");
      sh("cwebp", ["-quiet", "-q", "70", "-crop", x, "0", cw, h, "-resize", "160", "120", `${src}/${k}-end.png`, "-o", `${dir}/thumb.webp`]);
    }
    if (existsSync(`${src}/${k}.png`)) media[k] = { count: readdirSync(`${dir}/seq/d`).length, floor: sh("python3", ["scripts/v3/floor.py", `${src}/${k}.png`, "0.7", "0.8"]).trim() };
    console.log("sol", k, media[k]);
  }
  writeFileSync("src/content/solutions/media.json", JSON.stringify(media, null, 2) + "\n");
}

if (on("co")) {
  const scenes = JSON.parse(readFileSync("src/content/company/scenes.json", "utf8"));
  for (const k of Object.keys(scenes)) {
    const src = `${V5}/co/${k}.png`;
    if (!existsSync(src)) continue;
    webp(src, `public/assets/company/scene-${k}.webp`);
    scenes[k] = { floor: sh("python3", ["scripts/v3/floor.py", src, "0.7", "0.89"]).trim() };
  }
  writeFileSync("src/content/company/scenes.json", JSON.stringify(scenes, null, 2) + "\n");
  for (const k of ["demaze", "decignal"]) if (existsSync(`${V5}/co/family-${k}.png`)) webp(`${V5}/co/family-${k}.png`, `public/assets/company/family-${k}.webp`, 1200);
  if (existsSync(`${V5}/hero.png`)) webp(`${V5}/hero.png`, "public/assets/company/family-decommerce.webp", 1200);
  console.log("co", scenes);
}

if (on("rack") && existsSync(`${V5}/rack-wall.png`)) {
  webp(`${V5}/rack-wall.png`, "public/assets/rack/wall.webp");
  console.log("rack wall");
}
