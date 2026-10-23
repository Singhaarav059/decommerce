# Decommerce Website — 3D Interactive Build Plan

Oct 23, 2026 · @Aarav Singh

## Overview

Decommerce gets a 22-page marketing site where every section shows the product working in a live 3D store, instead of describing it. It sits beside [Demaze Technologies](https://www.demazetech.com/) (parent) and [Decignal](https://decignal.com/) (AI applications subsidiary), and covers the same ground as [Fynd](https://www.fynd.com/): storefront, B2B, quick commerce, marketplace, OMS, WMS, TMS, POS and in-store tools.

**The one idea:** a single warm, hyperreal miniature store world (the look of your three reference renders: travertine, terrazzo, copper, brushed steel, olive plants, low sun) that the visitor scrolls through. Each chapter shows a commerce problem happening, then shows Decommerce fixing it inside the same world.

**Success looks like:**

- Feels as premium as Morpho or Maison des Elites, but explains a B2B product as clearly as Decignal.
- Smooth on a mid-range Android phone on 4G, not only on a MacBook.
- Every claim is true for Decommerce. Fynd is the reference for scope, never a source of copy, stats or logos.
- Built end to end by your team through Claude Code, using free tools wherever possible.

## Reference teardown

Each reference earns one or two specific patterns; we borrow the mechanic, never the code, assets or copy.

| Reference | What it does | What Decommerce takes |
| --- | --- | --- |
| [Motionary clothing rack](https://motionary.dev/builds/clothing-rack) | Cloth-simulated garments on a rail; drag moves exactly one hanger, hangers swing and knock, tap lifts one off and twirls it while the rest blur. Built in React Native Skia/WebGPU, sold as a $32 build. | Rebuild the interaction for web in React Three Fiber: cloth baked in Blender, hanger swing as a spring, one-item snap, lift-and-twirl. Used for theme/template browsing on Storefront and Brand Showcase. |
| [Morpho](https://morphowater.com/) | Percent preloader, "Enter site", chapter index (01/07) pinned at the side, one hero object that stays centred while the world changes around it, serif-italic accent words, sound toggle. | Chapter index + progress rail; one hero object (the store diorama) that persists through chapters; italic accent word in each headline. |
| [BLUNT](https://bluntumbrellas.com/) | Product anatomy with hotspot popups (tip, canopy, frame), hover image swap on cards, press-quote marquee. | Hotspot anatomy on every hardware scene (POS terminal, kiosk, packing station); hover swap on product cards. |
| [Maison des Elites](https://mdebeauty.com/) | "Opening 0%" loader with curtain shades parting, numbered principles revealed one by one, ingredient cards with read-more. | Loader where store shutters rise; numbered "Decommerce principles" reveal on the About page. |
| [Second Ride](https://second-ride.de/en/fahrzeuge) | Side view on a floor with labelled parts (battery, seat, drive), counters that roll up from 0, bird's-eye view, testimonial marquee, clean FAQ. | Labelled-part callouts, roll-up stat counters, top-down camera angle for the warehouse and route scenes. |
| [Decignal](https://decignal.com/) | "The story in nine chapters" with a progress bar; every chapter uses one concrete, labelled illustrative example (PO-8842, SO-3318). | Same family DNA: follow one illustrative order (e.g. ORD-1042) through every chapter, clearly labelled "illustrative". |
| [Fynd](https://www.fynd.com/) | Scope and page list: unified commerce across website, marketplaces, stores and supply chain; 3D isometric hero; solution cards by tab. | Page map and product scope only. No stats, customer logos or wording reused. |

Not opened in detail for this plan: the [Magnific 3D e-commerce template](https://www.magnific.com/psd/3d-website-template-ecommerce) and the [Wonder interior theme](https://wonder-theme-interior.myshopify.com/). Treat them as visual mood (soft 3D product staging, interior lighting) until someone reviews them.

## Brand and art direction

The look is "a quiet luxury store at golden hour": warm stone, copper accents, one low sun from the upper left, taken straight from your three renders.

**Palette (starting tokens, tune after first renders)**

| Token | Hex | Use |
| --- | --- | --- |
| stone-50 | #F5F2ED | Page background |
| travertine | #E6DDCF | Surfaces, cards, 3D floor |
| terrazzo-chip | #C9B8A0 | Texture flecks, dividers |
| ink | #17150F | Text, primary buttons |
| copper | #C2602A | The only accent: CTAs, active chapter, highlighted data |
| olive | #69714E | Plants, "success" states |
| steel | #9EA4A6 | Fixtures, secondary lines |

**Type:** a display serif with a real italic for headlines (free options: Instrument Serif or Fraunces) plus one clean grotesk for body and UI (Geist or Manrope). Headline pattern: plain words + one italic word, e.g. "One system behind *every sale*."

**Material language:** travertine, terrazzo, brushed steel, copper, unbleached kraft, linen and wool garments, olive trees. Every scene uses the same warm key light and soft contact shadows, so all pages feel like rooms in one building.

**Anti-AI-slop rules (put these in CLAUDE.md):**

- No purple/blue gradients, glass blobs, neon glows or floating 3D emoji icons. Fynd is purple; Decommerce is stone and copper.
- No sparkle icon to mean "AI". Show AI by its result (a photo appears, a catalog fills).
- No generic "feature card grid with icon + 3 lines" more than once per page.
- Real, specific example data in every scene (SKU codes, quantities, times), labelled illustrative.
- One accent colour. One light direction. Motion has weight: ease-out with slight overshoot, nothing linear.
- Characters are people working (cashier, picker, store associate), never posing models staring at camera.

## Tech stack and the hyperreal-but-light approach

Full real-time hyperreal humans in a browser would kill mobile performance, so the site mixes three render layers and uses each only where it wins.

| Layer | What it renders | How | Why |
| --- | --- | --- | --- |
| 1. Real-time 3D | Objects people touch: racks, garments, POS terminal, kiosk, boxes, shelves, the store diorama | React Three Fiber + drei, GLB with Meshopt/Draco, KTX2 textures, lighting baked in Blender | Drag, rotate, tap and hotspots need real 3D |
| 2. Alpha video loops | Hyperreal characters: cashier, picker, rider, associate | AI image-to-video or rendered clips, exported as WebM (VP9 alpha) + HEVC-alpha MOV for Safari, placed on planes inside the 3D scene | Photoreal people at 1-2 MB instead of a 30 MB rigged model |
| 3. Scroll-scrubbed sequences | Big cinematic moments: store assembling, order flying to doorstep | Rendered in Blender, 60-90 AVIF/WebP frames drawn to a canvas, frame = scroll position | Film-quality motion, fully controlled by scroll, cheap on GPU |

&#91;embedded content: asset pipeline · 4 sources, 1 hub, 3 render layers\]

The GPU tier decides which layers a visitor gets; the Low tier never loads WebGL.

**Framework and libraries**

- Next.js (App Router) with static generation, same family as Decignal. TypeScript, Tailwind for layout only (design tokens in CSS variables).
- React Three Fiber, drei (`View`, `useGLTF`, `Environment`, `ContactShadows`, `Html` hotspots), `@react-three/postprocessing` used sparingly (light bloom on screens, depth of field only on the rack "lift").
- GSAP + ScrollTrigger for pinned chapters and scrubbing; Lenis for smooth scroll; Motion (Framer Motion) for UI micro-interactions.
- `@react-spring/three` or a small custom spring for hanger swing and twirl physics.
- `detect-gpu` to pick a quality tier: High (real-time 3D + post), Mid (real-time, no post, dpr 1), Low (poster images + video loops, no WebGL).
- MDX for page content so copy edits never touch scene code.

**One canvas for the whole page.** A single fixed WebGL canvas with drei `View` portals renders every section's scene, so the browser never juggles several WebGL contexts. Scenes outside the viewport stop rendering (`frameloop="demand"`).

**Hosting:** Vercel or Cloudflare Pages free tier; 3D, video and image sequences on a CDN bucket (Cloudflare R2 free tier) so the site build stays small.

## Asset pipeline (free first)

Blender is the hub: every asset, wherever it starts, passes through one Blender scene with the shared light rig, so everything matches.

| Asset | Free route | Paid / connected shortcut | Output |
| --- | --- | --- | --- |
| Store, fixtures, counters, shelves | Model in Blender (simple shapes + good materials); CC0 models and HDRIs from [Poly Haven](https://polyhaven.com/) | Higgsfield `generate_3d` (connected here) for one-off props | GLB, Meshopt-compressed, < 1.5 MB per scene |
| Garments on the rack | Blender cloth sim on a hanger, bake, then decimate | Clothing from CC-licensed models, re-draped | GLB per garment, \~40-80k tris on desktop, half on mobile |
| Image-to-3D props (boxes, bags, POS) | Open-source image-to-3D models (e.g. Hunyuan3D, TRELLIS) on free Hugging Face Spaces, then clean up in Blender | Higgsfield 3D | GLB |
| Hyperreal characters | Generate a still in Canva (Magic Media), animate with a free image-to-video tier, remove background | Higgsfield image + video generation (connected here, uses credits) | WebM alpha + HEVC alpha, 720p mobile / 1080p desktop, 4-6 s loops |
| Rigged background people (optional) | Mixamo characters and animations | none needed | GLB, low-poly, far from camera only |
| Hero stills, OG images, posters | Render in Blender (Cycles), touch up in Canva | Canva brand kit for social crops | AVIF + WebP |
| Scroll sequences | Blender camera animation, render 60-90 frames | none needed | AVIF frames, \~25-40 KB each |
| Textures | Poly Haven / ambientCG (CC0): travertine, terrazzo, brushed steel, linen | none needed | KTX2 (1K mobile, 2K desktop) |

**Character rules:** generate each character once as a reference sheet (same face, same uniform), reuse it for every clip so the cashier on POS is the same person on Clienteling. Keep hands mostly busy or out of frame; AI video is weakest on hands.

**Licensing:** keep a `CREDITS.md` with the source and licence of every asset. Check each AI tool's commercial-use terms before publishing; free tiers often add watermarks or restrict commercial use.

## Sitemap

22 pages: 1 home, 12 solution pages on one shared template, 9 company and legal pages. Fynd's list had Partners twice; it is one page here.

| Group | Page | Route | Fynd reference |
| --- | --- | --- | --- |
| Home | Home | `/` | [fynd.com](https://www.fynd.com/) |
| Online | Storefront | `/storefront` | [storefront](https://www.fynd.com/storefront) |
| Online | Brand showcase | `/storefront/brand-showcase` | [brand-showcase](https://www.fynd.com/storefront/brand-showcase) |
| Online | B2B commerce | `/b2b` | [b2b](https://www.fynd.com/b2b) |
| Online | Quick commerce | `/quick-commerce` | [quick-commerce](https://www.fynd.com/quick-commerce) |
| Online | Marketplace | `/marketplace` | [marketplace](https://www.fynd.com/marketplace) |
| Supply chain | Order management (OMS) | `/oms` | [oms](https://www.fynd.com/oms) |
| Supply chain | Warehouse management (WMS) | `/wms` | [wms](https://www.fynd.com/wms) |
| Supply chain | Transport management (TMS) | `/tms` | [tms](https://www.fynd.com/tms) |
| In-store | Point of sale (POS) | `/pos` | [pos](https://www.fynd.com/pos) |
| In-store | Clienteling | `/clienteling` | [clienteling](https://www.fynd.com/clienteling) |
| In-store | Endless aisle | `/endless-aisle` | [endless-aisle](https://www.fynd.com/endless-aisle) |
| In-store | Self-checkout | `/self-checkout` | [self-checkout](https://www.fynd.com/self-checkout) |
| Company | About us | `/about-us` | [about-us](https://www.fynd.com/about-us) |
| Company | Contact / Book a demo | `/contact-us` | [contact-us](https://www.fynd.com/contact-us) |
| Company | Security | `/security` | [security](https://www.fynd.com/security) |
| Company | Infrastructure | `/infrastructure` | [infrastructure](https://www.fynd.com/infrastructure) |
| Company | Partners | `/partners` | [partners](https://www.fynd.com/partners) |
| Company | Glossary | `/glossary` | [glossary](https://www.fynd.com/glossary) |
| Company | AI instructions (+ `/llms.txt`) | `/ai-instructions` | [ai-instructions](https://www.fynd.com/ai-instructions) |
| Legal | Privacy policy | `/privacy-policy` | [privacy-policy](https://www.fynd.com/privacy-policy) |
| Legal | Terms and conditions | `/terms-and-conditions` | [terms](https://www.fynd.com/terms-and-conditions) |

The nav groups mirror the story: **Online**, **Supply chain**, **In-store**, **Company**. The mega-menu shows a tiny live 3D thumbnail per solution instead of icons. Glossary and legal pages stay light: no WebGL, just type, terrazzo texture and a small looping object.

## Homepage storyboard

The homepage is ten chapters in one continuous store world, and every chapter follows the same illustrative order, **ORD-1042** (a linen overshirt, size M, ordered online, fulfilled from the nearest store). A Morpho-style chapter index (01/10) sits on the left edge; on mobile it becomes a thin top progress bar.

0. **Opening.** Loader reads "Opening 0%". A copper-edged shop shutter rolls up as it counts (Maison des Elites curtain idea), revealing the store. Skippable; never shown twice in a session.
1. **Hero: the store.** The isometric diorama from your second render, live in 3D: garments sway slightly, the POS screen glows, a shopper (alpha video) walks in. Cursor tilts the diorama 3-4 degrees. Headline: "One system behind *every sale*." CTAs: Book a demo / See it work. *Mobile:* a pre-rendered 4 s loop instead of live 3D until the user scrolls.
2. **Problem: four islands.** On scroll the camera pulls up and the store splits into four floating islands: website, store, warehouse, marketplace. Each shows a different stock count for the same overshirt (4, 1, 0, 6) in red. Copy: "Your website says 4. Your store sold the last one an hour ago."
3. **Unify.** The islands slide together and lock onto one terrazzo base. A single copper line runs through all four and every counter rolls to the same number (Second Ride counter style). Copy: "One catalog, one stock count, everywhere."
4. **Storefront.** Camera dives into the laptop on the counter. Website blocks build themselves on screen; then the clothing rack slides in. Drag the rail to browse store themes; tap a hanger and it lifts, twirls and shows that theme on the laptop. Link: Storefront, Brand showcase.
5. **The order lands.** ORD-1042 appears as a paper ticket that drops from the screen. The OMS view: the ticket checks three locations and routes itself to the store 2.4 km away (illustrative). Hotspots explain split-shipment and returns.
6. **Pick and pack.** Cut to the packing station from your third render. A picker (alpha video) scans the overshirt; the label printer prints; the box rolls onto the conveyor. Bin locations light up copper. Link: WMS.
7. **Out for delivery.** Scroll-scrubbed sequence: the box rides the conveyor, into a van, across a miniature city map, to a doorstep. An ETA chip counts down. Link: TMS, Quick commerce.
8. **In the store, too.** Back at the counter from your fourth render. Three short sub-scenes on horizontal scroll: POS tap-to-pay (receipt prints), Endless aisle (a shelf stretches into infinite depth), Self-checkout (items drop into a kraft bag). A cashier character is the same person throughout. Links: POS, Clienteling, Endless aisle, Self-checkout.
9. **Proof and how we work.** Honest numbers only: Demaze's 45+ projects, 35+ people, 6 years, as stated on the Demaze site, rolled up from 0. Then four steps (Discover, Design, Build, Launch) as four small rooms the camera passes. Optional testimonial marquee once real quotes exist.
10. **Close.** Store lights warm up, the shutter rolls halfway down, a large "decommerce" wordmark settles on the travertine floor. Book-a-demo form, footer with the nav groups, Demaze and Decignal family links.

**What scroll does vs what touch does:** scroll drives camera and story; drag, tap and hover are only for exploring (rack, hotspots, rotate). Nothing important is hidden behind an interaction.

## Solution page template and scene concepts

All 12 solution pages share one template of seven blocks; only the scene, copy and data change, so Claude Code builds the template once and fills it 12 times.

1. **Hero scene** with the signature interaction (below) and a one-line promise.
2. **The problem, shown:** 2-3 sentences plus the scene in its "broken" state.
3. **The fix, scrubbed:** pinned section where scroll moves the scene from broken to fixed.
4. **Anatomy:** BLUNT/Second Ride-style hotspots on the hardware or screen, 4-6 labelled parts.
5. **Capabilities:** a short list or tabs (no icon-card grid), each tab swaps the scene's camera angle.
6. **Works with:** the other Decommerce modules this one connects to, as mini 3D thumbnails.
7. **FAQ + CTA** and the shared footer.

| Page | Signature scene | Broken state to fixed state | Interaction |
| --- | --- | --- | --- |
| Storefront | Laptop on the store counter building a site | Blank screen to a live store page in seconds | Clothing-rack theme browser |
| Brand showcase | A gallery wall of framed storefronts in the same store | Random frames to a curated row | Drag the wall; tap a frame to open it full screen |
| B2B | Wholesale stockroom: pallets, a bulk order pad | Paper order book to a buyer portal with tiered prices | Pallet stacks grow as quantity slider moves |
| Quick commerce | Dark store shelves + miniature city block | 45-minute timer to a 10-minute timer | Drag a rider along the route; timer reacts |
| Marketplace | One product box at the centre | One listing to the same box copied onto several channel shelves (generic channel badges, no third-party logos) | Toggle channels on and off |
| OMS | Order tickets on a routing board | Tickets piling up to tickets auto-routing to the right location | Tap a ticket to follow its route |
| WMS | Packing station from render 3 | Picker searching aisles to bins lighting up in pick order | Scan beam follows cursor; hotspots on printer and scanner |
| TMS | Van, loading bay, top-down route map | Tangled routes to one optimised route | Scrub the delivery day; ETA updates |
| POS | Counter from render 4 with cashier character | Queue at a slow till to tap-to-pay and printed receipt | Rotate the terminal; hotspots on screen, reader, printer |
| Clienteling | Store associate with a tablet beside a rack | Generic greeting to a profile card with past purchases and sizes | Tap garments to add to a look on the tablet |
| Endless aisle | One short shelf | Out-of-size gap to a shelf that extends into endless depth | Scroll pushes the shelf deeper; tap to order to home |
| Self-checkout | Kiosk + kraft bag | Long queue to scan-and-go in one step | Drag items over the scanner; they drop into the bag |

**Company pages:** About uses the numbered principles reveal (Maison des Elites pattern) and the Demaze/Decignal/Decommerce family as three linked rooms. Security shows a terrazzo block whose layers peel back one by one (access, encryption, audit, backups). Infrastructure is an exploded server rack with roll-up uptime and capacity figures, only once real figures exist.

## Performance and mobile budget

Target device: a mid-range Android (Snapdragon 6-series class) on 4G. If it is smooth there, it is smooth everywhere.

| Budget | Target |
| --- | --- |
| Largest Contentful Paint | < 2.5 s on 4G (the hero poster image is the LCP, never the canvas) |
| JavaScript before interaction | < 200 KB gzipped; three.js and scenes load after the poster paints |
| Interaction to Next Paint | < 200 ms |
| Cumulative Layout Shift | < 0.05 |
| GLB per scene | < 1.5 MB (Meshopt + KTX2); total 3D per page < 5 MB, streamed per chapter |
| Video loop | < 1.5 MB mobile, < 3 MB desktop |
| Frame rate | 60 fps desktop, steady 30+ fps mobile |
| Device pixel ratio | clamp to 1-1.5 on mobile, 1-2 on desktop |

**Rules that make it light:**

- Poster first: every scene ships a rendered still that shows instantly; 3D fades in over it when ready.
- Load chapter N+1 while the user reads chapter N; unload what is two chapters behind.
- Baked lighting and shadows in textures; at most one real-time light per scene.
- `prefers-reduced-motion` and the Low GPU tier get posters, gentle crossfades and normal scrolling, no scrubbing or smooth-scroll hijack.
- Pause all rendering when the tab is hidden or the scene is off screen.
- Lighthouse and WebPageTest runs on every deploy preview; a page that breaks budget does not ship.

## Claude Code execution plan

Build in nine phases, each ending in a deploy preview someone reviews on a real phone before the next starts. Claude Code writes the code; humans own Blender, character generation and final copy.

**Step 0: put this in `CLAUDE.md` at the repo root**

```markdown
# Decommerce site
- Next.js App Router, TypeScript, static generation. Tailwind for layout, design tokens in src/styles/tokens.css.
- 3D: React Three Fiber + drei. ONE fixed canvas with drei <View>; never create a second WebGL canvas.
- Scroll: GSAP ScrollTrigger + Lenis. UI motion: Motion. Respect prefers-reduced-motion everywhere.
- Quality tiers from detect-gpu: high / mid / low. Low = posters + video, no WebGL.
- Assets live in /public/assets or the CDN; GLB must be Meshopt-compressed, textures KTX2.
- Content in MDX under /content; components never hardcode copy.
- Design rules: stone + copper palette only, one accent, one warm light from upper left. No purple, no gradients, no glass blobs, no sparkle icons, no icon-card grids.
- Example data is illustrative and labelled so. Never invent customer names, logos or stats.
- Every PR: run lint, typecheck, build, and Lighthouse mobile; report the scores.
```

**Phases**

1. **Scaffold.** Prompt: "Set up the Next.js project per CLAUDE.md with routes for all 22 pages in the sitemap, MDX content folders, tokens.css with the palette, fonts, Lenis + GSAP wiring and a deploy to Vercel preview."
2. **Design system.** Header with mega-menu, footer, buttons, chapter index rail, stat counter, hotspot, FAQ accordion, marquee. Prompt: "Use the frontend-design skill. Build these components in a /lab page, each with reduced-motion and mobile states."
3. **3D foundation.** Shared canvas + View portals, GLB loader with poster fallback, quality tiers, scene lifecycle (load ahead, unload behind, pause offscreen). Test with a placeholder cube scene.
4. **Media components.** `<AlphaVideo>` (WebM/HEVC alpha switch, plane in 3D or DOM), `<ScrollSequence>` (frames to canvas tied to ScrollTrigger), `<Poster>`.
5. **Clothing rack.** "Build a web clothing rack in R3F: GLB garments on hangers along a rail; drag moves exactly one hanger per swipe with momentum; hangers swing on a spring and nudge neighbours; tap lifts one forward with a full twirl while others slide apart and blur; drag to spin it; reverse on close. 60 fps desktop, 30+ on mobile."
6. **Homepage.** Build chapters 0-10 from the storyboard one at a time, with placeholder assets first and real assets swapped in as they arrive.
7. **Solution template + 12 pages.** Build the seven-block template, then one page per session, POS first (it reuses the most homepage assets).
8. **Company and legal pages, SEO.** About, Contact (form to email/CRM), Security, Infrastructure, Partners, Glossary, AI instructions + `/llms.txt`, legal. Metadata, OG images, sitemap.xml, schema.org Organization.
9. **Hardening.** Performance budget pass, accessibility (keyboard paths for every interaction, alt text, captions), cross-device QA, analytics, launch.

**Working tips for Claude Code:** one chapter or page per session; paste the relevant storyboard row into the prompt; ask it to screenshot the preview at 390 px and 1440 px before saying it is done.

## Risks, open decisions and launch checklist

The biggest risk is asset production, not code: Claude Code can build the whole site, but someone must own Blender and character clips.

| Risk | Mitigation |
| --- | --- |
| 3D assets take longer than code | Build every chapter with posters and placeholder GLBs first; swap real assets in later |
| AI character clips look uncanny (hands, faces drift) | One reference sheet per character; short 4-6 s loops; people at mid-distance, hands busy |
| Site feels heavy on phones | GPU tiers, poster-first loading, budget checks on every preview |
| Looks like a Fynd copy | Different palette, own story (ORD-1042), no reused copy, stats or logos |
| Claims Decommerce cannot back yet | Only state features that exist or are clearly marked "coming soon"; numbers come from Demaze's real record |
| Free-tier AI tools restrict commercial use | Check terms before publishing; keep CREDITS.md |

**Open decisions**

- Final name styling ("decommerce" lowercase like "decignal"?), domain and logo.
- Which of the 12 modules exist today vs coming soon.
- Who owns Blender work: in-house designer or freelancer.
- Demo booking target: email, Calendly or a CRM.

**Launch checklist**

- [ ] All 22 routes live with real copy
- [ ] Lighthouse mobile ≥ 90 performance on home and 3 solution pages
- [ ] Tested on a mid-range Android, an iPhone, Safari desktop and Chrome desktop
- [ ] Reduced-motion and Low tier paths checked
- [ ] Keyboard path through every interaction (rack, hotspots, tabs)
- [ ] OG images, sitemap.xml, robots.txt, llms.txt
- [ ] CREDITS.md complete
- [ ] Contact form delivers to the right inbox

## Sources

References opened for this plan on 23 Oct 2026: [Fynd](https://www.fynd.com/), [Demaze Technologies](https://www.demazetech.com/), [Decignal](https://decignal.com/), [Motionary clothing rack](https://motionary.dev/builds/clothing-rack), [Morpho](https://morphowater.com/), [BLUNT](https://bluntumbrellas.com/), [Maison des Elites](https://mdebeauty.com/), [Second Ride](https://second-ride.de/en/fahrzeuge).
