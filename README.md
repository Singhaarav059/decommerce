# Decommerce website

Marketing site for Decommerce: 22 pages in one 3D store world. Plan: [PLAN.md](PLAN.md) · progress: [PROGRESS.md](PROGRESS.md) · launch status: [LAUNCH.md](LAUNCH.md) · assets: [CREDITS.md](CREDITS.md).

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

- `DEMO_WEBHOOK_URL`: where `/api/demo` forwards book-a-demo leads (JSON POST). Unset = leads are only logged.
