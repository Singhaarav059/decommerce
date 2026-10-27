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
const motion = JSON.parse(readFileSync("scripts/v7/motion.json", "utf8"));
// frames per second taken from each motion clip: enough for a smooth scrub, light enough for phones
const FPS = 8;
// frames in a dissolve between two keyframes
const DISSOLVE = 14;
const beatsOf = (k) => spec[k].beats.map((b) => `${V7}/${k}/${b.id}.png`).filter(existsSync);

// Motion: keyframe, the frames between it and the next keyframe, that keyframe, … Each step is a Veo clip pinned
// to its two keyframes (whose own end frames are swapped for the sharp stills) or, for a before/after switch no
// real action explains, a dissolve. Returns the keyframes' frame indices, or undefined until every clip exists.
function motionFrames(k, beats, out, mfx, phone = 9 / 16) {
  const steps = (motion[k] ?? []).map((t) => ({ ...t, clip: t.dissolve ? null : `assets-src/vertex/v7-${k}-${t.from}${t.to}.mp4` }));
  rmSync(out, { recursive: true, force: true });
  if (!steps.length || !steps.every((t) => !t.clip || existsSync(t.clip))) return undefined;
  for (const d of ["d", "m"]) mkdirSync(`${out}/${d}`, { recursive: true });
  const tmp = `/tmp/v7-${k}`;
  rmSync(tmp, { recursive: true, force: true });
  const frames = [beats[0]];
  const keys = [0];
  steps.forEach((t, c) => {
    mkdirSync(`${tmp}/${c}`, { recursive: true });
    if (t.clip) sh("ffmpeg", ["-v", "error", "-i", t.clip, "-vf", `fps=${FPS}`, `${tmp}/${c}/%03d.png`]);
    else sh("python3", ["-c", `
from PIL import Image
a=Image.open("${beats[c]}").convert("RGB"); b=Image.open("${beats[c + 1]}").convert("RGB").resize(a.size)
a=a.resize((1920, round(1920*a.size[1]/a.size[0]))); b=b.resize(a.size)
for i in range(${DISSOLVE} + 2): Image.blend(a, b, i/(${DISSOLVE} + 1)).save(f"${tmp}/${c}/{i:03d}.png")`]);
    const own = readdirSync(`${tmp}/${c}`).sort().slice(1, -1).map((f) => `${tmp}/${c}/${f}`);
    frames.push(...own, beats[c + 1]);
    keys.push(frames.length - 1);
  });
  frames.forEach((src, i) => {
    const [W, H] = size(src);
    const n = String(i).padStart(3, "0");
    // held keyframes stay at full sharpness; the frames between them are only seen while scrolling
    const key = beats.includes(src);
    webp(src, `${out}/d/${n}.webp`, key ? 2560 : 1920, key ? 86 : 76);
    const cw = Math.round(H * phone), x = Math.max(0, Math.min(W - cw, Math.round((W * mfx) / 100 - cw / 2)));
    webp(src, `${out}/m/${n}.webp`, 720, 76, [x, 0, cw, H]);
  });
  rmSync(tmp, { recursive: true, force: true });
  return keys;
}

// a web film: H.264, no audio, starts playing before it has fully loaded
const film = (src, out) => sh("ffmpeg", ["-v", "error", "-y", "-i", src, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out]);

if (on("hero")) {
  // the tall cut (hero-v, 9:16) once it exists: its sale film is pinned to exactly these two keyframes
  const tall = beatsOf("hero-v").length === spec["hero-v"].beats.length;
  // the page shows the first and last keyframes; the middle one only pins the film
  for (const src of beatsOf(tall ? "hero-v" : "hero").filter((f) => !f.endsWith("/m.png"))) webp(src, `public/assets/hero/beat-${src.split("/").pop()[0]}.webp`, tall ? 1600 : 2400, 90);
  // the sale is short clips, one action each (shirt into the bag, bag handed over), joined into one film
  const sale = motion["hero-v"].map((t) => `assets-src/vertex/v7-hero-v-${t.from}${t.to}.mp4`);
  if (tall && sale.every(existsSync)) {
    writeFileSync("/tmp/v7-sale.txt", sale.map((f) => `file '${process.cwd()}/${f}'`).join("\n"));
    sh("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "/tmp/v7-sale.txt", "-c", "copy", "/tmp/v7-sale.mp4"]);
    film("/tmp/v7-sale.mp4", "public/assets/hero/sale.mp4");
  }
  console.log("hero", tall ? "tall" : "4:5", existsSync("public/assets/hero/sale.mp4") ? "with sale film" : "");
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
  // phones show the close film in a shorter, wider pane than a solution hero: cut it 4:5
  const keys = motionFrames("close", beatsOf("close"), "public/assets/seq/close/motion", spec.close.focus[0], 4 / 5);
  console.log("close", beatsOf("close").length, keys ? `motion ${readdirSync("public/assets/seq/close/motion/d").length} frames, keys ${keys}` : "no motion yet");
}

// each solution's close-up (Features, the homepage service cards)
for (const k of Object.keys(spec).filter((k) => k.startsWith("d-") && on(k))) {
  const [src] = beatsOf(k);
  if (!src) { console.log("missing", k); continue; }
  webp(src, `public/assets/sol/${k.slice(2)}/detail.webp`, 1600);
  console.log("detail", k);
}

// company and legal pages: one scene each, composed around its people
const scenes = JSON.parse(readFileSync("src/content/company/scenes.json", "utf8"));
for (const k of Object.keys(spec).filter((k) => k.startsWith("co-") && on(k))) {
  const [src] = beatsOf(k);
  if (!src) { console.log("missing", k); continue; }
  webp(src, `public/assets/company/scene-${k.slice(3)}.webp`, 2560);
  const clip = `assets-src/vertex/v7-${k}-ab.mp4`;
  if (existsSync(clip)) film(clip, `public/assets/company/film-${k.slice(3)}.mp4`);
  scenes[k.slice(3)] = { floor: sh("python3", ["scripts/v3/floor.py", src, "0.7", "0.89"]).trim(), ...(existsSync(clip) ? { film: true } : {}) };
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
  const keys = motionFrames(k, beats, `${dir}/motion`, mfx);
  const end = beats.at(-1);
  webp(end, `${dir}/end.webp`, 1920);
  const [W, H] = size(end), cw = Math.round((H * 4) / 3), x = Math.max(0, Math.min(W - cw, Math.round((W * fx) / 100 - cw / 2)));
  webp(end, `${dir}/thumb.webp`, 160, 80, [x, 0, cw, H]);
  media[k] = { count: readdirSync(`${dir}/beats/d`).length, beats: true, ...(keys ? { motion: readdirSync(`${dir}/motion/d`).length, keys } : {}), focus: spec[k].focus, floor: sh("python3", ["scripts/v3/floor.py", beats[0], "0.7", "0.8"]).trim() };
  console.log("sol", k, media[k]);
}
writeFileSync("src/content/solutions/media.json", JSON.stringify(media, null, 2) + "\n");
