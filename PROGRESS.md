# Build progress

Source plan: [PLAN.md](PLAN.md). One loop iteration = one chunk; update this file at the end of each.

## Phases

- [x] **1. Scaffold** — Next 16.4.3 (Turbopack, cacheComponents), Tailwind 4, tokens.css, Geist + Instrument Serif, Lenis↔GSAP ticker wiring, MDX (`@next/mdx`, `meta` export per file), all 22 routes static, header mega-menu + mobile sheet, footer.
- [x] **2. Design system** — /lab: buttons, ChapterRail (01/07 + mobile bar), StatCounter (SSR final value, DOM roll-up), Hotspots (+ mobile list), Faq, Tabs (roving tabindex), Marquee, Reveal, SceneThumb.
- [x] **3. 3D foundation** — `SceneHost` (QualityProvider + one fixed canvas, mounted on idle for mid/high only), `<Scene>` (poster first, load within 1 viewport, unload beyond, fade in on ready), frameloop store (renders only while a scene is visible and tab visible), PerformanceMonitor dpr stepping, StoreLight rig + RoomEnvironment + BlobShadow, `useAsset` (Meshopt/Draco). `?tier=low|mid|high` forces a tier.
- [x] **4. Media components** — `Poster` (next/image, LCP-ready), `AlphaVideo` (VP9/HEVC alpha pick, plays only on screen, still for reduced-motion/save-data), `VideoPlane` (alpha clip in 3D), `ScrollSequence` (2D canvas in sticky viewport, ScrollTrigger progress → `--p` + `useSequenceProgress`, progressive ends-first loading, captions, still fallback). Blender pipeline in `scripts/blender` (lib.py rig/materials, encode_alpha.sh, encode_sequence.sh); media registry `src/content/media.ts`.
- [x] **5. Clothing rack** — `ClothingRack` (DOM gestures: rubber-band drag, exactly one hanger per swipe/flick, tap slot hit-test via projected `slotPx`, tap centre = lift, drag spins lifted garment with momentum, arrows/Home/End/Enter/Escape, prev/next/Try-it-on buttons, live region, `touch-action: pan-y`) + `RackScene` (spring rail with overshoot, acceleration-driven swing, neighbour knock, lift + 1.5 s twirl, others slide apart and recede). Garments GLB from `scripts/blender/garments.py` (246 KB Meshopt). Low tier: swatch rack with same controls. Check: `node scripts/checks/rack.mjs`.
- [x] **6. Homepage** — 0 Opening (once per session, head script skips repeat/reduced, CSS no-JS exit), 1–3 `WorldChapter` (diorama → four islands with 4/1/0/6 → one base, copper line, all 5), 4 `StorefrontChapter` (laptop screen builds + re-skins from the rack), 5 `OrderChapter` (ticket drops, 3 locations, routed to Riverside 2.4 km, hotspots), 6 `PackChapter` (B-14 lights, scan, label, conveyor), 7 `DeliveryChapter` (72-frame film captured from `scenes/delivery`, ETA chip), 8 `InStoreChapter` (horizontal POS / endless aisle / self-checkout), 9 `ProofChapter` (Demaze 45+/35+/6 counters + four process rooms), 10 `CloseChapter` (shutter, wordmark, DemoForm → /api/demo). Shared kit `src/three/kit.tsx`, procedural textures, `StageBus` + `SceneLabels` (3D-anchored DOM labels), `ScrollStage` pinned chapters. Posters captured from live scenes (`scripts/posters.mjs`).
- [x] **7. Solution template + 12 pages** — `SolutionPage` (server) = `SolutionHero` (live scene + `InteractionControl`: slider/drag, toggles bitmask, pick, or the rack) → `ProblemFix` (pinned scrub, MDX body = problem narrative, fix steps) → `Inside` (anatomy pins projected from 3D + capability tabs moving the camera, sticky scene) → works-with poster cards → FAQ + CTA. Content: `src/content/solutions/*.mdx` + registry. Scenes: shared `useRig` (views, anchors, part highlight, modes live/scrub/inside, full-bleed framing); new showcase, b2b, quick, market, oms, tms, client; laptop/packing/pos/aisle/kiosk upgraded and reused. Hero posters `sol-<slug>` via `scripts/posters.mjs --solutions`. Check: `node scripts/checks/solution.mjs <slug> <out> [widths]`.
- [x] **8. Company/legal/SEO** — About: numbered principles reveal + Demaze/Decignal/Decommerce rooms (`AboutExtras`); Contact: `DemoForm` → `/api/demo`; Security + Infrastructure: `ExplodedStack` (CSS 3D slabs/rack units part with each h2, no WebGL, no invented figures); `/llms.txt` route, `sitemap.ts` (22 URLs), `robots.ts` (disallows /lab, /capture, /api), Organization JSON-LD, `opengraph-image.png`/`twitter-image.png` captured from `/capture/og` (`node scripts/og.mjs`), canonical URLs.
- [x] **9. Hardening** — three.js, GPU detection and the canvas load only when a scene asks (phones: after first scroll/touch), `StageBus` three-free, Motion removed (CSS header), GSAP/Lenis lazy, mono font not preloaded, mobile hero poster not prioritised, hidden menu links no longer prefetched. Lighthouse mobile (prod): home 91, POS/Storefront/OMS 95, About 97; a11y/BP/SEO 100. axe WCAG 2.1 AA: 0 violations on 22 routes × 2 widths. Overflow: 0 on 22 routes × 4 widths. Vercel Web Analytics (Vercel builds only). CREDITS.md, LAUNCH.md, README.md.

