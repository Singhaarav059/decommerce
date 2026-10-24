# Decommerce: photoreal rebuild plan

24 Oct 2026. This replaces the visual direction of the first build. The page structure (22 routes, ten homepage chapters, the solution template) stays; how every section looks and behaves changes.

## 1. What is wrong today

| Problem | Where | Fix |
| --- | --- | --- |
| Serif headline with one copper italic word | every headline | One sans family, no italics anywhere |
| Mono, letter-spaced uppercase labels ("02 · THE PROBLEM") | every section | Plain sentence-case labels in the same family |
| Text cards floating on top of visuals | hero, chapters 2–6 and 9, solution stages | Text and visuals get separate zones; nothing overlaps an image |
| Chapter index pinned over the left edge | homepage | Removed; progress lives in the header |
| Two visual languages: photoreal hero, clay 3D everywhere else | all chapters after the hero | Every visual is photoreal footage or a still from the same world |
| Boxed visuals with hard edges on a different-coloured page | posters, panels | Visuals sit on the page's own studio colour with feathered edges |
| Rounded cards, pills and shadows everywhere | UI | Flat sections separated by hairlines; small-radius rectangular buttons |
| Numbered pins on images | anatomy, hotspots | Legend beside the image; choosing a part zooms the image to it |

## 2. The system

### One surface: the studio sweep

The whole site is one photographic studio. Every visual is a miniature (or an interior) shot on the same warm grey seamless backdrop, under the same low sun from the upper left, and the page itself is that backdrop colour. Visuals have no frames or boxes; they fade into the page.

