"""Lock a drifting Veo shot: estimate each frame's translation against frame 0 by
phase correlation (on a downscaled greyscale copy), then crop a moving window that
follows the scene so the framing stays fixed. Output: <out>.mp4 at the crop size.
usage: python3 scripts/v3/stabilize.py in.mp4 out.mp4"""
import subprocess, sys, numpy as np
src, dst = sys.argv[1], sys.argv[2]
W, H, S = 1920, 1080, 4  # analyse at 1/4 size
raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", src, "-vf", f"scale={W//S}:{H//S},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H // S, W // S).astype(np.float32)
win = np.outer(np.hanning(H // S), np.hanning(W // S))
def shift(a, b):
    A, B = np.fft.fft2((a - a.mean()) * win), np.fft.fft2((b - b.mean()) * win)
    r = np.fft.ifft2(A * B.conj() / (np.abs(A * B.conj()) + 1e-6)).real
    y, x = np.unravel_index(np.argmax(r), r.shape)
    if y > r.shape[0] // 2: y -= r.shape[0]
    if x > r.shape[1] // 2: x -= r.shape[1]
    return x * S, y * S
# chain small frame-to-frame shifts (robust to people moving), then smooth
d = [(0.0, 0.0)]
for i in range(1, len(fr)):
    dx, dy = shift(fr[i], fr[i - 1])
    d.append((d[-1][0] + dx, d[-1][1] + dy))
d = np.array(d)
k = np.ones(9) / 9
d = np.stack([np.convolve(np.pad(d[:, j], 4, mode="edge"), k, "valid") for j in range(2)], 1)
mx, my = d[:, 0], d[:, 1]
cw = int(W - (mx.max() - mx.min()) - 8) // 2 * 2
ch = int(min(H - (my.max() - my.min()) - 8, cw * 9 / 16)) // 2 * 2
cw = int(ch * 16 / 9) // 2 * 2
x0 = (W - cw) / 2 - (mx.max() + mx.min()) / 2
y0 = (H - ch) / 2 - (my.max() + my.min()) / 2
print(f"frames {len(fr)} drift x {mx.min():.0f}..{mx.max():.0f} y {my.min():.0f}..{my.max():.0f} crop {cw}x{ch}")
# crop each frame at (x0 + shift) via a per-frame expression
xs = ",".join(f"{max(0, min(W - cw, x0 + mx[i])):.1f}" for i in range(len(mx)))
ys = ",".join(f"{max(0, min(H - ch, y0 + my[i])):.1f}" for i in range(len(my)))
xexpr = "+".join(f"eq(n,{i})*{v}" for i, v in enumerate(xs.split(",")))
yexpr = "+".join(f"eq(n,{i})*{v}" for i, v in enumerate(ys.split(",")))
open("/tmp/stab-x.txt", "w").write(xexpr)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-vf", f"crop={cw}:{ch}:'{xexpr}':'{yexpr}',scale=1920:1080:flags=lanczos", "-c:v", "libx264", "-crf", "14", dst], check=True)
