# Build progress

Source plan: [PLAN.md](PLAN.md). One loop iteration = one chunk; update this file at the end of each.

## Phases

- [x] **1. Scaffold** — Next 16.4.3 (Turbopack, cacheComponents), Tailwind 4, tokens.css, Geist + Instrument Serif, Lenis↔GSAP ticker wiring, MDX (`@next/mdx`, `meta` export per file), all 22 routes static, header mega-menu + mobile sheet, footer.
- [ ] **2. Design system** — /lab page: buttons, chapter index rail, stat counter, hotspot, FAQ accordion, marquee, (header/footer done).
- [ ] **3. 3D foundation** — one fixed canvas + drei View portals, GLB loader with poster fallback, detect-gpu tiers, lifecycle (load ahead / unload behind / pause offscreen), placeholder cube.
- [ ] **4. Media components** — AlphaVideo, ScrollSequence, Poster.
- [ ] **5. Clothing rack** — R3F rack with one-hanger drag, spring swing, lift + twirl.
- [ ] **6. Homepage** — chapters 0–10 from storyboard, ORD-1042 thread.
- [ ] **7. Solution template + 12 pages** — seven-block template, MDX per solution.
- [ ] **8. Company/legal/SEO** — contact form, About principles, Security layers, llms.txt, sitemap, robots, OG, schema.org.
- [ ] **9. Hardening** — perf budget, a11y, Lighthouse mobile.

## Notes / decisions

- Bundled Next docs (`node_modules/next/dist/docs`) are blocked by the user's `Read(**/dist/**)` deny rule; APIs verified by building.
- Browser pane is hidden during loops, so rAF is paused there: Motion/GSAP animations don't advance in screenshots. Verify animated end-states via code paths or reduced-motion.
- Placeholder content needing owner review: Security page claims (TLS, RBAC, 2FA, audit log), legal pages (marked draft), brand `siteUrl` and `demoEmail` in `src/content/site.ts`.

## Iteration log

1. Phase 1 complete. lint ✓ typecheck ✓ build ✓ (25 static pages). Checked 1440 / 375: no horizontal overflow.
