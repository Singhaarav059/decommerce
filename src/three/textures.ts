"use client";

import * as THREE from "three";

// Procedural textures for the store world, drawn once on 2D canvases and
// cached. Cheaper than shipping image textures and always on-palette.

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const cache = new Map<string, THREE.Texture>();

function canvasTexture(key: string, size: number, draw: (g: CanvasRenderingContext2D, size: number) => void, repeat = 1) {
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 4;
  cache.set(key, t);
  return t;
}

/** Travertine ground with chips of terrazzo, steel, olive and the odd copper fleck. */
export function terrazzoTexture(repeat = 1) {
  return canvasTexture(`terrazzo-${repeat}`, 512, (g, n) => {
    g.fillStyle = "#e3d9ca";
    g.fillRect(0, 0, n, n);
    const r = rng(7);
    const chips: [string, number, number][] = [
      ["#c9b8a0", 900, 5],
      ["#b7a68e", 500, 4],
      ["#9ea4a6", 260, 3.5],
      ["#69714e", 90, 3],
      ["#c2602a", 40, 2.5],
      ["#4a463d", 70, 2],
      ["#f5f2ed", 300, 3],
    ];
    for (const [color, count, maxR] of chips) {
      g.fillStyle = color;
      for (let i = 0; i < count; i++) {
        const x = r() * n;
        const y = r() * n;
        const rad = 0.8 + r() * maxR;
        const sides = 4 + Math.floor(r() * 4);
        g.beginPath();
        for (let k = 0; k < sides; k++) {
          const a = (k / sides) * Math.PI * 2 + r();
          const rr = rad * (0.6 + r() * 0.6);
          g[k ? "lineTo" : "moveTo"](x + Math.cos(a) * rr, y + Math.sin(a) * rr);
        }
        g.fill();
      }
    }
  }, repeat);
}

/** Travertine: warm stone with soft horizontal bands and pores. */
export function travertineTexture(repeat = 1) {
  return canvasTexture(`travertine-${repeat}`, 512, (g, n) => {
    g.fillStyle = "#e6ddcf";
    g.fillRect(0, 0, n, n);
    const r = rng(11);
    for (let i = 0; i < 46; i++) {
      const y = r() * n;
      g.fillStyle = r() > 0.5 ? "rgba(201,184,160,0.22)" : "rgba(245,242,237,0.35)";
      g.fillRect(0, y, n, 1 + r() * 5);
    }
    g.fillStyle = "rgba(160,140,115,0.35)";
    for (let i = 0; i < 260; i++) {
      g.beginPath();
      g.ellipse(r() * n, r() * n, 0.6 + r() * 2.6, 0.4 + r() * 0.8, 0, 0, Math.PI * 2);
      g.fill();
    }
  }, repeat);
}

/** Unbleached kraft paper. */
export function kraftTexture() {
  return canvasTexture("kraft", 256, (g, n) => {
    g.fillStyle = "#b08a5e";
    g.fillRect(0, 0, n, n);
    const r = rng(3);
    for (let i = 0; i < 1600; i++) {
      g.fillStyle = r() > 0.5 ? "rgba(90,60,30,0.10)" : "rgba(230,205,170,0.12)";
      g.fillRect(r() * n, r() * n, 1 + r() * 6, 1);
    }
  });
}

/** Brushed metal streaks (used as roughness variation via map tint). */
export function brushedTexture() {
  return canvasTexture("brushed", 256, (g, n) => {
    g.fillStyle = "#b9bec0";
    g.fillRect(0, 0, n, n);
    const r = rng(5);
    for (let i = 0; i < 500; i++) {
      g.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.08)" : "rgba(60,64,66,0.08)";
      g.fillRect(0, r() * n, n, 1);
    }
  });
}

/**
 * A screen or paper surface drawn with 2D canvas calls. Re-draw by calling
 * the returned `paint` with new state; the texture updates on the next frame.
 */
export function drawnTexture(w: number, h: number, paint: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const repaint = (fn = paint) => {
    g.clearRect(0, 0, w, h);
    fn(g, w, h);
    tex.needsUpdate = true;
  };
  repaint();
  return { texture: tex, repaint };
}

// next/font hashes family names, so read the real ones from the CSS variables.
function family(variable: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return v ? `${v}, ${fallback}` : fallback;
}
export const fonts = {
  sans: () => family("--font-geist-sans", "ui-sans-serif, system-ui, sans-serif"),
  mono: () => family("--font-geist-mono", "ui-monospace, monospace"),
  serif: () => family("--font-instrument-serif", "Georgia, serif"),
};
