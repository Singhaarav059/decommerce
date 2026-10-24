# Launch checklist

Status of the PLAN.md launch checklist as of the build loop (23 Oct 2026). ✅ done and verified · ⚠️ done with caveats · ⬜ needs a person.

| Item | Status | Notes |
| --- | --- | --- |
| All 22 routes live with real copy | ⚠️ | All 22 routes build static with written copy. Owner review needed: Security claims (TLS, RBAC, 2FA, audit log, backups), module availability per solution, legal pages (marked draft, need counsel), `brand.siteUrl` and `brand.demoEmail` placeholders in `src/content/site.ts`. |
| Lighthouse mobile ≥ 90 performance on home and 3 solution pages | ✅ | Production build, `scripts/lighthouse.sh`: home 96, POS 96, OMS 96, Storefront 95, B2B 95, About 98, Security 98; accessibility, best practices and SEO 100. LCP 2.4–2.9 s on simulated slow 4G (budget 2.5 s), TBT ≤ 50 ms, CLS 0. |
| Tested on a mid-range Android, an iPhone, Safari desktop and Chrome desktop | ⬜ | Verified in headless Chromium at 360, 390, 768 and 1440 px only. Real-device runs still needed, especially HEVC-alpha video in Safari/iOS. |
| Reduced-motion path checked | ✅ | No WebGL any more. Reduced motion shows each film's first frame with the text steps listed in full. |
| Keyboard path through every interaction | ✅ | Drag films have a native range slider; anatomy parts are buttons; tabs use a roving tabindex; FAQ is buttons. |
| OG images, sitemap.xml, robots.txt, llms.txt | ✅ | Served by the build. URLs use the placeholder domain until `brand.siteUrl` is set. |
| CREDITS.md complete | ✅ | All assets are own work or OFL fonts; add rows when real assets land. |
| Contact form delivers to the right inbox | ⬜ | `/api/demo` validates and forwards to `DEMO_WEBHOOK_URL`. Set it to the chosen CRM, Slack or form-to-email endpoint (open decision), then send a test lead. |
| Accessibility (axe WCAG 2.1 AA) | ✅ | `scripts/checks/a11y.mjs`: no violations on all 22 routes at 1440 and 390. |
| No horizontal overflow | ✅ | `scripts/checks/overflow.mjs`: all 22 routes at 360, 390, 768 and 1440. |

## Still open (from PLAN.md)

- Final name styling, domain and logo (the wordmark is a placeholder lowercase serif with a copper full stop).
- Which of the 12 modules exist today and which are coming soon.
- Who owns Blender work: real garments, character reference sheets and clips to replace the placeholders.
- Demo booking target (email, Calendly or CRM).
- Deployment: no Vercel/Cloudflare project is connected from this machine. Deploy with `vercel` (or Cloudflare Pages) once an account owner links the project.
