"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Counter, KraftBox, Laptop, OliveTree, useKit, Slab } from "@/three/kit";
import { StoreLight } from "@/three/StoreLight";
import { drawnTexture } from "@/three/textures";
import { paintSite } from "@/three/screens";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";
import { useRig, type Anchors, type View } from "../solutions/rig";

const START_THEME = 2;
const VIEWS: View[] = [
  { pos: [0.42, 1.12, 1.32], target: [0, 0.86, -0.06] },
  { pos: [0.1, 1.0, 0.78], target: [0, 0.88, -0.1] },
  { pos: [-0.75, 1.2, 1.0], target: [0, 0.8, 0] },
  { pos: [0.85, 1.0, 0.85], target: [0, 0.82, -0.05] },
];
const ANCHORS: Anchors = {
  screen: [0.05, 1.08, -0.16],
  theme: [-0.18, 1.15, -0.17],
  stock: [0.14, 0.95, -0.14],
  counter: [-0.55, 0.42, 0.36],
};

/**
 * Storefront chapter: a laptop on the shop counter whose screen builds a store
 * page from blocks, then re-skins to whichever theme is chosen on the rack
 * (bus.step = theme index, bus.focus = "lifted" while trying one on).
 */
export default function LaptopScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const rig = useRig(bus, VIEWS, ANCHORS, { fov: 28, portraitFar: 1.44 });
  const laptop = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const screen = useMemo(() => drawnTexture(1024, 640, (g, w, h) => paintSite(g, w, h, 0, 0)), []);
  const state = useRef({ build: 0, theme: -1, shownBuild: -1, open: 0.2, flash: 0 });

  useEffect(() => () => screen.texture.dispose(), [screen]);

  useFrame((st, dt) => {
    const s = state.current;
    s.open = THREE.MathUtils.damp(s.open, 1, bus.reduced ? 100 : 3, dt);
    s.build = Math.min(1, s.build + dt * (bus.reduced ? 100 : 0.55) * (s.open > 0.9 ? 1 : 0));
    // live: builds on its own and follows the rack; scrub: scroll builds it; inside: finished
    const theme = bus.mode === "live" ? bus.step : START_THEME;
    const build = bus.mode === "live" ? s.build : bus.mode === "scrub" ? rig.state.current.fixed : 1;
    if (theme !== s.theme) {
      s.flash = s.theme < 0 ? 0 : 1;
      s.theme = theme;
      s.shownBuild = -1;
    }
    s.flash = Math.max(0, s.flash - dt * 2.4);
    const b = Math.min(build, 1 - s.flash * 0.6);
    if (Math.abs(b - s.shownBuild) > 0.004) {
      screen.repaint((g, w, h) => paintSite(g, w, h, theme, b));
      s.shownBuild = b;
    }
    lid.current?.rotation.set(-Math.PI / 2 + s.open * (Math.PI / 2 + 0.28), 0, 0);
    if (laptop.current) {
      const lifted = bus.focus === "lifted";
      laptop.current.rotation.y = THREE.MathUtils.damp(laptop.current.rotation.y, (lifted ? -0.05 : 0.18) + st.pointer.x * 0.05, 3, dt);
    }
  });

  return (
    <>
      {rig.camera}
      <StoreLight />
      <Slab size={[4, 0.05, 3]} material={k.terrazzo} position={[0, -0.05, -0.6]} radius={0.01} />
      <group ref={rig.part("counter")}>
        <Counter w={1.7} d={0.7} h={0.66} position={[0, 0, 0]} />
      </group>
      <group ref={laptop} position={[0, 0.66, 0.02]}>
        <group ref={rig.part("screen")}>
          <Laptop screen={screen.texture} open={0.2} lidRef={lid} />
        </group>
      </group>
      <KraftBox size={[0.24, 0.15, 0.2]} position={[-0.6, 0.66, 0.05]} rotation={[0, 0.4, 0]} />
      <OliveTree position={[0.95, 0, -0.55]} height={1.5} seed={8} />
    </>
  );
}
