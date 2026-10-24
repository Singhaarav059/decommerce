#!/bin/zsh
# Rebuild every scroll film at full source resolution: 1920 px desktop frames and 864 px phone
# frames (the native width of a 4:5 crop of 1080p footage), so nothing is upscaled on retina screens.
# Source clip, frame stride and phone focus per film were matched against the previous frames.
# scripts/v3/hd-frames.sh [name...]
set -e
Q=58
only=($@)
typeset -A home=(
  hero "v3-hero 4 0.700" problem "v3-problem 4 0.620" order "v3-order 4 0.719" pack "v3-pack-trim 3 0.700"
  delivery "v3-delivery 4 0.660" counter "v3-counter 4 0.700" proof "v3-proof-trim 2 0.700" close "v3-close-trim 3 0.549"
)
for k in ${(k)home}; do
  [ ${#only} -gt 0 ] && (( ! ${only[(Ie)$k]} )) && continue
  parts=(${=home[$k]}); clip=$parts[1] nth=$parts[2] fx=$parts[3]
  scripts/frames-from-video.sh assets-src/vertex/$clip.mp4 public/assets/seq/$k $nth 1920 864 $Q "4:5@$fx" none | tail -1
done
for d in public/assets/sol/*/; do
  k=$(basename $d)
  clip=$(for x in -fix -trim ""; do f=assets-src/vertex/v3-sol-$k$x.mp4; [ -f $f ] && echo $f && break; done)
  [ -z "$clip" ] && continue
  [ ${#only} -gt 0 ] && (( ! ${only[(Ie)$k]} )) && continue
  scripts/frames-from-video.sh $clip ${d}seq 4 1920 864 $Q "4:5@0.7" none | tail -1
done
