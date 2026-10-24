// Re-shoot the clips whose action broke the story (Oct 2026 review): courier entering the house,
// card handed over instead of tapped, garment flying into the bag, pallet moving with nobody on it,
// scanner waved in the air. First and last frames pin the start and the intended end state.
// node scripts/v3/reshoot.mjs [name...]   → assets-src/vertex/v4-<name>.mp4
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";
const run = promisify(execFile);
const V3 = "assets-src/stills/v3", SOL = `${V3}/sol`;
const LOCK = "Locked-off tripod shot: the camera does not move, pan or zoom at all, framing stays exactly as in the image. ";
const KEEP = " Objects only move while a hand holds them; nothing floats, slides or appears by itself. Keep every object, material, colour and person exactly as in the image. Photorealistic, calm natural movements, no cuts, no text.";
const jobs = {
  delivery: { image: `${V3}/delivery.png`, last: `${V3}/delivery-end.png`, prompt: LOCK + "A courier in a plain oatmeal jacket steps out from behind the van carrying one small kraft parcel, walks to the copper front door and rings the bell. The door opens from inside and a woman in an oatmeal knit sweater appears in the doorway. The courier hands her the parcel; she takes it in both hands and stays standing in the doorway. The courier turns and walks back towards the van on the pavement. The courier never goes through the door; the van stays parked; there is only one van." },
  counter: { image: `${V3}/counter.png`, last: `${V3}/counter-end.png`, prompt: LOCK + "The customer takes a bank card from her coat pocket and holds it flat over the card terminal on the counter for a moment to pay contactless, then puts the card straight back in her pocket. She never hands the card to the cashier. Then the cashier lifts the cream paper shopping bag by its handles and hands it across the counter, and the customer takes it by the handles and smiles." },
  pos: { image: `${SOL}/pos.png`, last: `${SOL}/pos-end.png`, prompt: LOCK + "The cashier picks up the small handheld scanner, scans the folded rust knit, puts the scanner down, then lifts the folded rust knit with both hands and places it carefully into the open cream paper bag. The customer holds her phone over the card terminal to pay. The receipt printer slowly prints a short plain receipt." },
  b2b: { image: `${SOL}/b2b.png`, last: `${SOL}/b2b-end.png`, prompt: LOCK + "The worker grips the pallet jack handle with both hands and walks slowly backwards to the right, pulling the front pallet with him; he keeps holding the handle the whole time, so the worker, the jack and the pallet leave the right side of the frame together. The back pallet stays where it is." },
  pack: { image: `${V3}/pack.png`, prompt: LOCK + "The picker picks up the handheld barcode scanner from the table, points it down at the white shipping label on the top of the kraft box in front of him and scans it, puts the scanner back on the table, presses the box flaps closed with both hands, then pushes the box onto the roller conveyor on the right, which carries it slowly out of the right side of the frame. Nothing moves into the left part of the frame." },
};
const only = process.argv.slice(2);
const names = Object.keys(jobs).filter((k) => (only.length ? only.includes(k) : !existsSync(`assets-src/vertex/v4-${k}.mp4`)));
const q = [...names];
await Promise.all([0, 1].map(async () => {
  while (q.length) {
    const k = q.shift(), j = jobs[k];
    const args = ["scripts/vertex/veo.mjs", "--model", "veo-3.1-generate-001", "--res", "1080p", "--seconds", "8", "--seed", String(500 + names.indexOf(k)), "--image", j.image, "--out", `assets-src/vertex/v4-${k}.mp4`,
      "--negative", "text, captions, watermark, logos, extra people, extra vehicles, morphing, floating objects, objects appearing or disappearing, camera movement, zoom, pan, blurry, distorted geometry, flicker", "--prompt", j.prompt + KEEP];
    if (j.last) args.push("--last", j.last);
    try {
      await run("node", args, { maxBuffer: 1 << 24 });
      console.log("clip", k);
    } catch (e) {
      console.log("FAILED", k, String(e.stderr || e.message).split("\n").filter(Boolean).slice(-1)[0]);
    }
  }
}));
