"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { themes } from "@/content/themes";
import { order } from "@/content/home";
import { Counter, KraftBox, Laptop, OliveTree, useKit, Slab } from "@/three/kit";
import { StoreLight } from "@/three/StoreLight";
import { drawnTexture, fonts } from "@/three/textures";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";

/** Paint a storefront home page in the given theme; `build` 0..1 reveals blocks in order. */
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

/**
 * Storefront chapter: a laptop on the shop counter whose screen builds a store
 * page from blocks, then re-skins to whichever theme is chosen on the rack
 * (bus.step = theme index, bus.focus = "lifted" while trying one on).
 */
export default function LaptopScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const size = useThree((s) => s.size);
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const laptop = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const screen = useMemo(() => drawnTexture(1024, 640, (g, w, h) => paintSite(g, w, h, 0, 0)), []);
  const state = useRef({ build: 0, theme: -1, shownBuild: -1, open: 0.2, flash: 0 });

  useEffect(() => () => screen.texture.dispose(), [screen]);

  useFrame((st, dt) => {
    const s = state.current;
    s.open = THREE.MathUtils.damp(s.open, 1, bus.reduced ? 100 : 3, dt);
    s.build = Math.min(1, s.build + dt * (bus.reduced ? 100 : 0.55) * (s.open > 0.9 ? 1 : 0));
    const theme = bus.step;
    if (theme !== s.theme) {
      s.flash = s.theme < 0 ? 0 : 1;
      s.theme = theme;
      s.shownBuild = -1;
    }
    s.flash = Math.max(0, s.flash - dt * 2.4);
    const b = Math.min(s.build, 1 - s.flash * 0.6);
    if (Math.abs(b - s.shownBuild) > 0.004) {
      screen.repaint((g, w, h) => paintSite(g, w, h, theme, b));
      s.shownBuild = b;
    }
    lid.current?.rotation.set(-Math.PI / 2 + s.open * (Math.PI / 2 + 0.28), 0, 0);
    if (laptop.current) {
      const lifted = bus.focus === "lifted";
      laptop.current.rotation.y = THREE.MathUtils.damp(laptop.current.rotation.y, (lifted ? -0.05 : 0.18) + st.pointer.x * 0.05, 3, dt);
    }
    if (cam.current) {
      const aspect = size.width / Math.max(1, size.height);
      const z = aspect < 1 ? 1.9 : 1.32;
      cam.current.position.set(0.42, 1.12, z);
      cam.current.lookAt(0, 0.86, -0.06);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={28} />
      <StoreLight />
      <Slab size={[4, 0.05, 3]} material={k.terrazzo} position={[0, -0.05, -0.6]} radius={0.01} />
      <Counter w={1.7} d={0.7} h={0.66} position={[0, 0, 0]} />
      <group ref={laptop} position={[0, 0.66, 0.02]}>
        <Laptop screen={screen.texture} open={0.2} lidRef={lid} />
      </group>
      <KraftBox size={[0.24, 0.15, 0.2]} position={[-0.6, 0.66, 0.05]} rotation={[0, 0.4, 0]} />
      <OliveTree position={[0.95, 0, -0.55]} height={1.5} seed={8} />
    </>
  );
}
