// Animate every scroll film from its v6 start frame (locked cast, white and sage), on the quality model, (and end frame where the story needs a
// fixed ending), reusing the v3/v4 movement prompts. Skips clips that already exist.
// node scripts/v5/films.mjs [name...]   → assets-src/vertex/v5-<name>.mp4
import { execFile } from "node:child_process";
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { promisify } from "node:util";
const run = promisify(execFile);
const V5 = "assets-src/stills/v6";
const home = JSON.parse(readFileSync("scripts/v3/shots.json", "utf8"));
const sol = JSON.parse(readFileSync("scripts/v3/sol-shots.json", "utf8"));
const LOCK = "Locked-off tripod shot: the camera does not move, pan or zoom at all, framing stays exactly as in the image. ";
// the re-shot story fixes (courier at the door, card tapped not handed over, scanner aimed, pallet pulled by hand)
const fixes = {
  delivery: LOCK + "A courier in a plain oatmeal jacket steps out from behind the van carrying one small kraft parcel, walks to the copper front door and rings the bell. The door opens from inside and a woman in an oatmeal knit sweater appears in the doorway. The courier hands her the parcel; she takes it in both hands and stays standing in the doorway. The courier turns and walks back towards the van. The courier never goes through the door; the van stays parked; there is only one van.",
  counter: LOCK + "The customer takes a bank card from her coat pocket and holds it flat over the card terminal on the counter for a moment to pay contactless, then puts the card straight back in her pocket. She never hands the card to the cashier. Then the cashier lifts the cream paper shopping bag by its handles and hands it across the counter, and the customer takes it by the handles and smiles.",
  pack: LOCK + "The picker picks up the handheld barcode scanner from the table, points it down at the white shipping label on the top of the kraft box in front of him and scans it, puts the scanner back on the table, presses the box flaps closed with both hands, then pushes the box onto the roller conveyor on the right, which carries it slowly out of the right side of the frame. Nothing moves into the left part of the frame.",
  pos: LOCK + "The cashier picks up the small handheld scanner, scans the folded rust knit, puts the scanner down, then lifts the folded rust knit with both hands and places it carefully into the open cream paper bag. The customer holds her phone over the card terminal to pay. The receipt printer slowly prints a short plain receipt.",
  b2b: LOCK + "The worker grips the pallet jack handle with both hands and walks slowly backwards to the right, pulling the front pallet with him; he keeps holding the handle the whole time, so the worker, the jack and the pallet leave the right side of the frame together. The back pallet stays where it is.",
  hero: "A very slow, smooth push in toward the cutaway building; the plain wall on the left stays plain and empty. On the ground floor Meera hands the white shopping bag across the counter and Ananya takes it by the handles and smiles; upstairs Arjun lifts the folded linen overshirt from the shelf; at the kerb Rohan slides the parcel into the van. Soft pulses of green light travel along the thin glowing threads into the small glowing hang tag, which glows a little brighter each time. Leaf shadows sway gently on the wall.",
};
const KEEP = " Objects only move while a hand holds them; nothing floats, slides or appears by itself. Keep the animated-feature look, the white and sage palette, every character, material and colour exactly as in the image. Smooth, gentle animation, no cuts, no text.";
const jobs = {};
jobs.hero = { image: `${V5}/hero.png`, prompt: fixes.hero };
for (const k of Object.keys(home).filter((k) => !k.startsWith("_"))) jobs[k] = { image: `${V5}/${k}.png`, last: existsSync(`${V5}/${k}-end.png`) ? `${V5}/${k}-end.png` : undefined, prompt: fixes[k] ?? home[k].move };
// b2b's end frame came out identical to its start; the pallet has to leave the frame, so it runs unpinned
const NO_LAST = new Set(["b2b"]);
for (const k of Object.keys(sol).filter((k) => !k.startsWith("_"))) jobs[`sol-${k}`] = { image: `${V5}/sol/${k}.png`, last: NO_LAST.has(k) ? undefined : `${V5}/sol/${k}-end.png`, prompt: fixes[k] ?? sol[k].move };
if (!existsSync(`${V5}/hero.png`)) copyFileSync("assets-src/style3/HERO.png", `${V5}/hero.png`);
// films wait until the stills have been reviewed (touch assets-src/stills/v6/.approved)
if (!existsSync(`${V5}/.approved`)) { console.log("stills not approved yet"); process.exit(0); }
const only = process.argv.slice(2);
const names = Object.keys(jobs).filter((k) => (only.length ? only.includes(k) : !existsSync(`assets-src/vertex/v6-${k}.mp4`)));
const q = [...names];
await Promise.all([0, 1, 2].map(async () => {
  while (q.length) {
    const k = q.shift(), j = jobs[k];
    if (!existsSync(j.image)) { console.log("no still", k); continue; }
    const args = ["scripts/vertex/veo.mjs", "--model", "veo-3.1-generate-001", "--res", "1080p", "--seconds", "8", "--seed", String(700 + names.indexOf(k)), "--image", j.image, "--out", `assets-src/vertex/v6-${k}.mp4`,
      "--negative", "text, captions, watermark, logos, extra people, extra vehicles, morphing, floating objects, objects appearing or disappearing, clay, plastic, blurry, distorted geometry, flicker", "--prompt", j.prompt + KEEP];
    if (j.last && existsSync(j.last)) args.push("--last", j.last);
    try {
      await run("node", args, { maxBuffer: 1 << 24, env: { ...process.env, VERTEX_CAP_USD: "200" } });
      console.log("clip", k);
    } catch (e) {
      console.log("FAILED", k, String(e.stderr || e.message).split("\n").filter(Boolean).slice(-1)[0]);
    }
  }
}));
