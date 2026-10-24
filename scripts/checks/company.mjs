// Screenshots each company/legal page at the top and one screen into the body.
// node scripts/checks/company.mjs <outdir> [widths=1440,390]
import { chromium } from "playwright";
const [out = "/tmp/dc-shots", ws = "1440,390"] = process.argv.slice(2);
const base = process.env.BASE ?? "http://localhost:3000";
const pages = ["about-us", "contact-us", "partners", "security", "infrastructure", "glossary", "privacy-policy", "terms-and-conditions", "ai-instructions"];
const b = await chromium.launch();
for (const w of ws.split(",").map(Number)) {
  const mobile = w < 768;
  const ctx = await b.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));
  for (const pg of pages) {
    await p.goto(`${base}/${pg}`, { waitUntil: "networkidle" });
    await p.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${out}/c-${pg}-${w}-0.png` });
    await p.evaluate(() => scrollTo(0, innerHeight * 1.05));
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${out}/c-${pg}-${w}-1.png` });
  }
  console.log(JSON.stringify({ w, errs: errs.slice(0, 4) }));
  await ctx.close();
}
await b.close();
