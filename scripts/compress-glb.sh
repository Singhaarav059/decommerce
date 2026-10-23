#!/bin/zsh
# Meshopt-compress + quantize a GLB for the web (PLAN: < 1.5 MB per scene).
# Usage: scripts/compress-glb.sh <in.glb> <out.glb>
set -e
npx gltf-transform optimize "$1" "$2" --compress meshopt --texture-compress webp --simplify false --join false --instance false --flatten false
ls -la "$2"
