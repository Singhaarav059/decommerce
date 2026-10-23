#!/bin/zsh
# PNG RGBA frames -> WebM VP9 alpha + HEVC alpha (.mov, Safari) + WebP poster.
# Usage: encode_alpha.sh <frames_dir> <out_basename> [fps]
set -e
in=$1; out=$2; fps=${3:-24}
mkdir -p "$(dirname "$out")"
ffmpeg -y -loglevel error -framerate $fps -i "$in/f_%04d.png" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 36 -row-mt 1 -an "$out.webm"
ffmpeg -y -loglevel error -framerate $fps -i "$in/f_%04d.png" -c:v hevc_videotoolbox -allow_sw 1 -alpha_quality 0.8 -b:v 1200k -tag:v hvc1 -an "$out.mov"
cwebp -quiet -q 82 -alpha_q 90 "$in/f_0001.png" -o "$out.webp"
ls -la "$out".*
