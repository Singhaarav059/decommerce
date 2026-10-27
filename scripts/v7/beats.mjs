// Keyframe beats for every scene, from scripts/v7/beats.json. Beat one is drawn from the portraits of the scene's
// characters (assets-src/style3/cast-<name>.png) and a style frame; each later beat edits beat one, changing only its action, so faces, set and light hold.
// Skips beats that exist; --take N writes <beat>-tN.png beside them for comparison.
// node scripts/v7/beats.mjs [scene...] [--take N]   → assets-src/stills/v7/<scene>/<beat>.png
import { execFile } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { promisify } from "node:util";
const run = promisify(execFile);
const FINISH = "assets-src/style3/team.png";
const spec = JSON.parse(readFileSync("scripts/v7/beats.json", "utf8"));
const argv = process.argv.slice(2);
const ti = argv.indexOf("--take");
const take = ti > -1 ? argv[ti + 1] : null;
const only = argv.filter((a, i) => !a.startsWith("--") && (ti < 0 || i !== ti + 1));
const scenes = Object.keys(spec).filter((k) => !k.startsWith("_") && (!only.length || only.includes(k)));
// each scene gets portraits of only its own characters (a four-person sheet invites everyone into the shot)
const castOf = (s) => (s.cast ?? ["meera", "ananya", "arjun", "rohan"]);
const styleOf = (s) => spec._style.replace("{cast}", castOf(s).map((c) => spec._people[c]).join("; "));
const portraits = (s) => castOf(s).map((c) => `assets-src/style3/cast-${c}.png`);
const file = (k, id, t = take) => `assets-src/stills/v7/${k}/${id}${t ? `-t${t}` : ""}.png`;

async function image(out, refs, prompt, { aspect, size }) {
  const args = ["scripts/vertex/image.mjs", "--aspect", aspect, "--size", size, "--out", out, "--prompt", prompt];
  for (const r of refs) args.push("--ref", r);
  await run("node", args, { maxBuffer: 1 << 24, env: { ...process.env, VERTEX_CAP_USD: "230" } });
}

const one = async (k) => {
  const s = spec[k];
  const [first, ...rest] = s.beats;
  try {
    const a = file(k, first.id);
    if (!existsSync(a) && s.base) {
      // beat one is an approved picture extended to this aspect (e.g. the 4:5 hero to 9:16 for video)
      await image(a, [s.base, ...portraits(s)], `${s.extend} ${styleOf(s)}`, s);
      console.log("ok", k, first.id);
    } else if (!existsSync(a)) {
      const compose = s.aspect === "16:9" && s.compose !== false ? ` ${spec._compose}` : "";
      await image(a, [...portraits(s), FINISH], `${styleOf(s)} The last reference image shows the finish, materials and light to match (not its people). Scene: ${s.scene}${compose} Action: ${first.action}`, s);
      console.log("ok", k, first.id);
    }
    // later beats always edit the approved beat one (never a take), so they share its exact set and cast
    const base = file(k, first.id, null);
    for (const b of rest) {
      const out = file(k, b.id);
      if (existsSync(out)) continue;
      await image(out, [base, ...portraits(s)], `${spec._edit}${b.action} ${styleOf(s)}`, s);
      console.log("ok", k, b.id);
    }
  } catch (e) {
    console.log("FAILED", k, String(e.stderr || e.message).split("\n").filter(Boolean).slice(-1)[0]);
  }
};
const q = [...scenes];
// three at a time: more than that only collects rate-limit retries from Vertex
await Promise.all([0, 1, 2].map(async () => { while (q.length) await one(q.shift()); }));
