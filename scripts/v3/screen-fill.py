# Replace a locked-off clip's monitor content with tiles that fill in one by one (Veo morphs screen
# content). Tiles come from the end still, the empty screen from the start still; each frame's screen is
# aligned to the clip by phase correlation and matched in brightness.
# python3 scripts/v3/screen-fill.py <clip> <start.png> <end.png> <out.mp4>
import glob, os, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageFilter
clip, s_path, e_path, out = sys.argv[1:5]
d = tempfile.mkdtemp()
subprocess.run(["ffmpeg", "-loglevel", "error", "-i", clip, f"{d}/f_%04d.png"], stdin=subprocess.DEVNULL, check=True)
frames = sorted(glob.glob(f"{d}/f_*.png"))
W, H = Image.open(frames[0]).size
start = np.asarray(Image.open(s_path).convert("RGB").resize((W, H), Image.LANCZOS)).astype(np.float32)
end = np.asarray(Image.open(e_path).convert("RGB").resize((W, H), Image.LANCZOS)).astype(np.float32)
k = W / 2752
screen = [int(v * k) for v in (1725, 452, 2368, 895)]  # x0 y0 x1 y1, in still pixels → clip pixels
tiles = [(2145, 465, 2300, 655), (1805, 690, 1975, 880), (1980, 680, 2145, 870), (2150, 675, 2310, 865)]  # tiles 3-6 fill in
tiles = [[int(v * k) for v in t] for t in tiles]

def mask(box, pad=6, blur=4):
    m = Image.new("L", (W, H), 0)
    m.paste(255, (box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad))
    return np.asarray(m.filter(ImageFilter.GaussianBlur(blur))).astype(np.float32)[..., None] / 255

scr = mask(screen, pad=0, blur=1.5)
tm = [mask(t) for t in tiles]
x0, y0, x1, y1 = screen
ref = start[y0 - 40:y1 + 40, x0 - 40:x1 + 40].mean(axis=2)

def shift(img):
    a = img[y0 - 40:y1 + 40, x0 - 40:x1 + 40].mean(axis=2)
    F = np.fft.fft2(ref - ref.mean()) * np.conj(np.fft.fft2(a - a.mean()))
    r = np.fft.ifft2(F / (np.abs(F) + 1e-6)).real
    dy, dx = np.unravel_index(r.argmax(), r.shape)
    return (dy if dy < r.shape[0] / 2 else dy - r.shape[0]), (dx if dx < r.shape[1] / 2 else dx - r.shape[1])

n = len(frames)
for i, f in enumerate(frames):
    fr = np.asarray(Image.open(f).convert("RGB")).astype(np.float32)
    t = i / (n - 1)
    comp = start.copy()
    for j, m in enumerate(tm):  # tiles land between 15% and 85% of the clip, each fading in over ~0.06
        a = np.clip((t - (0.15 + j * 0.18)) / 0.06, 0, 1)
        comp = comp * (1 - m * a) + end * (m * a)
    dy, dx = shift(fr)
    comp = np.roll(comp, (-dy, -dx), axis=(0, 1))
    sm = np.roll(scr, (-dy, -dx), axis=(0, 1))
    sel = sm[..., 0] > 0.9
    gain = fr[sel].mean(axis=0) / np.maximum(comp[sel].mean(axis=0), 1)
    comp = np.clip(comp * gain, 0, 255)
    Image.fromarray((fr * (1 - sm) + comp * sm).astype(np.uint8)).save(f)
    if i % 40 == 0: print(i, "shift", dy, dx, "gain", np.round(gain, 3))
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-framerate", "24", "-i", f"{d}/f_%04d.png", "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", out], stdin=subprocess.DEVNULL, check=True)
print("wrote", out, n, "frames")
