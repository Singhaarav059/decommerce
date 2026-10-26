// Re-render every v3 source still in the site's animated-film style (cute, human-like characters; style frame assets-src/style2/h1.png), keeping each
// still's composition, people, poses and the empty left part for text. Start frames go first; end and
// detail frames then also take their restyled start frame as a reference so characters match.
// node scripts/v5/restyle.mjs [name-filter...]   → assets-src/stills/v5/<same path>
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";
const run = promisify(execFile);
const STYLE = "assets-src/style2/h1.png";
const V3 = "assets-src/stills/v3", V5 = "assets-src/stills/v5";
const SOL = ["storefront", "brand-showcase", "b2b", "quick-commerce", "marketplace", "oms", "wms", "tms", "pos", "clienteling", "endless-aisle", "self-checkout"];
const CO = ["about-us", "contact-us", "family-decignal", "family-demaze", "infrastructure", "office", "partners", "security"];
const starts = [
  ...["problem", "order", "pack", "delivery", "counter", "proof", "close", "rack-wall"],
  ...SOL.map((k) => `sol/${k}`),
  ...CO.map((k) => `co/${k}`),
];
const follows = [
  ["order-end", "order"], ["delivery-end", "delivery"], ["counter-end", "counter"],
  ...SOL.flatMap((k) => [[`sol/${k}-end`, `sol/${k}`], [`sol/${k}-detail`, `sol/${k}`]]),
];
const only = process.argv.slice(2);
const want = (n) => !existsSync(`${V5}/${n}.png`) && (!only.length || only.some((o) => n.includes(o)));
const STYLE_TEXT =
  "Re-render the FIRST image in exactly the visual style of the SECOND image: a still from a modern big-budget animated feature film with cute, human-like characters: natural human proportions and anatomy, slightly larger expressive eyes, soft rounded friendly faces, detailed individual hair strands, real woven fabric texture on clothes, believable skin with soft subsurface light (not clay, not plastic, not toy-like, not photographic), cinematic warm lighting. " +
  "Keep the first image's composition, camera angle, framing, layout, every object, every person, their poses and actions, and the lighting direction exactly. Where the first image has a calm empty area for text (usually the left part), keep it equally plain and empty. " +
  "Warm stone, oak and copper palette, one warm light from the upper left, no purple, no text, letters, numbers, logos or signs.";
async function one(name, refs, extra = "") {
  const args = ["scripts/vertex/image.mjs", "--aspect", "16:9", "--size", "2K", "--out", `${V5}/${name}.png`, "--prompt", STYLE_TEXT + extra];
  for (const r of refs) args.push("--ref", r);
  try {
    await run("node", args, { maxBuffer: 1 << 24, env: { ...process.env, VERTEX_CAP_USD: "160" } });
    console.log("ok", name);
  } catch (e) {
    console.log("FAILED", name, String(e.stderr || e.message).split("\n").filter(Boolean).slice(-1)[0]);
  }
}
async function pool(jobs, n = 2) {
  const q = [...jobs];
  await Promise.all(Array.from({ length: n }, async () => { while (q.length) await q.shift()(); }));
}
await pool(starts.filter(want).map((n) => () => one(n, [`${V3}/${n}.png`, STYLE])));
await pool(follows.filter(([n]) => want(n)).map(([n, s]) => () =>
  one(n, [`${V3}/${n}.png`, STYLE, `${V5}/${s}.png`], " The THIRD image is the same scene already re-rendered in this style: match its characters, clothes, faces, materials and colours exactly.")));
