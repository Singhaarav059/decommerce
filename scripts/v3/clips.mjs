// One continuous 8 s Veo shot per section from its v3 still (scripts/v3/shots.json); skips existing clips.
import { execFile } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { promisify } from "node:util";
const run = promisify(execFile);
const cfg = JSON.parse(readFileSync("scripts/v3/shots.json", "utf8"));
const only = process.argv.slice(2);
const KEEP = " Keep every object, material, colour and person exactly as in the image. Photorealistic, smooth, no shake, no cuts, no text, no letters, no signs.";
const jobs = Object.keys(cfg).filter((k) => !k.startsWith("_") && (only.length ? only.includes(k) : !existsSync(`assets-src/vertex/v3-${k}.mp4`)));
const q = [...jobs];
await Promise.all([0, 1].map(async () => {
  while (q.length) {
    const k = q.shift();
    try {
      await run("node", ["scripts/vertex/veo.mjs", "--res", "1080p", "--seconds", "8", "--seed", String(300 + jobs.indexOf(k)), "--image", `assets-src/stills/v3/${k}.png`, "--out", `assets-src/vertex/v3-${k}.mp4`, "--negative", "text, captions, watermark, logos, extra people, extra vehicles, morphing, objects appearing or disappearing, blurry, distorted geometry, flicker", "--prompt", cfg[k].move + KEEP], { maxBuffer: 1 << 24 });
      console.log("clip", k);
    } catch (e) {
      console.log("FAILED", k, String(e.stderr || e.message).split("\n").filter(Boolean).slice(-1)[0]);
    }
  }
}));
