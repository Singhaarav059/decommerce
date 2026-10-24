// Solution-page media pipeline. Stages run independently and skip finished work.
//   node scripts/solutions/build.mjs stills [slug...]   → assets-src/stills/sol-<slug>-{broken,fixed}.png
//   node scripts/solutions/build.mjs clips  [slug...]   → assets-src/vertex/sol-<slug>-{broken,fixed}.mp4
//   node scripts/solutions/build.mjs frames [slug...]   → public/assets/sol/<slug>/{seq/d,seq/m,still.webp,broken.webp}
// Paid calls go through scripts/vertex/*.mjs (spending cap + ledger).
import { execFile } from "node:child_process";
import { existsSync, readFileSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { promisify } from "node:util";
const run = promisify(execFile);
const cfg = JSON.parse(readFileSync("scripts/solutions/assets.json", "utf8"));
const [stage, ...only] = process.argv.slice(2);
const slugs = Object.keys(cfg.solutions).filter((s) => !only.length || only.includes(s));

async function pool(items, n, fn) {
  const q = [...items];
  await Promise.all(Array.from({ length: n }, async () => { while (q.length) await fn(q.shift()); }));
}
const sh = async (cmd, args) => {
  try {
    const { stdout } = await run(cmd, args, { maxBuffer: 1 << 26 });
    return stdout;
  } catch (e) {
    console.log("FAILED", args.find((a) => a.includes("sol-")) ?? "", String(e.stderr || e.message).split("\n").filter(Boolean).slice(-2).join(" | "));
  }
};
const stillPath = (slug, kind) => {
  const f = cfg.solutions[slug][kind];
  return typeof f === "object" ? f.still : `assets-src/stills/sol-${slug}-${kind}.png`;
};
const clipPath = (slug, kind) => {
  const f = cfg.solutions[slug][kind];
  return typeof f === "object" ? f.clip : `assets-src/vertex/sol-${slug}-${kind}.mp4`;
};

if (stage === "stills") {
  const jobs = slugs.flatMap((slug) => ["broken", "fixed"].filter((k) => typeof cfg.solutions[slug][k] === "string" && !existsSync(stillPath(slug, k))).map((k) => [slug, k]));
  await pool(jobs, 1, async ([slug, kind]) => {
    const s = cfg.solutions[slug];
    const prompt = `${s[kind]} ${cfg._style[s.style]}`;
    const out = await sh("node", ["scripts/vertex/image.mjs", "--ref", s.ref, "--aspect", "16:9", "--size", "2K", "--out", stillPath(slug, kind), "--prompt", prompt]);
    if (out) console.log("still", slug, kind);
  });
}

if (stage === "clips") {
  const jobs = slugs.flatMap((slug) => ["broken", "fixed"].filter((k) => !existsSync(clipPath(slug, k)) && existsSync(stillPath(slug, k))).map((k) => [slug, k]));
  await pool(jobs, 2, async ([slug, kind]) => {
    const out = await sh("node", ["scripts/vertex/veo.mjs", "--res", "1080p", "--seconds", "4", "--seed", String(100 + slugs.indexOf(slug)), "--image", stillPath(slug, kind), "--out", clipPath(slug, kind), "--prompt", cfg._style.move]);
    if (out) console.log("clip", slug, kind);
  });
}

if (stage === "frames") {
  process.on("exit", () => {
    // manifest of frame counts for the pages (src/content/solutions/media.json)
    const all = Object.keys(cfg.solutions);
    const m = {};
    for (const slug of all) {
      const d = `public/assets/sol/${slug}/seq/d`;
      if (existsSync(d)) m[slug] = { count: readdirSync(d).filter((f) => f.endsWith(".webp")).length };
    }
    writeFileSync("src/content/solutions/media.json", JSON.stringify(m, null, 2) + "\n");
  });
  for (const slug of slugs) {
    const s = cfg.solutions[slug];
    const b = clipPath(slug, "broken"), f = clipPath(slug, "fixed");
    if (!existsSync(b) || !existsSync(f)) { console.log("skip", slug); continue; }
    const film = `assets-src/vertex/sol-${slug}-film.mp4`;
    const dir = `public/assets/sol/${slug}`;
    mkdirSync(dir, { recursive: true });
    // broken: first 4 s of its clip; fixed: first 4 s of its clip (longer reused clips are trimmed); 0.4 s crossfade
    await sh("ffmpeg", ["-y", "-loglevel", "error", "-i", b, "-i", f, "-filter_complex",
      "[0]trim=0:4,setpts=PTS-STARTPTS,scale=1920:1080,fps=24,format=yuv420p[a];[1]trim=0:4,setpts=PTS-STARTPTS,scale=1920:1080,fps=24,format=yuv420p[c];[a][c]xfade=transition=fade:duration=0.4:offset=3.6",
      "-c:v", "libx264", "-crf", "14", film]);
    console.log(await sh("scripts/frames-from-video.sh", [film, `${dir}/seq`, "4", "1280", "640", "46", "4:3", s.match ?? (s.style === "miniature" ? "studio" : "none")]));
    for (const [kind, name] of [["fixed", "still"], ["broken", "broken"]]) {
      await sh("cwebp", ["-quiet", "-q", "72", "-resize", "1600", "0", stillPath(slug, kind), "-o", `${dir}/${name}.webp`]);
    }
    // small thumbnail for the menu (4:3 centre crop)
    await sh("ffmpeg", ["-y", "-loglevel", "error", "-i", stillPath(slug, "fixed"), "-vf", "crop=ih*4/3:ih,scale=240:180", "-q:v", "80", `${dir}/thumb.webp`]);
  }
}
