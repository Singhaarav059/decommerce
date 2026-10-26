#!/bin/zsh
# Keep re-running the v5 still and film jobs until every output exists, waiting out network drops.
# Both scripts skip finished files, so each pass only fills gaps. Gives up after 8 passes.
cd "$(dirname $0)/../.."
L=${1:-/tmp}
want_stills=56; want_films=20
for pass in 1 2 3 4 5 6 7 8; do
  until curl -s -m 10 -o /dev/null https://aiplatform.googleapis.com; do echo "$(date +%T) offline, waiting"; sleep 60; done
  stills=$(find assets-src/stills/v5 -name "*.png" | wc -l | tr -d ' ')
  films=$(ls assets-src/vertex/v5-*.mp4 2>/dev/null | wc -l | tr -d ' ')
  echo "$(date +%T) pass $pass: $stills stills, $films films"
  [ $stills -ge $want_stills ] && [ $films -ge $want_films ] && { echo "all done"; exit 0; }
  node scripts/v5/restyle.mjs >> $L/restyle2.log 2>&1
  node scripts/v5/films.mjs >> $L/films.log 2>&1
done
echo "stopped after 8 passes"
