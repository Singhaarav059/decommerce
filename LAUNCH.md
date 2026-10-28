> **Redesign preview:** The 2026-10-27 redesign changes the page layouts and motion after the historical checks below. The current work remains local; the historical deployment and Lighthouse results do not verify this redesign. Demo submissions require `DEMO_WEBHOOK_URL`; without it the form reports that delivery is unavailable. The local preview uses an explicitly labelled dummy email and example-only contact form; replace these with a real contact and delivery destination before launch.

# Launch checklist

Status of the PLAN.md launch checklist, updated 24 Oct 2026 after the owner-review revision and first deploy. ✅ done and verified · ⚠️ done with caveats · ⬜ needs a person.

| Item | Status | Notes |
| --- | --- | --- |
| All 22 routes live with real copy | ⚠️ | All 22 routes build static with written copy. Owner review needed: Security claims (TLS, RBAC, 2FA, audit log, backups), module availability per solution, legal pages (marked draft, need counsel), the `brand.demoEmail` placeholder in `src/content/site.ts`. |
| Lighthouse mobile ≥ 90 performance on home and 3 solution pages | ✅ | Production build, `scripts/lighthouse.sh` (24 Oct): home 94, POS 96, About 95; accessibility, best practices and SEO 100. LCP 2.9–3.2 s on simulated slow 4G (budget 2.5 s), TBT 10 ms, CLS 0. |
| Tested on a mid-range Android, an iPhone, Safari desktop and Chrome desktop | ⬜ | Verified in headless Chromium at 360, 390, 768 and 1440 px only. Real-device runs still needed (Safari/iOS scroll scrubbing in particular). |
| Reduced-motion path checked | ✅ | No WebGL. Reduced motion (and save-data) shows each film's finished scene, unpinned, with every text step listed. |
| Keyboard path through every interaction | ✅ | The rack takes arrows, Enter and Escape; anatomy parts are buttons; tabs use a roving tabindex; FAQ is buttons. |
| OG images, sitemap.xml, robots.txt, llms.txt | ✅ | Served by the build. URLs use `brand.siteUrl`: `NEXT_PUBLIC_SITE_URL` if set, else Vercel's production domain (now https://decommerce-lime.vercel.app; follows a custom domain once added). |
| CREDITS.md complete | ✅ | Generated media (Google Vertex AI: Veo, Gemini) and OFL fonts listed with sources; owner to confirm rights for the three reference renders. |
| Contact form delivers to the right inbox | ⬜ | `/api/demo` validates and forwards to `DEMO_WEBHOOK_URL`. Set it to the chosen CRM, Slack or form-to-email endpoint (open decision), then send a test lead. |
| Accessibility (axe WCAG 2.1 AA) | ✅ | `scripts/checks/a11y.mjs`: no violations on all 22 routes at 1440 and 390. |
| No horizontal overflow | ✅ | `scripts/checks/overflow.mjs`: all 22 routes at 360, 390, 768 and 1440. |

## Still open (from PLAN.md)

- Final name styling, custom domain and logo (the wordmark is a placeholder lowercase grotesk with a copper full stop).
- Which of the 12 modules exist today and which are coming soon.
- Demo booking target (email, Calendly or CRM).
- Deployment: done. Vercel project `decommerce` (framework Next.js) builds `main` from github.com/Singhaarav059/decommerce on every push; production at https://decommerce-lime.vercel.app. Preview URLs require a Vercel login (default protection).

## Gaps against fynd.com that need real input (26 Oct 2026)

Compared section by section with fynd.com. These are things Fynd shows that we must not invent; each needs Demaze to supply or confirm:

- Customer logos and a "trusted by" strip (Fynd: logo wall on every page).
- Case studies with results (Fynd: Campus Shoes, Reliance Retail and others with measured figures).
- Platform figures (Fynd: customers served, GMV, stores, countries, orders per hour). We only show Demaze's own numbers (45+ projects, 35+ people, 6 years).
- Review ratings (Fynd: G2 4.5/5).
- Security certifications and badges (Fynd: SOC, GDPR, ISO). Our Security page describes practices only.
- Pricing pages (Fynd: Storefront, Logistics, Store OS and Snap pricing).
- AI tools (Fynd: AI agents, AI photoshoot, image editor, AR try-on, workflow automation, AI catalog PIM). Decide which, if any, Decommerce or Decignal provides.
- A catalog / PIM module (Fynd lists it separately; our "one catalog" is implied, not a module page).
- Named integrations (we list kinds of system; confirm which ready connectors exist).
- Resources: blog, customer stories, release notes, docs, events, newsroom, careers, status page.
- Feature lists per module (`src/content/solutions/features.ts`) describe standard capabilities; confirm each exists.
