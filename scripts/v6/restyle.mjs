// Re-render every v3 source still with the locked cast (assets-src/style3/CAST.png) in the white and sage
// palette and animated-feature finish of the hero (assets-src/style3/HERO.png), keeping each
// still's composition, people, poses and the empty left part for text. Start frames go first; end and
// detail frames then also take their restyled start frame as a reference so characters match.
// node scripts/v5/restyle.mjs [name-filter...]   → assets-src/stills/v5/<same path>
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";
const run = promisify(execFile);
const CAST = "assets-src/style3/CAST.png", HERO = "assets-src/style3/HERO.png";
const V3 = "assets-src/stills/v3", V5 = "assets-src/stills/v6";
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
  "Re-render the FIRST image as a still from a top-tier modern 3D animated feature film, in exactly the finish, materials and palette of the THIRD image, with the people played by the characters of the SECOND image (match their faces, fair skin tones, hair and outfits exactly). " +
  "Cast: any shop associate, cashier or person serving at a counter is Meera (long dark waves, white shirt, pale grey trousers); any customer or shopper is Ananya (sage-green coat, sleek bun); any warehouse worker, picker, stockroom worker or photographer is Arjun (grey overshirt, groomed beard); any courier, driver or delivery person is Rohan (white jacket, navy trousers). Other people get the same glamorous, fair, North Indian animated look. " +
  "Keep the first image's composition, camera angle, framing, layout, every object, every person's pose and action exactly. Where the first image has a calm empty area for text (usually the left part), keep it equally plain and empty. " +
  "Palette and materials: bright white plaster and pale grey limestone, white terrazzo, light ash wood, soft sage green and deep forest green accents, living greenery, brushed chrome details, fresh clean daylight from the upper left. Replace any brown, beige, tan, copper, orange or travertine with these. No text, letters, numbers, logos or signs.";
// scene fixes found in review: what the generic prompt got wrong for these
const LEFT = " The entire left 42 percent of the frame must be completely empty plain wall and floor: move every object out of it.";
const VAN = " REPLACE the van completely: remove the boxy older van and put in its place a sleek, modern, premium white electric delivery van with a long smooth rounded bonnet, a large curved windscreen, flush body panels and a sliding side door, exactly like the van at the kerb in the THIRD image; same position and size in the frame, side door open.";
const EXTRA = {
  "rack-wall": " This frame is ONLY an empty wall for a clothing rail to hang in front of: a plain bright white plaster wall with soft leaf shadows and a pale terrazzo floor. No people, no building, no rooms, no objects.",
  "co/security": " Keep the first image's subject: a calm entrance hall with a secure brushed steel door and a small keypad. Do not show a building cutaway, a street or a van.",
  delivery: VAN, "delivery-end": VAN,
  counter: " Any gift box is sage green, never orange.",
  "sol/b2b-detail": LEFT, "sol/marketplace-detail": LEFT,
};
async function one(name, refs, extra = "") {
  extra += EXTRA[name] ?? "";
  const args = ["scripts/vertex/image.mjs", "--aspect", "16:9", "--size", "2K", "--out", `${V5}/${name}.png`, "--prompt", STYLE_TEXT + extra];
  for (const r of refs) args.push("--ref", r);
  try {
    await run("node", args, { maxBuffer: 1 << 24, env: { ...process.env, VERTEX_CAP_USD: "200" } });
    console.log("ok", name);
  } catch (e) {
    console.log("FAILED", name, String(e.stderr || e.message).split("\n").filter(Boolean).slice(-1)[0]);
  }
}
async function pool(jobs, n = 2) {
  const q = [...jobs];
  await Promise.all(Array.from({ length: n }, async () => { while (q.length) await q.shift()(); }));
}
await pool(starts.filter(want).map((n) => () => one(n, [`${V3}/${n}.png`, CAST, HERO])));
await pool(follows.filter(([n]) => want(n)).map(([n, s]) => () =>
  one(n, [`${V3}/${n}.png`, CAST, HERO, `${V5}/${s}.png`], " The FOURTH image is this same scene already re-rendered: match its characters, materials and colours exactly.")));
