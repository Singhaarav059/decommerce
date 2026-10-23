"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { Counter, KraftBox, Laptop, OliveTree, PosTerminal, Shelf, Slab, useKit } from "@/three/kit";
import { StoreLight } from "@/three/StoreLight";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";

const GAP = 2.6;
const SWATCHES = ["#e6ddcf", "#69714e", "#c2602a", "#17150f", "#c9b8a0", "#a8835c"];

function Plinth({ children, x }: { children: React.ReactNode; x: number }) {
  const k = useKit();
  return (
    <group position={[x, 0, 0]}>
      <Slab size={[2, 0.14, 2]} material={k.terrazzo} position={[0, -0.14, 0]} radius={0.03} />
      <Slab size={[1.84, 0.2, 1.84]} material={k.travertine} position={[0, -0.34, 0]} radius={0.05} />
      <Slab size={[2, 1.2, 0.08]} material={k.travertine} position={[0, 0, -0.96]} radius={0.01} />
      {children}
    </group>
  );
}

/**
 * Chapter 9, how we work: four small rooms in a row (discover, design, build,
 * launch); the camera dollies past them with scroll. bus.progress 0–1.
 */
export default function RoomsScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const size = useThree((s) => s.size);
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const p = useRef(0);
  const shelfBoxes = useRef<(THREE.Group | null)[]>([]);
  const lights = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    p.current = bus.reduced ? bus.progress : p.current + (bus.progress - p.current) * (1 - Math.exp(-5 * dt));
    const t = p.current;
    const x = t * GAP * 3;
    const aspect = size.width / Math.max(1, size.height);
    const far = aspect < 1 ? 1.5 : 1;
    if (cam.current) {
      cam.current.position.set(x + 1.6 * far, 1.9 * far, 3.6 * far);
      cam.current.lookAt(x, 0.45, 0);
      cam.current.setViewOffset(size.width, size.height, aspect >= 1 ? -size.width * 0.18 : 0, aspect < 1 ? -size.height * 0.12 : 0, size.width, size.height);
    }
    // build room: boxes stack onto the shelf as the camera arrives
    const build = THREE.MathUtils.smoothstep(t, 0.45, 0.7);
    shelfBoxes.current.forEach((g, i) => {
      if (!g) return;
      const a = Math.min(1, Math.max(0, build * 4 - i));
      g.scale.setScalar(0.001 + a);
      g.visible = a > 0.01;
    });
    if (lights.current) lights.current.visible = t > 0.88;
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={30} />
      <StoreLight />
      {/* 01 discover: a desk with the laptop and a pinned map of channels */}
      <Plinth x={0}>
        <Slab size={[1, 0.04, 0.55]} material={k.oak} position={[0, 0.66, -0.2]} radius={0.01} />
        {[-0.45, 0.45].map((sx) => (
          <mesh key={sx} position={[sx, 0.33, -0.2]} material={k.steel}>
            <boxGeometry args={[0.03, 0.66, 0.5]} />
          </mesh>
        ))}
        <Laptop position={[-0.15, 0.7, -0.15]} rotation={[0, 0.3, 0]} />
        {[-0.5, -0.1, 0.3, 0.6].map((x2, i) => (
          <Slab key={x2} size={[0.24, 0.17, 0.01]} material={i === 2 ? k.copperMatte : k.paper} position={[x2, 0.85 + (i % 2) * 0.12, -0.9]} radius={0.004} />
        ))}
      </Plinth>
      {/* 02 design: swatch tiles on a drafting table */}
      <Plinth x={GAP}>
        <Slab size={[1.1, 0.04, 0.6]} material={k.stone} position={[0, 0.7, -0.1]} radius={0.01} rotation={[0.1, 0, 0]} />
        {SWATCHES.map((c, i) => (
          <Slab key={c} size={[0.16, 0.012, 0.16]} material={k.paper} position={[-0.42 + i * 0.17, 0.76, -0.05 + (i % 2) * 0.1]} radius={0.004}>
            <meshStandardMaterial color={c} roughness={0.7} />
          </Slab>
        ))}
        <OliveTree position={[0.7, 0, -0.55]} height={1.05} seed={4} />
      </Plinth>
      {/* 03 build: shelving filling with stock */}
      <Plinth x={GAP * 2}>
        <Shelf w={1.3} h={1.1} d={0.4} levels={3} position={[0, 0, -0.55]} />
        {[
          [-0.38, 0.12],
          [0.02, 0.12],
          [0.4, 0.12],
          [-0.18, 0.61],
        ].map(([bx, by], i) => (
          <group key={i} ref={(el) => void (shelfBoxes.current[i] = el)} position={[bx, by + 0.03, -0.55]}>
            <KraftBox size={[0.3, 0.22, 0.3]} />
          </group>
        ))}
      </Plinth>
      {/* 04 launch: the counter, lit and open */}
      <Plinth x={GAP * 3}>
        <Counter w={1.2} position={[0, 0, -0.1]} />
        <PosTerminal position={[0.25, 0.62, -0.12]} rotation={[0, -0.2, 0]} />
        <mesh ref={lights} position={[0, 1.05, -0.9]} material={k.lightOn}>
          <boxGeometry args={[1.6, 0.03, 0.03]} />
        </mesh>
      </Plinth>
    </>
  );
}
