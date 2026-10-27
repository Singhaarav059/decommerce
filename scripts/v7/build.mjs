// Build the site's media from the v7 keyframe beats (assets-src/stills/v7/<scene>/<beat>.png, scripts/v7/beats.mjs).
// Beats are served sharp (near full resolution, high quality) because each one is held on screen.
// node scripts/v7/build.mjs [hero|close|j-<step>|co-<page>|<solution slug> ...]
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }).toString();
const V7 = "assets-src/stills/v7";
const spec = JSON.parse(readFileSync("scripts/v7/beats.json", "utf8"));
const only = process.argv.slice(2);
const on = (k) => !only.length || only.includes(k);
const webp = (src, out, w, q = 86, crop) => sh("cwebp", ["-quiet", "-q", String(q), "-m", "6", "-sharp_yuv", ...(crop ? ["-crop", ...crop.map(String)] : []), "-resize", String(w), "0", src, "-o", out]);
const size = (p) => sh("python3", ["-c", `from PIL import Image; print(*Image.open("${p}").size)`]).trim().split(" ").map(Number);
const beatsOf = (k) => spec[k].beats.map((b) => `${V7}/${k}/${b.id}.png`).filter(existsSync);

if (on("hero")) {
  for (const src of beatsOf("hero")) webp(src, `public/assets/hero/beat-${src.split("/").pop()[0]}.webp`, 2400, 90);
  console.log("hero", beatsOf("hero").length);
}

// the homepage journey: one still per step
for (const k of Object.keys(spec).filter((k) => k.startsWith("j-") && on(k))) {
  const [src] = beatsOf(k);
  if (!src) { console.log("missing", k); continue; }
  mkdirSync("public/assets/journey", { recursive: true });
  webp(src, `public/assets/journey/${k.slice(2)}.webp`, 2048);
  console.log("journey", k);
}

// the homepage's closing chapter: dusk keyframes in place of the old film
if (on("close") && beatsOf("close").length === spec.close.beats.length) {
  const dir = "public/assets/seq/close/beats";
  for (const d of ["d", "m"]) mkdirSync(`${dir}/${d}`, { recursive: true });
  beatsOf("close").forEach((src, i) => {
    const [W, H] = size(src), cw = Math.round((H * 4) / 5), x = Math.max(0, Math.min(W - cw, Math.round((W * spec.close.focus[0]) / 100 - cw / 2)));
    webp(src, `${dir}/d/${String(i).padStart(3, "0")}.webp`, 2560);
    webp(src, `${dir}/m/${String(i).padStart(3, "0")}.webp`, cw, 86, [x, 0, cw, H]);
  });
  console.log("close", beatsOf("close").length);
}

// company and legal pages: one scene each, composed around its people
const scenes = JSON.parse(readFileSync("src/content/company/scenes.json", "utf8"));
for (const k of Object.keys(spec).filter((k) => k.startsWith("co-") && on(k))) {
  const [src] = beatsOf(k);
  if (!src) { console.log("missing", k); continue; }
  webp(src, `public/assets/company/scene-${k.slice(3)}.webp`, 2560);
  scenes[k.slice(3)] = { floor: sh("python3", ["scripts/v3/floor.py", src, "0.7", "0.89"]).trim() };
  console.log("company", k);
}
writeFileSync("src/content/company/scenes.json", JSON.stringify(scenes, null, 2) + "\n");

const media = JSON.parse(readFileSync("src/content/solutions/media.json", "utf8"));
for (const k of Object.keys(media).filter((k) => spec[k] && on(k))) {
  const beats = beatsOf(k);
  if (beats.length !== spec[k].beats.length) { console.log("missing beats", k); continue; }
  const dir = `public/assets/sol/${k}`;
  const [fx] = spec[k].focus ?? [50, 50];
  // phones can keep a different point in view (`mfocus`), e.g. between a person and her screen
  const [mfx] = spec[k].mfocus ?? spec[k].focus ?? [50, 50];
  rmSync(`${dir}/seq`, { recursive: true, force: true });
  for (const d of ["d", "m"]) mkdirSync(`${dir}/beats/${d}`, { recursive: true });
  beats.forEach((src, i) => {
    const [W, H] = size(src);
    const n = String(i).padStart(3, "0");
    webp(src, `${dir}/beats/d/${n}.webp`, 2560);
    // phones: a tall cut centred on the subject, at full height
    const cw = Math.round((H * 9) / 16), x = Math.max(0, Math.min(W - cw, Math.round((W * mfx) / 100 - cw / 2)));
    webp(src, `${dir}/beats/m/${n}.webp`, cw, 86, [x, 0, cw, H]);
  });
  const end = beats.at(-1);
  webp(end, `${dir}/end.webp`, 1920);
  const [W, H] = size(end), cw = Math.round((H * 4) / 3), x = Math.max(0, Math.min(W - cw, Math.round((W * fx) / 100 - cw / 2)));
  webp(end, `${dir}/thumb.webp`, 160, 80, [x, 0, cw, H]);
  media[k] = { count: readdirSync(`${dir}/beats/d`).length, beats: true, focus: spec[k].focus, floor: sh("python3", ["scripts/v3/floor.py", beats[0], "0.7", "0.8"]).trim() };
  console.log("sol", k, media[k]);
}
writeFileSync("src/content/solutions/media.json", JSON.stringify(media, null, 2) + "\n");
