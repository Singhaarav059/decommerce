#!/bin/zsh
# Lighthouse mobile (default throttling) against a running production server.
# Usage: scripts/lighthouse.sh [base=http://localhost:3100] [paths...]
base=${1:-http://localhost:3100}; shift
paths=(${@:-/ /pos /storefront /oms /about-us})
CHROME_PATH=${CHROME_PATH:-$(ls -d ~/Library/Caches/ms-playwright/chromium-*/chrome-mac*/*.app(N) | tail -1)/Contents/MacOS/Google\ Chrome\ for\ Testing}
[ -x "$CHROME_PATH" ] || CHROME_PATH=$(ls ~/Library/Caches/ms-playwright/chromium-*/chrome-mac*/*.app/Contents/MacOS/* | tail -1)
mkdir -p reports
for p in $paths; do
  name=${${p//\//_}:-_home}; [ "$name" = "_" ] && name=_home
  CHROME_PATH="$CHROME_PATH" npx --yes lighthouse "$base$p" --quiet --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="reports/lh$name.json" >/dev/null 2>&1
  node -e '
    const r = require("./reports/lh'"$name"'.json"); const c = r.categories, a = r.audits;
    const s = (k) => Math.round((c[k]?.score ?? 0) * 100);
    console.log(process.argv[1].padEnd(14), "perf", s("performance"), "a11y", s("accessibility"), "bp", s("best-practices"), "seo", s("seo"),
      "| LCP", a["largest-contentful-paint"].displayValue, "TBT", a["total-blocking-time"].displayValue, "CLS", a["cumulative-layout-shift"].displayValue);
  ' "$p"
done
