// Generate the v3 homepage stills (one per section) from scripts/v3/shots.json, skipping existing ones.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
const cfg = JSON.parse(readFileSync("scripts/v3/shots.json", "utf8"));
const only = process.argv.slice(2);
for (const [k, s] of Object.entries(cfg)) {
  if (k.startsWith("_") || (only.length && !only.includes(k))) continue;
  const out = `assets-src/stills/v3/${k}.png`;
  if (existsSync(out) && !only.length) continue;
  const prompt = `${s.still} ${cfg._frame.replace("{calm}", s.calm)}`;
  try {
    execFileSync("node", ["scripts/vertex/image.mjs", "--ref", s.ref, "--aspect", "16:9", "--size", "2K", "--out", out, "--prompt", prompt], { stdio: ["ignore", "pipe", "pipe"] });
    console.log("still", k);
  } catch (e) {
    console.log("FAILED", k, String(e.stderr).split("\n").filter(Boolean).slice(-1)[0]);
  }
}
