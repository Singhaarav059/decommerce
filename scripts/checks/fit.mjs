// Every pinned step must fit inside the viewport (phones especially): reports the text bottom vs the viewport.
// node scripts/checks/fit.mjs [path=/] [sizes=390x844,375x667,360x740,1440x900,1280x720]
import { chromium } from "playwright";
const [path = "/", sizes = "390x844,375x667,360x740,1440x900,1280x720"] = process.argv.slice(2);
const base = process.env.BASE ?? "http://localhost:3000";
const b = await chromium.launch();
let bad = 0;
for (const s of sizes.split(",")) {
  const [w, h] = s.split("x").map(Number);
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 768, hasTouch: w < 768 });
  const p = await ctx.newPage();
  await p.goto(base + path, { waitUntil: "networkidle" });
  const r = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll("[data-film-step]").forEach((el) => {
      const sec = el.closest("[id]")?.id ?? "?";
      // the step's natural box, measured inside its sticky stage
      const stage = el.closest("[data-stage]") ?? document.documentElement;
      const r = el.getBoundingClientRect(), st = stage.getBoundingClientRect();
      out.push({ sec, top: Math.round(r.top - st.top), bottom: Math.round(r.bottom - st.top), stage: Math.round(st.height), text: el.textContent.slice(0, 30) });
    });
    return out;
  });
  for (const x of r) if (x.bottom > x.stage - 8 || x.top < 0) { bad++; console.log(`${s} ${x.sec} over by ${x.bottom - x.stage + 8}px: ${x.text}`); }
  await ctx.close();
}
console.log(bad ? `${bad} steps overflow` : "all steps fit");
await b.close();
