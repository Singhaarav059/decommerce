"""For each section clip, measure how busy the text area (desktop: x 3–40 %, y 22–78 %)
is in every frame (luminance detail = mean absolute Laplacian). Reports the last frame
before the area gets markedly busier than the first frame, i.e. where to trim."""
import subprocess, sys, numpy as np
for k in sys.argv[1:]:
    p = f"assets-src/vertex/v3-{k}.mp4"
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", p, "-vf", "crop=iw*0.37:ih*0.56:iw*0.03:ih*0.22,scale=240:-2,format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
    h = len(raw) // 240 // 192
    fr = np.frombuffer(raw, np.uint8).reshape(192, -1, 240).astype(np.float32)
    lap = np.abs(fr[:, 1:-1, 1:-1] * 4 - fr[:, :-2, 1:-1] - fr[:, 2:, 1:-1] - fr[:, 1:-1, :-2] - fr[:, 1:-1, 2:]).mean(axis=(1, 2))
    base = lap[:8].mean()
    over = np.where(lap > base * 1.6 + 1.0)[0]
    cut = int(over[0]) if len(over) else 192
    print(f"{k:9s} base {base:5.2f} max {lap.max():5.2f} first busy frame {cut} ({cut/192:.2f})")
