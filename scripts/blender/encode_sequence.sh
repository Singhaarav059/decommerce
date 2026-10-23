#!/bin/zsh
# PNG frames -> numbered WebP frames for <ScrollSequence> (desktop + half-size mobile).
# Usage: encode_sequence.sh <frames_dir> <out_dir> [quality]
set -e
in=$1; out=$2; q=${3:-72}
mkdir -p "$out/d" "$out/m"
i=0
for f in "$in"/f_*.png; do
  n=$(printf "%03d" $i)
  cwebp -quiet -q $q "$f" -o "$out/d/$n.webp"
  cwebp -quiet -q $q -resize $(( $(sips -g pixelWidth "$f" | tail -1 | awk '{print $2}') / 2 )) 0 "$f" -o "$out/m/$n.webp"
  i=$((i+1))
done
du -sh "$out/d" "$out/m"
