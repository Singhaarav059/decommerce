// Animate between approved keyframes with Veo (first and last frame pinned), from scripts/v7/motion.json.
// Skips clips that exist. node scripts/v7/motion.mjs [scene...]   → assets-src/vertex/v7-<scene>-<from><to>.mp4
import { execFile } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { promisify } from "node:util";
const run = promisify(execFile);
const spec = JSON.parse(readFileSync("scripts/v7/motion.json", "utf8"));
const only = process.argv.slice(2);
const jobs = Object.keys(spec)
  .filter((k) => !k.startsWith("_") && (!only.length || only.includes(k)))
  .flatMap((k) => spec[k].map((t) => ({ k, ...t, out: `assets-src/vertex/v7-${k}-${t.from}${t.to}.mp4` })))
  .filter((j) => !existsSync(j.out));
const still = (k, id) => `assets-src/stills/v7/${k}/${id}.png`;
const q = [...jobs];
// two at a time: Veo quotas are small
await Promise.all([0, 1].map(async () => {
  while (q.length) {
    const j = q.shift();
    const args = ["scripts/vertex/veo.mjs", "--model", "veo-3.1-generate-001", "--res", "1080p", "--seconds", String(j.seconds), "--seed", "7",
      "--image", still(j.k, j.from), "--last", still(j.k, j.to), "--out", j.out, "--negative", spec._negative, "--prompt", spec._lock + j.action + spec._keep];
    try {
      await run("node", args, { maxBuffer: 1 << 24, env: { ...process.env, VERTEX_CAP_USD: "200" } });
      console.log("ok", j.out);
    } catch (e) {
      console.log("FAILED", j.out, String(e.stderr || e.stdout || e.message).split("\n").filter(Boolean).slice(-2).join(" | "));
    }
  }
}));
