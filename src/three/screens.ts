"use client";

import { order } from "@/content/home";
import { themes } from "@/content/themes";
import { fonts } from "./textures";

// 2D canvas painters for in-scene screens (laptops, tablets, frames).

export /** Paint a storefront home page in the given theme; `build` 0..1 reveals blocks in order. */
function paintSite(g: CanvasRenderingContext2D, w: number, h: number, themeIndex: number, build: number) {
  const t = themes[themeIndex];
  const { bg, ink, accent } = t.preview;
  g.fillStyle = "#e9e3d8";
  g.fillRect(0, 0, w, h);
  const show = (i: number, n = 6) => Math.max(0, Math.min(1, build * n - i));
  const block = (i: number, draw: () => void) => {
    const a = show(i);
    if (a <= 0) return;
    g.save();
    g.globalAlpha = a;
    g.translate(0, (1 - a) * 14);
    draw();
    g.restore();
  };
  block(0, () => {
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
    g.fillStyle = ink;
    g.font = `400 30px ${fonts.serif()}`;
    g.fillText("your brand.", 32, 46);
    g.font = `400 15px ${fonts.sans()}`;
    ["New in", "Shirts", "Knitwear", "Stores"].forEach((l, i) => g.fillText(l, w - 330 + i * 80, 44));
  });
  block(1, () => {
    g.fillStyle = t.swatch;
    g.fillRect(32, 78, w * 0.56, h * 0.6);
    g.fillStyle = "rgba(255,255,255,0.18)";
    g.fillRect(32 + w * 0.12, 78 + h * 0.08, w * 0.32, h * 0.44);
  });
  block(2, () => {
    g.fillStyle = ink;
    g.font = `400 46px ${fonts.serif()}`;
    g.fillText(order.item.split(" ")[0], w * 0.64, 140);
    g.fillText(order.item.split(" ")[1], w * 0.64, 190);
  });
  block(3, () => {
    g.fillStyle = ink;
    g.globalAlpha *= 0.65;
    g.font = `400 17px ${fonts.sans()}`;
    g.fillText(`Size ${order.size} · 5 in stock`, w * 0.64, 232);
  });
  block(4, () => {
    g.fillStyle = accent;
    g.fillRect(w * 0.64, 262, 190, 50);
    g.fillStyle = t.key === "ink" ? "#17150f" : bg;
    g.font = `500 17px ${fonts.sans()}`;
    g.fillText("Add to bag", w * 0.64 + 50, 293);
  });
  block(5, () => {
    for (let i = 0; i < 4; i++) {
      g.fillStyle = themes[(themeIndex + i + 1) % themes.length].swatch;
      g.fillRect(32 + i * ((w - 64) / 4), h * 0.78, (w - 64) / 4 - 14, h * 0.18);
    }
  });
}
