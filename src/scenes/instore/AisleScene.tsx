"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Slab, useKit } from "@/three/kit";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";
import { Room, useProgress } from "./shared";

const ss = THREE.MathUtils.smoothstep;
const SECTIONS = 7;
const COLORS = ["#d9cfbf", "#69714e", "#25221c", "#c9b8a0", "#a8835c"];

/** Endless aisle: a short shelf with a gap in size M that extends into depth. */
export default function AisleScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const p = useProgress(bus);
  const sections = useRef<(THREE.Group | null)[]>([]);
  const gap = useRef<THREE.Mesh>(null);

  useFrame((st) => {
    const t = p.current;
    const extend = ss(t, 0.2, 0.85);
    sections.current.forEach((g, i) => {
      if (!g) return;
      if (i === 0) return;
      const show = Math.min(1, Math.max(0, extend * SECTIONS - (i - 1)));
      g.position.z = -i * 0.9 * show;
      g.scale.setScalar(0.001 + show);
      g.visible = show > 0.01;
    });
    if (gap.current) {
      const m = gap.current.material as THREE.MeshBasicMaterial;
      m.opacity = (1 - extend) * (0.55 + 0.35 * Math.sin(st.clock.elapsedTime * 4));
    }
  });

  return (
    <>
      <Room camera={[1.7, 1.45, 2.3]} target={[0, 0.7, -1.2]} fov={32} />
      {Array.from({ length: SECTIONS }, (_, i) => (
        <group key={i} ref={(el) => void (sections.current[i] = el)}>
          <Slab size={[1.4, 0.04, 0.5]} material={k.oak} position={[0, 0.45, 0]} radius={0.008} />
          <Slab size={[1.4, 0.04, 0.5]} material={k.oak} position={[0, 0.95, 0]} radius={0.008} />
          {[-0.68, 0.68].map((x) =>
            [-0.22, 0.22].map((z) => (
              <mesh key={`${x}${z}`} position={[x, 0.6, z]} material={k.steel}>
                <boxGeometry args={[0.025, 1.2, 0.025]} />
              </mesh>
            )),
          )}
          {/* folded shirts, size M missing on the first section */}
          {[0.49, 0.99].map((y, row) =>
            Array.from({ length: 5 }, (_, j) =>
              i === 0 && row === 0 && j === 2 ? null : (
                <Slab key={`${row}${j}`} size={[0.22, 0.12, 0.3]} material={k.linen} position={[-0.5 + j * 0.25, y, 0]} radius={0.02}>
                  <meshStandardMaterial color={COLORS[(i + j + row) % COLORS.length]} roughness={0.9} />
                </Slab>
              ),
            ),
          )}
        </group>
      ))}
      <mesh ref={gap} position={[0, 0.56, 0.16]}>
        <planeGeometry args={[0.22, 0.14]} />
        <meshBasicMaterial color="#c2602a" transparent opacity={0.6} toneMapped={false} />
      </mesh>
    </>
  );
}
