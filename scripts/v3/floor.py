# Mean colour of a scene's floor strip, lightened toward warm travertine until ink text on it
# has a contrast of at least 10:1 and copper (#74320f) at least 4.5:1 (relative luminance >= 0.50). Prints #rrggbb.
# python3 scripts/v3/floor.py <image> <focus_x 0-1> <crop_aspect w/h>
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert("RGB"); W, H = im.size
fx, a = float(sys.argv[2]), float(sys.argv[3])
cw = int(H * a); x = max(0, min(W - cw, int(W * fx - cw / 2)))
c = im.crop((x, int(H * 0.94), x + cw, H)).resize((1, 1), Image.BOX).getpixel((0, 0))
lin = lambda v: (v / 255) / 12.92 if v <= 10 else ((v / 255 + 0.055) / 1.055) ** 2.4
lum = lambda p: 0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2])
light = (0xef, 0xe7, 0xde)
base, t = c, 0.0
while lum(c) < 0.50 and t < 1:
    t += 0.02
    c = tuple(round(b + (l - b) * t) for b, l in zip(base, light))
print("#%02x%02x%02x" % c)
