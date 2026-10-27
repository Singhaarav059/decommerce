# Face audit: for each clip, sample frames, detect faces, crop them, compare skin tone to the face in the
# clip's first frame (the approved keyframe), and tile the crops with the drift written under each.
# python3 scripts/v7/faceaudit.py out.jpg fps clip.mp4 [clip.mp4 ...]
# Needs the macOS Vision face detector built once: swiftc -O scripts/v7/facedetect.swift -o scripts/v7/facedetect
import sys, os, subprocess, tempfile, glob
import cv2, numpy as np
from PIL import Image, ImageDraw
out, fps, clips = sys.argv[1], float(sys.argv[2]), sys.argv[3:]
DET = os.path.join(os.path.dirname(os.path.abspath(__file__)), "facedetect")
S = 120
def detect(paths):
    # macOS Vision face detector (facedetect.swift): "path x y w h" per face
    res = {p: [] for p in paths}
    out = subprocess.run([DET, *paths], capture_output=True, text=True).stdout
    for line in out.splitlines():
        p, x, y, w, h = line.rsplit(" ", 4)
        res[p].append(tuple(int(v) for v in (x, y, w, h)))
    return {p: sorted(v) for p, v in res.items()}
def tone(img, f):
    x, y, w, h = f
    core = img[y + int(h * 0.45): y + int(h * 0.75), x + int(w * 0.3): x + int(w * 0.7)]
    return cv2.cvtColor(core, cv2.COLOR_BGR2LAB).reshape(-1, 3).mean(0) if core.size else np.zeros(3)
rows = []
for clip in clips:
    tmp = tempfile.mkdtemp()
    subprocess.run(["ffmpeg", "-v", "error", "-i", clip, "-vf", f"fps={fps}", f"{tmp}/%03d.png"], check=True)
    frames = sorted(glob.glob(f"{tmp}/*.png"))
    found = detect(frames)
    refs = []; crops = []; score = []
    for i, fp in enumerate(frames):
        img = cv2.imread(fp)
        for f in found[fp]:
            t = tone(img, f)
            if i == 0 or not refs: refs.append((f[0] + f[2] / 2, t))
            ref = min(refs, key=lambda r: abs(r[0] - (f[0] + f[2] / 2)))[1]
            dL = t[0] - ref[0]
            score.append(dL)
            x, y, w, h = f; m = int(w * 0.25)
            c = img[max(0, y - m): y + h + m, max(0, x - m): x + w + m]
            pil = Image.fromarray(cv2.cvtColor(c, cv2.COLOR_BGR2RGB)).resize((S, S))
            d = ImageDraw.Draw(pil); d.rectangle((0, S - 16, S, S), fill=(255, 255, 255)); d.text((3, S - 15), f"{i / fps:.1f}s L{dL:+.0f}", fill=(200, 0, 0) if abs(dL) > 12 else (0, 0, 0))
            crops.append(pil)
    name = os.path.basename(clip).replace("v7-", "").replace(".mp4", "")
    drops = [d for d in score]
    print(f"SCORE {name}: worst {min(drops, default=0):+.0f}, faces darker than -20: {sum(d < -20 for d in drops)} of {len(drops)}")
    per = 14
    for k in range(0, max(1, len(crops)), per):
        row = Image.new("RGB", (S * per + 110, S), "white")
        ImageDraw.Draw(row).text((4, 4), name if k == 0 else "", fill=(0, 0, 0))
        for j, c in enumerate(crops[k:k + per]): row.paste(c, (110 + j * S, 0))
        rows.append(row)
    print(name, len(frames), "frames", len(crops), "faces")
sheet = Image.new("RGB", (max(r.size[0] for r in rows), sum(r.size[1] + 4 for r in rows)), "white")
y = 0
for r in rows: sheet.paste(r, (0, y)); y += r.size[1] + 4
sheet.save(out, quality=85)
