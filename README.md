# Decommerce website

Marketing site for Decommerce: an animated 3D-rendered commerce world across the homepage, solution pages and company pages. Plan: [PLAN.md](PLAN.md) · progress: [PROGRESS.md](PROGRESS.md) · launch status: [LAUNCH.md](LAUNCH.md) · assets: [CREDITS.md](CREDITS.md).

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npx next start -p 3100
```

`?tier=low|mid|high` forces a quality tier. `/lab` shows every component; `/capture?scene=<key>&p=<0-1>` renders one scene full-screen (used by the asset scripts).

## Checks (need a running server; BASE defaults to http://localhost:3000)

```bash
npm run lint && npx tsc --noEmit && npm run build
node scripts/checks/overflow.mjs           # horizontal overflow, all routes
node scripts/checks/a11y.mjs               # axe WCAG 2.1 AA, all routes
node scripts/checks/home-tiers.mjs /tmp    # low tier + reduced motion
node scripts/checks/solution.mjs pos /tmp 1440,390
node scripts/checks/rack.mjs /tmp
scripts/lighthouse.sh http://localhost:3100 / /pos /storefront /oms
```

## Assets

```bash
node scripts/posters.mjs [--solutions] [name...]   # poster stills from live scenes
node scripts/capture-sequence.mjs delivery public/assets/seq/delivery 72
node scripts/og.mjs                                 # social card
/Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/blender/garments.py -- --out /tmp/models
scripts/compress-glb.sh /tmp/models/rack.glb public/assets/models/rack.glb
```

## Environment

- `DEMO_WEBHOOK_URL`: where `/api/demo` forwards book-a-demo leads (JSON POST). The form returns an unavailable error when this is unset; configure a real delivery endpoint before launch.
- `DEMO_CONTACT_EMAIL`: optional public contact email shown on the contact page and when delivery fails. Set this at build time; an unset or invalid value is hidden.
- `DEMO_PREVIEW_MODE=1`: presents the contact form as a local-only example; submissions are not sent or saved, and the contact email is labelled as a placeholder. Set at build time and remove before connecting a real delivery endpoint.
