// Company-page scene stills (scripts/v3/co-shots.json) with the same calm-left framing as the homepage.
// node scripts/v3/co.mjs [key...]   (skips stills that exist unless keys are named)
import { execFile } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { promisify } from "node:util";
const run = promisify(execFile);
const cfg = JSON.parse(readFileSync("scripts/v3/co-shots.json", "utf8"));
const frame = JSON.parse(readFileSync("scripts/v3/shots.json", "utf8"))._frame;
const only = process.argv.slice(2);
const out = (k) => `assets-src/stills/v3/co/${k}.png`;
const q = Object.keys(cfg).filter((k) => (only.length ? only.includes(k) : !existsSync(out(k))));
await Promise.all([0, 1, 2].map(async () => {
  while (q.length) {
    const k = q.shift();
    try {
      await run("node", ["scripts/vertex/image.mjs", "--ref", "assets-src/refs/ref-counter.png", "--aspect", "16:9", "--size", "2K", "--out", out(k), "--prompt", `${cfg[k].still} ${frame.replace("{calm}", cfg[k].calm)}`], { maxBuffer: 1 << 24 });
      console.log("still", k);
    } catch (e) {
      console.log("FAILED", k, String(e.stderr || e.message).split("\n").filter(Boolean).slice(-1)[0]);
    }
  }
}));