## Notes / decisions

- Bundled Next docs (`node_modules/next/dist/docs`) are blocked by the user's `Read(**/dist/**)` deny rule; APIs verified by building.
- Browser pane is hidden during loops, so rAF is paused there: Motion/GSAP animations don't advance in screenshots. Verify animated end-states via code paths or reduced-motion.
- Placeholder content needing owner review: Security page claims (TLS, RBAC, 2FA, audit log), legal pages (marked draft), brand `siteUrl` and `demoEmail` in `src/content/site.ts`.

- drei `View` outside a Canvas ignores `track` and tracks its own div: give `<View className="absolute inset-0">`.
- Headless verification: `node scripts/shot.mjs <path> --widths 390,1440 [--scroll "#id"] [--eval expr]` (Playwright). The browser pane is usually hidden, so WebGL is checked this way. Headless auto-detects tier low; use `?tier=high` to see 3D.
- detect-gpu benchmarks load from unpkg (couldn't copy them locally: the `dist` read-deny rule blocks it); 2.5 s timeout falls back to a hardware heuristic.

- Blender 5.2 at /Applications/Blender.app (EEVEE only engine id `BLENDER_EEVEE`). Run `Blender -b -P scripts/blender/<scene>.py -- --out <dir>`. ffmpeg has libvpx-vp9 + hevc_videotoolbox (alpha). HEVC-alpha playback in Safari not verified (no Safari in headless).
- Phone sequences must be rendered as their own portrait frames (≈720×1280); half-size landscape frames cover-cropped on a 390 px portrait screen look soft.
- Character clips are placeholders (Blender mannequin). Real AI clips (Higgsfield/Canva) need the owner's credits and commercial-use check.

- Meshopt quantization moves mesh scale/offset onto the node: always render GLB meshes with their node transform (or clone the node). Multi-material nodes are groups (clone them).
- `<Scene>` adds `relative` to its root; size it with `size-full`/aspect classes, not `absolute inset-0`.
- Rack garments are stylised placeholders (flattened tubes); replace with cloth-simulated or CC-licensed garments keeping node names `garment_<theme>` + `hanger`.

- Store-world props are procedural (kit.tsx) instead of Blender GLBs: one material library, no downloads, posters/frames captured from the same scenes. Real Blender assets can replace kit parts later.
- `position: sticky` makes a stacking context: pinned stages are `z-40` (above the z-30 canvas); never give a Scene container inside a stage an opaque background (use `fallback`).
- ScrollTrigger is refreshed on every page-height change (SmoothScroll ResizeObserver); stages mounting late otherwise break all later triggers.
- Single-column CSS grids need `grid-cols-1` (minmax(0,1fr)) or min-content blows the phone layout out (caught by `scripts/checks/overflow.mjs`).
- `/capture?scene=&p=` renders any scene full-screen with exact progress (dev tool for posters and sequences; noindex).
- Demo form posts to `/api/demo`, which forwards to `DEMO_WEBHOOK_URL` if set (destination is an open decision), else logs.

- Module availability per solution is an open decision; copy describes capabilities plainly with no availability badges. Confirm each module (or mark "coming soon") before launch.
- `StageBus.fullBleed` (set only by ScrollStage) gates the copy-card camera shift and pull-back, so boxed scenes (homepage in-store panels) frame normally.

- `cacheComponents` rejects route segment config (`export const dynamic`); route handlers without dynamic APIs are static already.
- `brand.siteUrl` (decommerce.example) feeds sitemap, robots, canonical and OG URLs: set the real domain before launch.

- LCP is 2.6–3.4 s under Lighthouse's simulated slow 4G (budget 2.5 s); TBT and CLS are within budget. Initial JS is ~150 KB gz before route prefetches.
- Unused by design: post-processing (bloom/DOF) and react-spring were dropped for the performance budget.

## Iteration log

1. Phase 1 complete. lint ✓ typecheck ✓ build ✓ (25 static pages). Checked 1440 / 375: no horizontal overflow.
2. Phases 2–3 complete. lint ✓ typecheck ✓ build ✓. Headless: two placeholder scenes render in one canvas at 1440/390; `?tier=low` mounts no canvas; overflowX 0.
3. Phase 4 complete. Headless: sequence `--p` tracks scroll (0.2/0.55/0.9), WebM alpha clip plays on screen, lint/typecheck/build ✓.
4. Phase 5 complete. Rack check at 1440/390: swipe → index+1, tap → lifted, Esc + → → index+1 & put back, no console errors. lint/typecheck/build ✓.
5. Phase 6 complete. Headless 1440/390: all chapters render, low tier = posters + 2D sequence canvas only, reduced motion = stacked layout without canvas, no horizontal overflow, no console errors. lint/typecheck/build ✓.
6. Phase 7 complete. All 12 solution pages load with no console errors at 1440, POS checked at 390, no horizontal overflow on all solution routes. lint/typecheck/build ✓.
7. Phase 8 complete. llms.txt/robots/sitemap (22) served, company pages render without errors, no overflow on company/legal routes at 360/390/1440. lint/typecheck/build ✓.
8. Phase 9 complete. All phases done; build passes. Loop stopped. Remaining items need people: see LAUNCH.md.

## Photoreal pass (started 23 Oct 2026, after the 9 phases)

Direction agreed with the owner: hyper-real look from AI footage, scrubbed frame by frame; real-time 3D kept only for interactive parts.

- Done: Vertex AI Veo tooling (`scripts/vertex/veo.mjs`, cap via `VERTEX_CAP_USD`, default $100, ledger `assets-src/vertex/ledger.json`), project `silicon-alchemy-476503-i4`, region `us-central1`, auth = local ADC (`gcloud auth application-default login`). Owner's three reference renders in `assets-src/refs/` (counter, packing, diorama).
- Done: homepage hero = Veo 3.1 Fast push-in from `ref-diorama-169.png` → 48 frames (`scripts/frames-from-video.sh`), `HeroFilm` with deferred frame streaming, phone 4:3 band on backdrop `#d0c7c2`. Lighthouse home 90, axe clean. Spent $3.52.
- Learned: Veo letterboxes a start image whose aspect differs from the output (pad/outpaint the start image to 16:9 or 9:16 first). Veo grain is real detail; denoise/AVIF don't shrink frames much, so budget by frame count.
- Next: chapters 2–3 photoreal (islands + unified stills, then Veo first/last-frame transitions); counter (POS) and pick-and-pack from the other two renders; character loops (cashier, picker, shopper) from reference stills + local background removal; then solution heroes.
- Open: private GitHub repo not created yet (owner to decide); cloud session would need a service-account key for Vertex and loses Blender/Mac encoders.

## Revision after owner review (24 Oct 2026)

- Done: homepage v3 (full-bleed real places, locked cameras, Motionary-style rack, continuity fixes), committed b004803.
- Done: 12 solution pages and 9 company/legal pages rebuilt full-bleed (DESIGN-PLAN §10.1). Brand showcase is now styled looks on dress forms.
- Checks: lint, typecheck, build ✓; axe no WCAG A/AA violations (22 routes, 1440 + 390); no horizontal overflow (360/390/768/1440); every pinned step fits on phones; Lighthouse mobile / 94, /pos 96, /about-us 95 (a11y, best practices, SEO 100).
- Vertex spend to date: $53.34 of the $100 cap (ledger).

## Design upgrade (24 Oct 2026)

- Done: design system pass (type scale `t-hero/t-h2/t-h3/t-lead/t-step`, paper surface, radius/shadow/z tokens, copper-rule eyebrows, pill buttons with sliding arrow); floating header that tucks away on scroll down, active-section dot, card mega-menu, full-screen phone sheet; footer rebuilt (closing CTA except on / and /contact-us, two-column phone links, large wordmark).
- Done: legibility wash (`.scrim`, the scene's floor colour) behind every full-bleed text column; anatomy and capabilities on solution pages moved to compact framed sections; pinned scroll lengths cut ~20–25 %.
- Done: motion: staggered line entrances in pinned steps, CSS scroll-driven word and media reveals (no JS; static where unsupported or reduced motion), fade between routes (not on first load), Lenis glide for in-page links.
- Done: sharpness: every scroll film re-extracted from the 1080p sources at 1920 px desktop / 864 px phone, q58 (`scripts/v3/hd-frames.sh`; was 1280–1600 / 720); canvas resampling set to high; next/image serves AVIF at q85 for full-bleed photos.
- Checks: lint, typecheck, build ✓; axe clean; no horizontal overflow; all pinned steps fit; Lighthouse mobile / 91, /pos 94, /storefront 94, /oms 93, /about-us 96 (a11y, best practices, SEO 100). Perf is 1–3 points lower than before because the sharper first frame is ~24 KB heavier on phones.

## Story, service and consistency pass (24 Oct 2026)

- Films re-shot on Veo 3.1 (standard) from the same start stills with pinned end frames (`scripts/v3/reshoot.mjs`): delivery (parcel handed to the resident at her door, courier returns to the van; was: courier walked into the house), homepage counter (customer taps and keeps her card), POS (knit placed in the bag by hand; was: it flew in), B2B (worker pulls the pallet out of frame), pack (scanner aimed at the box label). Problem chapter copy now says the last size M, matching the full shelf. Vertex spend $61.87 of $100.
- Service content: homepage now explains what Decommerce is (platform, setup, running), the problem in full (six-row comparison), a 12-module index with photo previews, the four-step engagement with what the client has after each step, and an FAQ. A floating ORD-1042 tracker follows the order through the order, pack and delivery films (desktop).
- Solution pages: numbered sections on one studio surface: problem and fix, anatomy, capabilities, how we set it up (rollout steps + what is included), works with, questions.
- Company pages: About (principles, Demaze numbers, family with new photoreal images, engagement), Contact (what to include, what happens next, FAQ), Partners (how partnering works), glossary in two columns, a related-pages strip on every company page.
- Nav: numbered groups and an editorial index panel with a photo preview of the hovered page. Footer: brand promise, numbered groups matching the nav, back to top.
- One `Section` shell (index, label, revealed headline, lead) for every static section. The eyebrow dash was replaced by a copper dot or the section number; no em or en dashes anywhere in site text.
- To confirm with the owner: the service descriptions (migration, connections, training, support after launch, data ownership and export) are written as a sensible default for an implementation partner, not taken from a contract.
- Checks: lint, typecheck, build ✓; axe clean; no horizontal overflow; all pinned steps fit; Lighthouse mobile / 92, /pos 93, /storefront 92, /about-us 96, /contact-us 93 (a11y, best practices, SEO 100).

## Legibility and decoration pass (24 Oct 2026)

- Pinned text: column 38 % (max 540 px), a stronger floor-colour wash that covers the whole column, smaller step headlines (`t-step-h`), and a compact mode for short desktop windows (max-height 780 px). Checked at 1000x640, the owner's Chrome size.
- Palette: the grey studio surface became warm travertine (#e8dfd3) with linen panels (#f6f1ea); dark sections use espresso (#1c1712).
- Every "how it works" sequence (engagement, solution rollout, contact next steps, partner flow) now uses one dark band over a darkened store photograph (`StepsBand`), with a copper line that draws on scroll.
- Visuals: photos on the three service pillars, an animated sync diagram (one stock count feeding four channels), a sticky photo beside the homepage FAQ, and an automatic sidebar on company and legal pages (contents list that tracks the heading being read, plus a framed room photo with a demo prompt). The order tracker moved to the bottom right, clear of the text.
- Checks: lint, typecheck, build ✓; axe clean; no horizontal overflow; all pinned steps fit at 390x844, 375x667, 1000x640, 1280x720, 1440x900; Lighthouse mobile / 93, /pos 93, /about-us 97, /contact-us 97.

## Section redesign pass (26 Oct 2026)

- "What we do" is a split section: the intro stays pinned on the left; on the right a dark card with the animated sync diagram, then the platform, setup and running as photo cards that stack over each other on scroll.
- "The problem in full" is a switchable board (Separate systems / With Decommerce): six cards with small illustrative figures (the ORD-1042 numbers: 18 km vs 2.4 km, counts 0/4/0/6 vs 0/0/0/0); the board turns espresso when switched and switches once by itself when first in view.
- Every Section header now draws a copper rule on scroll and carries its number large in outline; framed anatomy and capabilities headers use the same rule (`SectionLabel`). A moving ribbon of the platform's promise and modules sits under the hero. The closing demo form uses the split Section (06).
- Solution "before and after" now shows the film's opening frame as Before and the finished scene as After.
- Checks: lint, typecheck, build ✓; axe clean; no horizontal overflow; pinned steps fit; Lighthouse mobile / 91, /pos 91, /about-us 96.

## Fix pass after owner review (26 Oct 2026)

- Bug: scroll-driven fades (`.rv`, `.rv-media`) on sticky elements froze half-transparent, so the "What we do" cards looked washed out and showed through each other. Removed every scroll animation from sticky elements (split Section header, FAQ photo, company sidebar) and dropped the stacking-card layout.
- "What we do" rebuilt: a solid full-width dark panel (the idea in three numbered steps beside the animated sync diagram), then three equal photo cards. Scroll fades now finish within the first 40 % of entry.
- Palette brighter and warmer: travertine #f2eadf, linen #fbf7f1, copper #a8481a (AA as text) with #c8693a for fills, lines and dots; primary buttons are copper; outline section numbers have a copper stroke.
- Checks: lint, typecheck, build ✓; axe clean; no horizontal overflow; pinned steps fit at 390x844, 375x667, 1000x570, 1440x900; Lighthouse mobile / 93, /pos 92, /about-us 96.

## Reference-led upgrades (26 Oct 2026)

Owner shared four Dribbble references (Geex Arts product reel, Bonsai Works identity, Nickelfox health dashboard, Raihan AI platform). Taken, within the stone and copper rules (none of their purple or blue gradients):
- Floating product cards over the hero film (dashboard reference): ORD-1042 being routed with progress bars that fill, a dark stock card with a chart line that draws itself, a sync pill. They arrive in turn, bob, drift at different depths on scroll and leave before the second hero step. Wide screens only, labelled Example.
- Kinetic statement after the problem board (product reel): each word comes into focus as the section scrolls; key phrases in copper.
- Module index: an example screen of each module floats over its photo and swaps with it (dashboard + AI platform references).
- Footer wordmark draws in as an outline, then fills (identity reference).
- Checks: lint, typecheck, build ✓; axe clean; no horizontal overflow; pinned steps fit; Lighthouse mobile / 92, /pos 91.

## Concept rebuild: "the store after hours, run by one system" (26 Oct 2026, branch redesign/night-system)

Owner asked for a complete rehaul, not tweaks. New concept:
- Night site: espresso floor (#12100d), warm light text, copper (#e8915a) as the lit accent; product screens and photo scenes are daylight panels (`.tone-light`). Geist Mono for system labels (order ids, figures, section labels).
- Every page opens with `HeroWindow`: a giant headline over the night floor and a rounded window onto the store film that widens to full screen as it scrubs; then product cards float over the film (homepage: order, stock, sync; solution pages: the module's example screen and its steps ticking off). Company and legal pages open with `PageHero` (headline + the room in a wide window).
- Homepage: hero, ribbon, 01 what we do (live bento of six animated example screens: orders, stock across channels, route with a moving van, till tap, customer record, channel sync; then platform/setup/running), 02 the problem as a pinned motion graphic (four systems' counts 4/0/0/6 converge into one copper stock count) plus the switchable cost board, 03 ORD-1042 journey (pinned horizontal scroll through five film frames, each with its product screen), the rack, the kinetic statement, 04 modules, 05 how we work, 06 Demaze numbers (count up), 07 questions, 08 demo and the dusk film.
- Removed the old full-screen story chapters (problem/order/pack/delivery/counter/proof films with left-column text) and their components.
- Gotcha: `collapse` is a Tailwind utility (visibility: collapse); the problem section uses the class `converge`.
- Gotcha: the shared dev server on :3000 served a stale stylesheet for hours; verify styling against `next build` + `next start`.
- Checks: lint, typecheck, build ✓; axe clean; no horizontal overflow; pinned steps fit; Lighthouse mobile / 89, /pos 92, /about-us 96.

## Smoothness and the scrolling rail (26 Oct 2026, branch redesign/night-system)

- Hero stutter fixed: the window reveal no longer animates clip-path (a full-screen repaint every frame). The headline block is the window's top edge; it, the bottom and side edges and four corner pieces slide out with transforms only, all positioned in CSS (no measuring, CLS 0). The film canvas is capped at the footage's own resolution (no per-frame software upscaling to 2880 px), and ScrollSequence no longer writes a CSS variable on the section every frame.
- The clothing rail is scroll-driven on tablet and desktop: the section pins for 280svh and the scroll sets the spring's target, so hangers swing as the rail moves; drag and arrow keys still work. Its animation loop now runs only while on screen.
- Measured (headless Chrome, 1440x900 at 2x, wheel scrolling): hero, rail and journey all median 16.7 ms per frame, no frames over 25 ms. Lighthouse mobile / 91, /pos 93, /about-us 96, CLS 0.

## Cloudflare Workers deploy fix (26 Oct 2026)

- The owner's Cloudflare Worker (decommerce.singhaarav059.workers.dev) returned Error 1101 on every page. Reproduced locally with @opennextjs/cloudflare 1.20.13 + wrangler 4 in a scratch worktree: Next printed "Cache Components ... setTimeout()" and every request hung until the runtime cancelled it.
- Cause: `cacheComponents` and `partialPrefetching` in next.config.ts (from the Phase 1 scaffold, never used: no `use cache`, `cacheLife` or Suspense boundaries). Removed both. `/llms.txt` marked `force-static` so it stays a static file.
- Verified in the local Workers runtime: /, /pos, /about-us, /contact-us, /sitemap.xml, /llms.txt, frame assets and /_next/image all 200; POST /api/demo returns ok. Vercel build unchanged (all pages static).

## Light theme (26 Oct 2026)

- Owner asked for the whole site in a light theme. The concept, layout and motion stay; the root tokens are the light palette again (travertine #f2eadf, linen #fbf7f1, ink #1b1915, copper #a8481a).
- Pieces built for the dark floor were reworked: light footer (beige, ink-2 muted text, deeper copper #8a3912 for AA), step bands over a pale wash of their photo instead of a dark one, the converge card in copper with linen text, the cost board turns copper when switched, two live screens (till, sync) kept as dark cards for contrast, hairline rings flipped.
- Checks: lint, typecheck, build ✓; axe clean; no horizontal overflow; pinned steps fit; Lighthouse mobile / 91, /pos 92, /about-us 96 (a11y, best practices, SEO 100).

## Fynd-style light (26 Oct 2026)

- The owner's manager asked for a light theme "like fynd.com". Studied fynd.com: white and very soft grey sections, near-black text, black pill buttons, light-weight headings, small pill labels.
- Applied within our palette: white pages (#ffffff) alternating with soft stone grey (#f5f4f1), ink #121110, muted #57524b, copper #a8481a kept as the only accent; black pill primary buttons (copper on hover); section labels are rounded pills; headings at weight 450; photo-band washes and framed sections follow the white/grey rhythm.
- Checks: lint, typecheck, build ✓; axe clean; no horizontal overflow; pinned steps fit; Lighthouse mobile / 91, /pos 92, /about-us 96 (a11y, best practices, SEO 100).

## Fynd gap pass (26 Oct 2026)

- Compared with fynd.com (homepage, menus, footer, OMS and integrations pages). Added what we can say honestly: a trust strip under the hero with Demaze's own numbers; 05 who it's for (growing brands, multi-channel retailers, large retailers and wholesalers); 06 integrations (connect, sync, migrate, consolidate beside an animated hub of system kinds) and a new /integrations page (in the Company menu, footer, sitemap, llms.txt); 07 how it compares (website builder + plugins vs separate systems vs Decommerce, qualitative); ask-AI buttons (ChatGPT, Claude, Perplexity) under the homepage, solution and integrations FAQs.
- Solution pages: "What's included" with six features per module and the kinds of systems it connects to (replaces the three capability tabs), and a closing demo form (07).
- Items that need real input from Demaze are listed in LAUNCH.md (logos, case studies, figures, ratings, certifications, pricing, AI tools, PIM, named connectors, resources).
- Checks: lint, typecheck, build ✓ (34 pages); axe clean; no horizontal overflow; pinned steps fit; Lighthouse mobile / 91, /pos 92, /integrations 91 (a11y, best practices, SEO 100).

## Blended text and image techniques (26 Oct 2026)

From the owner's references (Visumind skincare, Aristide Benoist, Kombai Selects: travel, canyon, Sixfold dock, ThisUX, Proply, yacht, motion navbar):
- Giant "online." between the boutique wall and the clothing rail, so the cut-out garments swing in front of the letters (yacht technique).
- Photos dissolve into the page: company/legal heroes fade out at the foot; a turning "scroll" badge sits on the seam (hero window: on the seam under the headline; company pages: on the fade).
- Small photos inside headlines (`InlinePhotos`, `Headline media`, `HeroWindow media`): the hero ("One system [photo] behind every sale"), modules and who-it's-for headlines; in revealed headlines they pop in with the words.
- Phone menu: the menu button morphs into a compact card of links over a dimmed backdrop instead of a full-screen sheet.
- Lens page transitions (`LensTransition`): an internal link click grows an ink circle from the click point, the next page loads under it, the lens closes into the centre. Skipped for reduced motion, modified clicks, new tabs, hash links and the current page; a 6 s safety reveal.
- 3D module ring: the 12 module photos on a CSS 3D ring that turns with the list scroll and swings the short way to a hovered module, with its example screen under the front card (no WebGL).
- Floating tags on journey panels (step results) and works-with photos.
- Not taken: pastel and lime palettes, serif italic headlines (DESIGN-PLAN: one sans family, no italics), WebGPU.
- Checks: lint, typecheck, build ✓; axe clean; no horizontal overflow; pinned steps fit; scroll 60 fps (hero, rail, journey); Lighthouse mobile / 91, /pos 91, /about-us 95 (a11y, best practices, SEO 100).

## Hang-tag redesign (26 Oct 2026)

The owner rejected the module ring and asked for a real redesign, not patches. Run through the design-taste skill (direction "One motif", seed 1024702630):
- Idea: the hang tag on ORD-1042's linen overshirt (a rectangle with its top-left corner clipped and a punched eyelet) is the one shape of the site. `.tag` in globals.css masks every photograph (hero window, module groups, journey, pillars, audiences, page heroes), shapes every button and filled tile, and is the list bullet. One 4px radius otherwise; nothing has a shadow at rest.
- Removed site-wide: section labels and pills, 01/02 numbering and outline numerals, copper rules, hairline dividers, mono captions, uppercase labels, the scroll badge, the marquee ribbon, pinging dots, emoji ticks, tinted gradient washes.
- Rebuilt: modules as three large tag photographs (Online, Supply chain, In-store) that crossfade to the module you point at and drift slowly on their own; the costs board as a six-row ledger that turns copper when switched; the problem scene as four disagreeing tags merging into one copper tag; how we work as a row of tinted panels (dark to light) that open on click; who it's for as one square plate with three text tabs; FAQs as filled tag tiles (open tile turns copper); compare table with a copper Decommerce column; footer as a copper band cut like a giant tag with one word ("Book.") as the link, then the wordmark built large.
- Headlines now carry their text as aria-label (no hidden duplicate), so line counts are measured honestly.
- Checks: skill lint 0 fail / 0 warn; skill inspector 0 fail (warnings defended: brand stone #f5f4f1, frame-sequence films instead of video, hero window opening under the headline, journey track, comparison table scroll on phones); lint, typecheck, build ✓; axe clean; no horizontal overflow; pinned steps fit; Lighthouse mobile / 92, /oms 91, /about-us 96 (a11y, best practices, SEO 100).

## Animated visuals, Indian cast, white and sage (26 Oct 2026)

- The owner rejected the photographic look, then clay characters, then the brown palette and the "folding a shirt" hero. Final direction, approved step by step: polished 3D animated-feature visuals, a locked cast of four glamorous, fair North Indian characters (Meera, associate; Ananya, customer; Arjun, warehouse; Rohan, courier; `assets-src/style3/CAST.png`), and a white and sage palette with one forest-green accent (CLAUDE.md design rule updated).
- Hero: the flagship cut open like a dollhouse (shop floor, stockroom, website studio, electric van at the kerb), every part threaded to one glowing hang tag; locked-off film where the sale, the pick and the hand-off happen and light pulses into the tag. Headline and the live tag (pick a size, sell one, every channel drops together) sit on the plain wall; phones and tablets put them on a solid band. Floating product cards removed from the hero. Logo click on the homepage glides back to the hero.
- All 56 source stills re-rendered against the cast and hero (`scripts/v6/restyle.mjs`, scene fixes for the rail wall, security, delivery van, counter, and two close-ups), 20 films on Veo 3.1 quality (`scripts/v6/films.mjs`, gated on still review; dusk closing scene redone), built with `scripts/v6/build.mjs`. Rail garments recoloured to ivory, sage, forest, grey, navy and stone. Phone text-panel floors now lean cool white (`scripts/v3/floor.py`).
- Site tokens: copper renamed to `--accent` (forest green #2d6a4f, bright sage #5c9a78), cool sage-white sections, cooler inks; steps panels, integrations stage and night tone recoloured.
- Spend: Vertex ledger at about $132 of the owner's Google Cloud credit (scripts' cap raised to $200 with the owner's go-ahead).
- Checks: lint, typecheck, build ✓; skill lint 0/0; inspector 0 fail; axe clean; no horizontal overflow; pinned steps fit; Lighthouse mobile / 93, /oms 92, /about-us 91 (a11y, best practices, SEO 100).

## Hero as a sharp still with drawn life; fuller service opening (26 Oct 2026)

- The owner found the hero film's small characters "melted" and its actions inconsistent. The hero is now the 4K cutaway still (`assets-src/style3/HERO-4k2.png`, faces refined, the stray fifth figure removed) drifting very slowly, with the story drawn over it in SVG: pulses run along the painted threads into the tag (thread paths traced in image pixels), and "Sell one" sends a pulse from the counter into the tag and back out to every channel as the counts drop. Phones and tablets get the whole building in its own frame between the words and the live tag. The scroll film is retired from the hero.
- "Not a website. A system we run." now has the team scene (Arjun and Meera walking Ananya through the dashboard) beside it, with Demaze's numbers under it; the separate numbers strip is gone.
- Dev server restarted with its image cache cleared (it was still serving pre-redesign images under the same file names).
- Checks: lint, typecheck, build ✓; skill lint 0/0; inspector 0 fail; axe clean; no horizontal overflow; Lighthouse mobile / 92 (a11y, best practices, SEO 100).

## Sharp keyframe scenes, a new hero, nothing laid over pictures (27 Oct 2026)

The owner found every visual "melted", the hero "very bad", the characters' actions random, cards covering the people, and the person cut out of the solution heroes before the window opens.

- Audit (contact sheets of all 20 films, live pages at 1440 and 390): characters filled a quarter of a 1080p Veo frame, so faces smeared between frames; 8-second multi-step prompts let Veo invent people, garments and camera moves (a second woman materialising behind the storefront monitor, Arjun walking out of the B2B shot, a crowd in quick commerce); frames were saved at webp q58–70 (the hero cutaway was 2752px in 144 KB); every scene kept a blank left wall for text, so the hero window and its panel showed only a desk and a hand; cards sat on faces.
- New method (`scripts/v7`): each scene is two or three keyframe beats from Gemini 3 Pro Image. Beat one is drawn from the cast sheet; later beats edit beat one and change only the action ("every person and object appears once"). Every beat was reviewed on a contact sheet and failures retaken. Subjects sit in the central 60% with calm top and bottom fifths, so any crop keeps them. Served at 2560px, q86 (`build.mjs`).
- ScrollSequence: `blend` holds each keyframe and dissolves into the next, `focus` keeps the subject in any crop, `push` adds a slow push-in, `span` plays the beats once the window is open.
- Home hero, after looking at Fynd, Shopify POS, Square, Toast, Lightspeed, Mercury and Headspace: words and the live tag on the page, one large 4K counter moment beside them with nothing over it (Meera scans the tag on the overshirt Ananya laid down). "Sell one" moves the picture to the hand-over keyframe while every channel's count drops; "Restock" returns it. The cutaway, its SVG threads and the scrim fade are gone; the tag card is light.
- Solution heroes: the pitch sits beside the headline, the scene starts lowered so the person is centred in the window before it unfolds (`--drop`, set in CSS so it is right on first paint), and the floating cards became a steps rail in the window's bottom edge. Storefront, self-checkout, POS, clienteling, endless aisle, marketplace, OMS, WMS, TMS, quick commerce, B2B and brand showcase all re-shot as beats.
- Cards moved off pictures everywhere: journey step screens and tags (now under each picture, with five new journey stills), features "Connects to", "works with" labels, the menu preview caption. Anatomy, module and audience crops follow each scene's focus.
- Removed: the six unused homepage films (576 frames, ~56 MB), the floating hero cards component and its screens content. Social card uses the new hero.
- The dusk close is two keyframes (Meera closes the laptop, then locks up) with the words straight on the shop's wall in ink (7:1 average, 4.9:1 worst), no gradient wash.
- Cast references are now single-character portraits (`assets-src/style3/cast-<name>.png`); the four-person sheet kept pulling extra people into one-person scenes. Retaken after review: storefront 2 (sheet left on desk), marketplace 2–3 (two Arjuns), POS 2 (knit duplicated), clienteling 2–3 (tablet and sweater duplicated), endless aisle (skin drifted darker; tablet changed hands), brand showcase and the journey counter (extra people). Rejected takes stay local (`*-tN.png`, git-ignored).
- The home hero's second keyframe loads when the page is idle (home Lighthouse 89 → 94).
- Spend: 63 images today, $8.65 (Vertex ledger $141.43 of the $200 cap); 4K image pricing fixed in the ledger script ($0.24, not $0.134). Media for the 12 solution pages went from 109 MB to 15 MB.
- Checks: lint, typecheck, build ✓; axe: no WCAG A/AA violations on any route (1440 and 390); no horizontal overflow; Lighthouse mobile / 94, /storefront 92, /pos 94, /oms 90, /about-us 92 (a11y, best practices, SEO 100; CLS 0).
- For the owner to review: the new home hero (a single counter moment instead of the cutaway) and the move from scrubbed films to dissolving keyframes.

## Company scenes re-shot; video pilot (27 Oct 2026)

- The six company scenes (about us, contact, security, infrastructure, partners, office) re-shot as reviewed keyframes with single-character references: centred, large faces, one clear action each (plan review, a demo on the retailer's own shirts, badge-in with the green light, the rack check, a partner handshake, reading the glossary). The washed-out left wall that faded into the page is gone; page heroes, side panels, step panels, the integrations stage, menu previews and the footer team photo now crop from the middle. Office retaken once (Meera sat at the far right).
- Video pilot after the owner asked for motion back: Veo 3.1 animates only between two approved keyframes (first and last frame pinned), one short action per clip (`scripts/v7/motion.json` → `motion.mjs`). Frame-by-frame review found: storefront typing clip clean; the stand-up clip walked Meera through the desk (end pose unreachable), fixed by re-shooting the end keyframe behind the desk and re-animating (clean); POS clips dropped the knit to the floor and vanished it into the bag. Lesson: keyframes must be physically reachable and one small action apart.

## Every scene animated with keyframe-pinned video (27 Oct 2026)

The owner asked for video back and raised the Vertex cap to $230 for it.
- Every solution page, the closing dusk scene, the home hero and the six company scenes now move: Veo 3.1 animates only between two approved keyframes, one short action per clip. Solution pages and the close play the frames while scrolling and hold on each sharp keyframe (ScrollSequence `keys`); the home hero plays the sale film when "Sell one" is pressed (keyframes stay underneath; reduced motion cross-fades); company pages play their film once as the window comes into view and rest on its last frame (HeroFilm).
- Before/after switches that no real action explains (tickets to a clean counter, a paper order book to a portal, a slow till to tap to pay, the empty cubby to the network search, scattered swatches to a dressed form, a tangled map to a route) dissolve instead of being invented by the model.
- Every clip was reviewed frame by frame (tight samples where objects change hands). Rejected and fixed: storefront stand-up (walked through the desk; end pose re-shot behind it), POS hand-over twice (knit fell and reappeared, then a second knit; then a second bag), self-checkout (a second scarf hidden in its keyframe 2, keyframe re-shot), endless aisle step one (a bag from nowhere, tablet changed hands), brand showcase (Meera passed through the dress form; end pose re-shot on her side), security (door swung wide and back; then a safety-filter refusal, not billed), home hero twice (the shirt morphed into a bag; then a second bag) — fixed by putting the empty bag in the start keyframe and splitting the sale into two clips around a middle keyframe. Company about-us end pose re-shot (smeared).
- Lesson recorded: keyframes must be physically reachable from each other, every object in a clip must already exist in its first frame, and one action per clip.
- Spend: Vertex ledger $191.29 of the $230 cap.
- Checks: lint, typecheck, build ✓; axe no WCAG A/AA violations (all routes, 1440 and 390); no horizontal overflow; Lighthouse mobile / 94, /storefront 93, /pos 94, /oms 93, /about-us 96 (a11y, best practices, SEO 100; CLS 0).

## Design pass: no dots, no repeats, drawn motion in the empty places (27 Oct 2026)

Owner review: white dots on faces, plain empty halves (FAQ, demo form), the same pictures repeating within a page, a head cut off before the hero window opens, and a request for more motion, decoration and variety without making the site heavier.
- The hang-tag eyelet is gone from the tag shape and the hero window corner (it painted a white dot on whatever sat in a picture's corner).
- Solution heroes open on the top of the picture (`--drop` is the headline block's height, less 3vh), so faces are in the window before it unfolds.
- New drawn motion graphics instead of repeated photos: `ChannelSync` (four channels with their own counts, drifting, then joined to one tag; illustrative numbers, labelled) replaces the before/after photos and the company side panel's photo; `StepGraphic` (connect, build, go live, run, message, reply) fills every steps band's open panel instead of a photo; `AskPreview` types the exact question the AI buttons send beside each FAQ (solution pages, integrations, homepage); `NextSteps` draws what happens after the demo form (solution pages, homepage).
- Homepage: the hero plays the first sale by itself once its film has loaded (counts drop with it; a visitor's click or reduced motion skips it); audiences use each module's middle keyframe instead of repeating the module end pictures; the FAQ photo (a repeat) gave way to the ask preview.
- About us: "You are here" moved off the picture; the Decommerce family card uses the new counter scene instead of the old cutaway.
- Page changes rise and uncover from the bottom (reduced motion: fade), leaving no styles behind.
- Checks: lint, typecheck, build ✓; axe no WCAG A/AA violations (all routes, 1440 and 390); no horizontal overflow; Lighthouse mobile / 94, /storefront 94, /pos 94, /oms 93, /about-us 96 (a11y, best practices, SEO 100; CLS 0).
- Not changed: the anatomy section still uses the scene's end keyframe (also the hero film's last frame), since its spotlight points are set on that picture; the homepage keeps all its sections.

## Faces and physics audit (27 Oct 2026)

The owner found a mid-motion frame of the dusk close where Meera's face was not hers (distorted, darker), and a close-up with a shirt floating in mid-air.
- New test: `scripts/v7/faceaudit.py` samples every clip, finds faces with the macOS Vision detector (`facedetect.swift`), crops each one large next to the clip's keyframe face and scores skin-tone drift. Earlier reviews looked at whole frames too small to judge faces.
- Results across 26 clips: identity drift in the close (fixed: regenerated with Meera facing the camera, face holds throughout); faces falling into shade and reading darker in marketplace, self-checkout, TMS and quick commerce. Regenerated with "faces stay evenly lit from the front, same fair skin, light does not change" in every prompt: TMS and marketplace step one improved; marketplace step two and quick commerce step one stayed dark across takes (he leans toward a desk or shelf with the window behind), so those two steps dissolve between their keyframes instead.
- The 12 solution close-ups (features panels, homepage service cards) were the previous generation: blank-wall compositions, a floating shirt (WMS), an extra-people crowd (brand showcase). All re-shot from each scene's final keyframe as square close-ups under a gravity rule (every object on a surface or in a gripping hand), each reviewed at full size; crops now centred.
- Spend: Vertex ledger $206.49 of the $230 cap.
- Checks: lint, typecheck, build ✓; axe no WCAG A/AA violations; no horizontal overflow; Lighthouse mobile / 93, /storefront 93, /wms 94, /about-us 96 (a11y, best practices, SEO 100; CLS 0).
