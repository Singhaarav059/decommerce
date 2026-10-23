#!/bin/zsh
# Turn a generated clip into scroll-sequence frames for <ScrollSequence>.
# Usage: scripts/frames-from-video.sh <clip.mp4> <out_dir> [every_nth=2] [desktop_w=1600] [mobile_w=800] [quality=64]
# Writes <out_dir>/d/NNN.webp (full frame) and <out_dir>/m/NNN.webp (4:3 centre crop for phones).
set -e
in=$1; out=$2; nth=${3:-2}; dw=${4:-1600}; mw=${5:-800}; q=${6:-64}
tmp=$(mktemp -d)
ffmpeg -loglevel error -i "$in" -vf "select='not(mod(n\,$nth))'" -fps_mode vfr "$tmp/f_%03d.png"
rm -rf "$out"; mkdir -p "$out/d" "$out/m"
i=0
for f in "$tmp"/f_*.png; do
  n=$(printf "%03d" $i)
  cwebp -quiet -q $q -resize $dw 0 "$f" -o "$out/d/$n.webp"
  # centre crop to 4:3, then scale for phones
  w=$(sips -g pixelWidth "$f" | tail -1 | awk '{print $2}'); h=$(sips -g pixelHeight "$f" | tail -1 | awk '{print $2}')
  cw=$(( h * 4 / 3 )); x=$(( (w - cw) / 2 ))
  cwebp -quiet -q $q -crop $x 0 $cw $h -resize $mw 0 "$f" -o "$out/m/$n.webp"
  i=$((i+1))
done
rm -rf "$tmp"
echo "$i frames"; du -sh "$out/d" "$out/m"
