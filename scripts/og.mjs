// Capture the social card (src/app/opengraph-image.png) from /capture/og.
import { chromium } from "playwright";
const base = process.env.BASE ?? "http://localhost:3000";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto(`${base}/capture/og`, { waitUntil: "networkidle" });
await p.addStyleTag({ content: "nextjs-portal{display:none!important}" });
await p.waitForTimeout(1200);
await p.screenshot({ path: "src/app/opengraph-image.png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
await b.close();
console.log("og image written");
