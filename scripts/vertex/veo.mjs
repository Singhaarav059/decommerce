// Generate a Veo video on Vertex AI, optionally starting from an image.
//
//   node scripts/vertex/veo.mjs --prompt "..." --out assets-src/vertex/clip.mp4 \
//     [--image ref.png] [--last end.png] [--model veo-3.1-fast-generate-001] \
//     [--seconds 4|6|8] [--res 720p|1080p] [--aspect 16:9|9:16] [--seed 7] [--dry]
//
// Prints the cost estimate and refuses to run past the cap (VERTEX_CAP_USD,
// default $100). Every paid call is written to assets-src/vertex/ledger.json.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, extname } from "node:path";
import { VIDEO_PRICE, guard, record, vertex, sleep } from "./lib.mjs";

const argv = process.argv.slice(2);
const arg = (k, d) => {
  const i = argv.indexOf(`--${k}`);
  return i > -1 ? argv[i + 1] : d;
};
const prompt = arg("prompt");
const out = arg("out");
const image = arg("image");
const last = arg("last");
const model = arg("model", "veo-3.1-fast-generate-001");
const seconds = Number(arg("seconds", "4"));
const res = arg("res", "720p");
const aspect = arg("aspect", "16:9");
const seed = arg("seed");
const negative = arg("negative", "text, captions, watermark, logos, people, blurry, distorted geometry, flicker");
if (!prompt || !out) throw new Error("--prompt and --out are required");

const price = VIDEO_PRICE[model]?.[res];
if (price == null) throw new Error(`No price for ${model} at ${res}`);
const estimate = price * seconds;
guard(estimate, `${model} ${res} ${seconds}s`);
if (argv.includes("--dry")) process.exit(0);

const media = (p) => ({ bytesBase64Encoded: readFileSync(p).toString("base64"), mimeType: extname(p) === ".png" ? "image/png" : "image/jpeg" });
const instance = { prompt };
if (image) instance.image = media(image);
if (last) instance.lastFrame = media(last);
const parameters = { aspectRatio: aspect, durationSeconds: seconds, resolution: res, generateAudio: false, sampleCount: 1, negativePrompt: negative, personGeneration: "allow_adult" };
if (seed) parameters.seed = Number(seed);

const base = `publishers/google/models/${model}`;
const op = await vertex(`${base}:predictLongRunning`, { instances: [instance], parameters });
console.log("[veo] started", op.name);

let done;
for (let i = 0; i < 120; i++) {
  await sleep(10_000);
  done = await vertex(`${base}:fetchPredictOperation`, { operationName: op.name });
  if (done.done) break;
  process.stdout.write(".");
}
console.log("");
if (!done?.done) throw new Error("Timed out waiting for Veo (20 min)");
if (done.error) throw new Error(`Veo error: ${JSON.stringify(done.error)}`);

const videos = done.response?.videos ?? [];
// Veo bills for generated video; a fully filtered request returns no videos.
record({ kind: "video", model, res, seconds, usd: videos.length ? estimate : 0, out, prompt: prompt.slice(0, 160), filtered: done.response?.raiMediaFilteredCount ?? 0 });
if (!videos.length) throw new Error(`No video returned (filtered: ${JSON.stringify(done.response?.raiMediaFilteredReasons ?? done.response)})`);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(videos[0].bytesBase64Encoded, "base64"));
console.log("[veo] saved", out);
