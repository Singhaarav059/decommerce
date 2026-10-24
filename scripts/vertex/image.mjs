// Generate or edit a still with Gemini image models on Vertex AI.
//
//   node scripts/vertex/image.mjs --prompt "..." --out assets-src/stills/x.png \
//     [--ref a.png --ref b.png] [--model gemini-3-pro-image] [--aspect 16:9] [--size 2K] [--dry]
//
// Reference images go first (the image to edit, then style references).
// Shares the spending cap and ledger with veo.mjs.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, extname } from "node:path";
import { IMAGE_PRICE, guard, record, vertex } from "./lib.mjs";

const argv = process.argv.slice(2);
const arg = (k, d) => {
  const i = argv.indexOf(`--${k}`);
  return i > -1 ? argv[i + 1] : d;
};
const refs = argv.flatMap((a, i) => (a === "--ref" ? [argv[i + 1]] : []));
const prompt = arg("prompt");
const out = arg("out");
const model = arg("model", "gemini-3-pro-image");
const aspect = arg("aspect", "16:9");
const size = arg("size", "2K");
if (!prompt || !out) throw new Error("--prompt and --out are required");
const price = IMAGE_PRICE[model];
if (price == null) throw new Error(`No price for ${model}`);
guard(price, `${model} ${aspect} ${size}`);
if (argv.includes("--dry")) process.exit(0);

const parts = [
  ...refs.map((p) => ({ inlineData: { mimeType: extname(p) === ".png" ? "image/png" : extname(p) === ".webp" ? "image/webp" : "image/jpeg", data: readFileSync(p).toString("base64") } })),
  { text: prompt },
];
const res = await vertex(
  `publishers/google/models/${model}:generateContent`,
  {
    contents: [{ role: "user", parts }],
    generationConfig: { responseModalities: ["TEXT", "IMAGE"], imageConfig: { aspectRatio: aspect, imageSize: size } },
  },
  "global",
);
const outParts = res.candidates?.[0]?.content?.parts ?? [];
// Thinking models can return interim "thought" images first; keep the final, non-thought image.
const images = outParts.filter((p) => p.inlineData?.data);
const img = [...images].reverse().find((p) => !p.thought) ?? images.at(-1);
console.log(`[image] ${images.length} image part(s), ${images.filter((p) => p.thought).length} marked as thought`);
const note = outParts.filter((p) => p.text).map((p) => p.text).join(" ").slice(0, 300);
record({ kind: "image", model, aspect, size, usd: img ? price : 0, out, prompt: prompt.slice(0, 160) });
if (!img) throw new Error(`No image returned. ${note || JSON.stringify(res.promptFeedback ?? res).slice(0, 400)}`);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(img.inlineData.data, "base64"));
console.log("[image] saved", out, note ? `· model note: ${note}` : "");
