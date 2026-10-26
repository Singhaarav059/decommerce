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
