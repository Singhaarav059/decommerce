// Solution-page media (scripts/v3/sol-shots.json): per page a start still, an end still (an edit of the
// start with identical framing, so Veo keeps the camera locked), a close-up detail still and one 8 s clip.
// node scripts/v3/sol.mjs <still|end|detail|clip> [slug...]   (skips outputs that exist unless slugs are named)
import { execFile } from "node:child_process";
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { promisify } from "node:util";
const run = promisify(execFile);
const cfg = JSON.parse(readFileSync("scripts/v3/sol-shots.json", "utf8"));
const frame = JSON.parse(readFileSync("scripts/v3/shots.json", "utf8"))._frame;
const [stage, ...only] = process.argv.slice(2);
const D = "assets-src/stills/v3/sol";
const out = { still: (k) => `${D}/${k}.png`, end: (k) => `${D}/${k}-end.png`, detail: (k) => `${D}/${k}-detail.png`, clip: (k) => `assets-src/vertex/v3-sol-${k}.mp4` }[stage];
if (!out) throw new Error("stage: still | end | detail | clip");
const KEEP = " Keep every object, material, colour and person exactly as in the image. Photorealistic, smooth, no shake, no cuts, no text, no letters, no signs.";
const slugs = Object.keys(cfg).filter((k) => !k.startsWith("_") && (only.length ? only.includes(k) : !existsSync(out(k))));
const img = (args) => run("node", ["scripts/vertex/image.mjs", "--aspect", "16:9", "--size", "2K", ...args], { maxBuffer: 1 << 24 });
const job = async (k) => {
  const s = cfg[k];
  if (stage === "still") await img(["--ref", s.ref, "--out", out(k), "--prompt", `${s.still} ${frame.replace("{calm}", s.calm)}`]);
  else if (stage === "detail") await img(["--ref", `${D}/${k}.png`, "--out", out(k), "--prompt", `${s.detail} ${cfg._detail.replace("{calm}", s.calm)}`]);
  else if (stage === "end") {
    if (s.end === "same") return copyFileSync(`${D}/${k}.png`, out(k));
    await img(["--ref", `${D}/${k}.png`, "--out", out(k), "--prompt", cfg._end.replace("{end}", s.end)]);
  } else
    await run("node", ["scripts/vertex/veo.mjs", "--res", "1080p", "--seconds", "8", "--seed", String(400 + Object.keys(cfg).indexOf(k)), "--image", `${D}/${k}.png`, "--last", `${D}/${k}-end.png`, "--out", out(k), "--negative", "text, captions, watermark, logos, extra people, extra vehicles, morphing, objects appearing or disappearing, camera movement, zoom, pan, blurry, distorted geometry, flicker", "--prompt", s.move + KEEP], { maxBuffer: 1 << 24 });
};
const q = [...slugs];
await Promise.all(Array.from({ length: stage === "clip" ? 2 : 3 }, async () => {
  while (q.length) {
    const k = q.shift();
    try {
      await job(k);
      console.log(stage, k);
    } catch (e) {
      console.log("FAILED", stage, k, String(e.stderr || e.message).split("\n").filter(Boolean).slice(-1)[0]);
    }
  }
}));
