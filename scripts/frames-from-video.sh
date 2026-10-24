#!/bin/zsh
# Turn a generated clip into scroll-sequence frames for <ScrollSequence>.
# Usage: scripts/frames-from-video.sh <clip.mp4> <out_dir> [every_nth=2] [desktop_w=1600] [mobile_w=800] [quality=64] [mobile_aspect=4:3|full] [match=studio|none]
# Writes <out_dir>/d/NNN.webp (full frame) and <out_dir>/m/NNN.webp (4:3 centre crop for phones, or the full frame).
set -e
in=$1; out=$2; nth=${3:-2}; dw=${4:-1600}; mw=${5:-800}; q=${6:-64}; ma=${7:-4:3}; match=${8:-studio}
tmp=$(mktemp -d)
# Colour-match to the page: measure the backdrop (frame edges of the first frame)
# and scale each channel so it lands on --studio (#cec5bd). Then trim 6 px of
# edge rows/columns, where generated footage often carries stray lines.
rgb=$(ffmpeg -loglevel error -i "$in" -vf "select='eq(n\,0)',crop=iw:ih*0.08:0:0,scale=1:1" -frames:v 1 -f rawvideo -pix_fmt rgb24 - | xxd -p)
# interiors keep their own colour (match=none); only studio-sweep footage is matched
[ "$match" = "none" ] && rgb=cec5bd
mix=$(python3 -c "
r,g,b=int('$rgb'[0:2],16),int('$rgb'[2:4],16),int('$rgb'[4:6],16)
t=(0xce,0xc5,0xbd)
k=[max(0.85,min(1.15,t[i]/max(1,c))) for i,c in enumerate((r,g,b))]
print(f'colorchannelmixer=rr={k[0]:.3f}:gg={k[1]:.3f}:bb={k[2]:.3f}')")
echo "backdrop #$rgb -> $mix"
ffmpeg -loglevel error -i "$in" -vf "select='not(mod(n\,$nth))',crop=iw-12:ih-12:6:6,$mix" -fps_mode vfr "$tmp/f_%03d.png"
rm -rf "$out"; mkdir -p "$out/d" "$out/m"
i=0
for f in "$tmp"/f_*.png; do
  n=$(printf "%03d" $i)
  cwebp -quiet -q $q -resize $dw 0 "$f" -o "$out/d/$n.webp"
  if [ "$ma" = "full" ]; then
    cwebp -quiet -q $q -resize $mw 0 "$f" -o "$out/m/$n.webp"
  else
    # centre crop to 4:3, then scale for phones
    w=$(sips -g pixelWidth "$f" | tail -1 | awk '{print $2}'); h=$(sips -g pixelHeight "$f" | tail -1 | awk '{print $2}')
    cw=$(( h * 4 / 3 )); x=$(( (w - cw) / 2 ))
    cwebp -quiet -q $q -crop $x 0 $cw $h -resize $mw 0 "$f" -o "$out/m/$n.webp"
  fi
  i=$((i+1))
done
rm -rf "$tmp"
echo "$i frames"; du -sh "$out/d" "$out/m"