| Token | Value | Use |
| --- | --- | --- |
| `--studio` | `#CEC5BD` | Page background everywhere (measured mid-tone of the hero footage's backdrop) |
| `--studio-light` | `#DCD5CE` | Form fields, the few surfaces that need to read as raised |
| `--ink` | `#1B1915` | Text, primary buttons |
| `--ink-2` | `#45403A` | Secondary text (contrast 6.0:1 on `--studio`) |
| `--line` | `rgb(27 25 21 / 0.16)` | Hairlines between sections and list rows |
| `--copper` | `#843B13` | Links and the one accent; never decoration (contrast 4.7:1 on `--studio`, 5.5:1 on `--studio-light`) |
| `--night` | `#1B1915` | Footer only |

Rules for every generated visual:
- Seamless warm grey studio backdrop, even and soft, no horizon line.
- Key light: low warm sun from the upper left. Fill: soft and warm. Practical lights (LED strips, screens) allowed.
- Same materials: travertine, terrazzo, copper, brushed steel, oak, linen, kraft, olive trees.
- Camera language: 35–50 mm equivalent, gentle 3/4 views from slightly above, slow constant moves, no shake, no whip pans.
- People are allowed inside footage (cashier, picker, rider), mid-distance, hands busy, never posing to camera.
- Subject inside the central safe area (middle 60 % of the width, 80 % of the height) so the same frame works on desktop (wide pane) and phone (square pane).
- After generation, every clip is colour-matched to `--studio` (backdrop levels nudged to the token) and its edges feathered, so it melts into the page.

### Type: one family, no italics

- Family: **Schibsted Grotesk** (Google Fonts, variable 400–900). A sturdy editorial grotesk, rare in generated sites, good figures.
- Headlines: weight 500, tracking −0.025em, line-height 1.02, sentence case. Sizes: H1 clamp(44px, 6.2vw, 96px), H2 clamp(34px, 4.2vw, 64px), H3 24px.
- Body: 18px / 1.55, weight 400, max 60 characters per line. Small: 15px.
- Labels: 14px, weight 600, sentence case, `--ink-2`. No uppercase tracking, no monospace.
- Numbers (stock counts, timers, prices): tabular figures from the same family.
- No italics, no serif, no second family.

### Layout: text and visual never share space

Every section uses the same frame:

```
Desktop (≥ 1024 px)                          Phone
┌──────────── header (studio, hairline) ─────┐   ┌──── header ────┐
│                                             │   │ visual (sticky │
│  text column     │   visual pane            │   │ square, 56svh) │
│  cols 1–5        │   cols 6–12, bleeds to   │   ├────────────────┤
│  label           │   the right page edge,   │   │ text block     │
│  headline        │   full height below the  │   │ label          │
│  body            │   header                 │   │ headline       │
│  steps / links   │   (film, still or        │   │ body / steps   │
│                  │    drag-scrub object)    │   │                │
└─────────────────────────────────────────────┘   └────────────────┘
```

- The text column and the visual pane never overlap at any width. On phones the visual is on top and the text below it, in the same order for every section.
- In pinned (scroll-scrubbed) sections, the visual pane is sticky and the text column steps through its states; on phones the visual sticks at the top and the steps scroll underneath it.
- A section's text appears in the same place in every chapter, so the eye learns where to look.
- Sections are separated by a hairline and generous space (160 px desktop, 96 px phone).
- Header: studio background, hairline, a thin copper progress line for the homepage story (replaces the chapter rail).
- Buttons: 4 px radius, 48 px tall, ink fill or ink outline. No pills, no shadows.

### Motion and interaction

- Scroll scrubbing: the camera moves only as you scroll (frame sequences from Veo footage).
- Drag scrubbing: interactive objects (the clothing rack, the POS terminal turntable, B2B pallets, the delivery route) are short clips you drag through instead of real-time 3D, with a slider under the visual for keyboard and screen readers.
- Text changes: a 300 ms fade with a small rise, nothing bouncy.
- Reduced motion: the visual shows its key still; text steps are listed in full.

### Performance budget (per page, unchanged from the plan)

- First paint: header, text column and one still frame (the LCP image, preloaded). Under 200 KB of JS before interaction.
- Frames stream after load + idle, nearest to the scroll position first. Per sequence: ≤ 48 frames, ≤ 2.5 MB desktop (1280 px), ≤ 1.2 MB phone (720 px square crop).
- No WebGL at all once every section is footage: three.js, drei and the scene code are removed at the end of the rebuild.

## 3. Homepage, section by section

One continuous world: the camera starts on the store diorama and every later chapter is either a new diorama on the same studio sweep or a push-in into one. ORD-1042 (linen overshirt, size M) is the thread.

| # | Text column (left / below) | Visual pane (right / top) | Interaction | Source |
| --- | --- | --- | --- | --- |
| 1 Hero | Label "Unified commerce", headline "One system behind every sale.", body, two buttons | Store diorama → push-in to the copper counter | Scroll scrub, 48 frames | Done (ref-diorama → Veo). Re-frame to the safe area and re-pane |
| 2–3 Problem → fix (one pinned section) | Step 1: "Four systems, four answers." with the four mismatched counts as a list. Step 2: "One catalog, one stock count, everywhere." with every count at 5 | Four separate floating rooms (camera arc), then one joined store (camera move); a 0.4 s cut between them at the step change | Scroll scrub, 61 frames | Done. Stills: `ch2-apart.png` (text-only generation), `ch2-cluster.png`. Veo cannot reliably rearrange objects (morphs, dropped rooms) or interpolate between different camera angles (ghosting), so each step is one camera move on one still |
| 4 Storefront | "A store website that builds itself from your catalog." + links | The clothing rack in the store: hangers slide past, one lifts | Drag scrub (theme browsing) + slider | Still: rack close-up (from ref-counter world). Clip: slow pan along the rack, then a hanger lifting |
| 5 The order | "ORD-1042 finds the nearest shelf." + the three locations as a list, the chosen one highlighted as you scroll | Miniature city diorama: three stores and a warehouse; a copper route draws to the nearest store | Scroll scrub | Still: city diorama. Clip: route drawing / camera move |
| 6 Pick and pack | "Bins light up in pick order." + four steps | Packing station (your render 2): picker scans, label prints, box goes onto the conveyor | Scroll scrub | ref-packing → Veo with a person |
| 7 Delivery | "Out for delivery." + live ETA counting down in the text column | Van crosses the miniature city to a doorstep | Scroll scrub | Still: city at street level. Clip: van route |
| 8 In the store | "The same system at the counter." + three items (Point of sale, Endless aisle, Self-checkout); the active one is highlighted | Counter (your render 1): a cashier, tap to pay, receipt prints; then aisle; then kiosk | Scroll scrub across three short clips | ref-counter → Veo; aisle and kiosk stills → Veo |
| 9 Who builds it | Demaze numbers (45+, 35+, 6) as a row, then the four process steps | Orbit of the store diorama (the orbit take we already have) | Scroll scrub | Existing orbit clip |
| 10 Book a demo | Headline + demo form | The store at dusk, lights warming, shutter half down | Plays once as you arrive (no scrub) | Still: dusk store. Clip: dusk transition |

## 4. Solution pages (one template, twelve pages)

| Block | Text column | Visual pane |
| --- | --- | --- |
| Hero | Label, headline, promise, two buttons | The page's signature object, drag-scrubbable (e.g. POS turntable, B2B pallets growing, rider on the route), slider underneath the visual |
| Problem → fix | Problem text, then the fix steps as you scroll | One scrubbed clip from the broken state to the fixed state |
| Anatomy | Legend: 4–6 parts. Choosing a part zooms the still to that part | One still, no pins or labels on it |
| Capabilities | Tabs | Each tab shows its own still (a different angle) |
| Works with | Four cards: still on top, name and line below | Stills only |
| Questions + demo | FAQ list, demo call to action | None |

Each solution needs about two clips and four stills. The order follows shared assets: POS, Self-checkout, Endless aisle and Clienteling reuse the counter world; WMS, OMS, TMS and Quick commerce reuse the warehouse and city; Storefront, Brand showcase, B2B and Marketplace reuse the store and stockroom.

## 5. Company and legal pages

Type-led on the studio surface. One still each where it helps (About: the three-company "family" as three dioramas; Security: a terrazzo block in layers, photographed; Infrastructure: a server rack in the same material language). Legal, Glossary and AI instructions: text only.

## 6. Order of work

Each step ends with screenshots at 1440 and 390 px, a check that nothing overlaps, lint/typecheck/build, and a commit.

1. Foundation: tokens, Schibsted Grotesk, no italics, header with progress line, `Section` layout (text column + visual pane), buttons, labels; remove the chapter rail and floating cards.
2. Hero on the new layout (existing footage, re-paned and colour-matched).
3. Media tooling: still generation with a reference image (Vertex image model), colour-match + feather step in the frame pipeline, drag-scrub viewer.
4. Homepage chapters 2 → 10, one at a time: storyboard stills first (checked against where the text goes), then the clip, then frames, then integration.
5. Solution template on the new layout, then the twelve pages in the asset order above.
6. Company and legal pages.
7. Optimisation: remove WebGL code and unused assets, Lighthouse, axe, overflow and overlap checks on every route.

## 7. Cost (Vertex AI, from the $100 cap)

| Item | Count | Unit | Est. |
| --- | --- | --- | --- |
| Storyboard stills incl. retries | ~120 | ~$0.04 | ~$5 |
| Draft clips (Veo 3.1 Lite, 720p, 8 s) | ~70 | $0.24 | ~$17 |
| Final clips (Veo 3.1 Fast, 1080p, 8 s) | ~40 | $0.80 | ~$32 |
| **Total** | | | **~$55** (plus $3.52 already spent) |

Every clip is drafted in Lite first; only drafts that pass review are made in Fast.

## 8. Lessons from production (keep these rules)

- Veo is reliable for camera moves around a still; unreliable for rearranging objects or morphing between different stills. Design each step as one camera move on one still; join steps with a short cut.
- Never put position words (front left, back right) in video prompts; Veo may write them into the image as text.
- Give Veo a start image in the output aspect (16:9); otherwise it letterboxes with black.
- Gemini 3 Pro Image returns a "thought" image before the final one; the image script keeps the final one. Edits that move or split objects are ignored; generate those as new images from text, and use edits only for lighting and colour.
- The frame script colour-matches every clip's backdrop to `--studio` and trims 6 px of edge rows, so footage melts into the page.

## 9. Status (24 Oct 2026)

Built as planned: homepage chapters 1–10, the 12 solution pages on the template in section 4, company and legal pages. WebGL, three.js and all 3D-scene code are removed; every visual is Veo footage or a Gemini still. Changes from the plan: the opening loader was dropped (it covered the first image); the clothing-rack interaction became the storefront chapter's rail film; solution heroes use a drag-scrub of each page's fixed-state clip. Generation cost so far is in `assets-src/vertex/ledger.json`.

## 10. Revision after owner review (24 Oct 2026)

Problems found: scenes sit in feathered boxes on an empty grey page; several clips break continuity (second van appears and vanishes, corner house morphs, card vanishes, nobody at the counter, glass front disappears in the orbit); two sections cut between unrelated shots; the order section shows nothing happening; brand showcase puts clothes in picture frames; sections show but do not explain.

New rules, replacing the studio-sweep approach:
- Every section is a full-screen real place (boutique, stockroom, street, counter), edge to edge, no box, no feather. Each shot is composed so the left 40 % (desktop) is calm empty space (sunlit wall, floor) where the text sits; the subject stays in the right 60 %. On phones the scene fills the top of the screen and blends into a panel of its own floor colour below, where the text sits.
- One continuous Veo shot per section, from one still: a camera move or one simple physical action. No crossfades between unrelated shots. People appear where the story needs them (cashier behind the counter, customer tapping a card that stays in the hand).
- Every clip is checked frame by frame before use; any clip where an object appears, vanishes or morphs is rejected.
- Each section explains: what happens, what goes wrong without Decommerce, what Decommerce does (2–3 text steps).
- Storefront section: an interactive clothing rack modelled on the Motionary reference (drag the rail, the centred garment grows with name and price, "See the piece" opens it with sizes and "Add to bag"), built in the DOM from cut-out garment photos.
- Brand showcase: styled looks on mannequins and display tables in the store, not framed pictures.

### 10.1 Status after the revision (24 Oct 2026)

- Homepage, all 12 solution pages and all 9 company/legal pages are full-bleed real places; no feathered boxes remain on public pages.
- Solution pages (`SolutionPage`): one pinned film per page (pitch → problem → steps that tick off as the action happens), Anatomy on the finished scene with a spotlight per part (a zoom pulled busy detail under the text), Capabilities on a close-up of the same place, Works with and Questions on the scene's floor colour. Media: `scripts/v3/sol-shots.json` → `sol.mjs` (start, end, detail stills; clips with first and last frame for a locked camera) → `sol-build.mjs`.
- Company pages (`DocPage`): a room of the store that fits the page (`scripts/v3/co-shots.json`), body text on its floor colour; Security and Infrastructure keep their section legend.
- Rejected and fixed: quick commerce (a second, identical rider appeared, so the start frame was re-made without the rider); storefront (Veo morphed the screen, so `screen-fill.py` composites the tiles filling in one by one over the locked shot); endless aisle start still had no gap on the shelf (edited in).
- Phones: each pinned film's height adapts so its tallest step fits (`--film-h`, checked by `scripts/checks/fit.mjs` at 390×844, 375×667, 360×740). Reduced motion gets a static scene with every step listed.
- Floor colours are lightened where needed so ink and copper text pass AA (`scripts/v3/floor.py`); copper darkened to #74320f.
