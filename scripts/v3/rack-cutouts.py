"""Key the magenta background off each rack garment, clean pink spill, crop to the
hanger, normalise placement (hook at the top centre) and export WebP with alpha."""
import glob, os
import numpy as np
from PIL import Image

OUT = "public/assets/rack"
W, H = 600, 800
for p in sorted(glob.glob("assets-src/stills/rack/*.png")):
    im = np.asarray(Image.open(p).convert("RGB")).astype(np.float32)
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    # magenta-ness: red and blue high, green low
    m = np.clip(((np.minimum(r, b) - g) - 40) / 70, 0, 1)
    alpha = 1 - m
    # spill: where red and blue both exceed green near edges, pull them toward green
    spill = np.clip(np.minimum(r, b) - g, 0, None) * (alpha < 0.999)
    out = im.copy()
    k = np.clip(spill / 120, 0, 1)[..., None]
    grey = np.stack([np.maximum(g, (r + b) / 2 - spill * 0.6)] * 3, -1)
    out = out * (1 - k) + grey * k
    rgba = np.dstack([np.clip(out, 0, 255), alpha * 255]).astype(np.uint8)
    img = Image.fromarray(rgba, "RGBA")
    bbox = img.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox()
    img = img.crop(bbox)
    # fit: height 92 % of canvas, hook at the top, centred horizontally
    s = min(H * 0.94 / img.height, W * 0.96 / img.width)
    img = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    canvas.paste(img, ((W - img.width) // 2, 0), img)
    name = os.path.splitext(os.path.basename(p))[0]
    canvas.save(f"{OUT}/{name}.webp", "WEBP", quality=82, method=6)
    print(name, os.path.getsize(f"{OUT}/{name}.webp") // 1024, "KB")
