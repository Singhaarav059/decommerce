// Company scenes → public/assets/company/scene-<key>.webp, plus each scene's floor colour (bottom edge of
// the phone crop) in src/content/company/scenes.json. node scripts/v3/co-build.mjs
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
const keys = Object.keys(JSON.parse(readFileSync("scripts/v3/co-shots.json", "utf8")));
const scenes = {};
for (const k of keys) {
  const src = `assets-src/stills/v3/co/${k}.png`;
  execFileSync("cwebp", ["-quiet", "-q", "70", "-resize", "1920", "0", src, "-o", `public/assets/company/scene-${k}.webp`]);
  const floor = execFileSync("python3", ["scripts/v3/floor.py", src, "0.7", "0.89"]).toString().trim();
  scenes[k] = { floor };
}
writeFileSync("src/content/company/scenes.json", JSON.stringify(scenes, null, 2) + "\n");
console.log(scenes);
