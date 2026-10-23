# Build progress

Source plan: [PLAN.md](PLAN.md). One loop iteration = one chunk; update this file at the end of each.

## Phases

- [x] **1. Scaffold** — Next 16.4.3 (Turbopack, cacheComponents), Tailwind 4, tokens.css, Geist + Instrument Serif, Lenis↔GSAP ticker wiring, MDX (`@next/mdx`, `meta` export per file), all 22 routes static, header mega-menu + mobile sheet, footer.
- [x] **2. Design system** — /lab: buttons, ChapterRail (01/07 + mobile bar), StatCounter (SSR final value, DOM roll-up), Hotspots (+ mobile list), Faq, Tabs (roving tabindex), Marquee, Reveal, SceneThumb.
- [x] **3. 3D foundation** — `SceneHost` (QualityProvider + one fixed canvas, mounted on idle for mid/high only), `<Scene>` (poster first, load within 1 viewport, unload beyond, fade in on ready), frameloop store (renders only while a scene is visible and tab visible), PerformanceMonitor dpr stepping, StoreLight rig + RoomEnvironment + BlobShadow, `useAsset` (Meshopt/Draco). `?tier=low|mid|high` forces a tier.
- [x] **4. Media components** — `Poster` (next/image, LCP-ready), `AlphaVideo` (VP9/HEVC alpha pick, plays only on screen, still for reduced-motion/save-data), `VideoPlane` (alpha clip in 3D), `ScrollSequence` (2D canvas in sticky viewport, ScrollTrigger progress → `--p` + `useSequenceProgress`, progressive ends-first loading, captions, still fallback). Blender pipeline in `scripts/blender` (lib.py rig/materials, encode_alpha.sh, encode_sequence.sh); media registry `src/content/media.ts`.
- [ ] **5. Clothing rack** — R3F rack with one-hanger drag, spring swing, lift + twirl.
- [ ] **6. Homepage** — chapters 0–10 from storyboard, ORD-1042 thread.
- [ ] **7. Solution template + 12 pages** — seven-block template, MDX per solution.
- [ ] **8. Company/legal/SEO** — contact form, About principles, Security layers, llms.txt, sitemap, robots, OG, schema.org.
- [ ] **9. Hardening** — perf budget, a11y, Lighthouse mobile.

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

## Iteration log

1. Phase 1 complete. lint ✓ typecheck ✓ build ✓ (25 static pages). Checked 1440 / 375: no horizontal overflow.
2. Phases 2–3 complete. lint ✓ typecheck ✓ build ✓. Headless: two placeholder scenes render in one canvas at 1440/390; `?tier=low` mounts no canvas; overflowX 0.
3. Phase 4 complete. Headless: sequence `--p` tracks scroll (0.2/0.55/0.9), WebM alpha clip plays on screen, lint/typecheck/build ✓.
