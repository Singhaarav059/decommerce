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
