"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { KraftBox, Slab, useKit } from "@/three/kit";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";
import { Room, useProgress } from "./shared";

const ITEMS = [
  { size: [0.16, 0.1, 0.12] as [number, number, number], color: "#d9cfbf" },
  { size: [0.12, 0.16, 0.1] as [number, number, number], color: "#69714e" },
  { size: [0.18, 0.06, 0.14] as [number, number, number], color: "#c2602a" },
];

/** Self-checkout: items pass the scanner one by one and drop into a kraft bag. */
export default function KioskScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const p = useProgress(bus);
  const items = useRef<(THREE.Group | null)[]>([]);
  const beam = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const t = p.current;
    let scanning = false;
    items.current.forEach((g, i) => {
      if (!g) return;
      const a = 0.12 + i * 0.25;
      const local = Math.min(1, Math.max(0, (t - a) / 0.22));
      // over the scanner (0–0.5), then arc into the bag (0.5–1)
      const x = local < 0.5 ? THREE.MathUtils.lerp(-0.55, -0.05, local / 0.5) : THREE.MathUtils.lerp(-0.05, 0.48, (local - 0.5) / 0.5);
      const arc = local < 0.5 ? 0 : Math.sin(((local - 0.5) / 0.5) * Math.PI) * 0.18;
      const y = local < 0.5 ? 0.96 : THREE.MathUtils.lerp(0.96, 0.72 + i * 0.05, (local - 0.5) / 0.5) + arc;
      g.position.set(x, y, 0.1);
      g.rotation.y = local * 0.8;
      if (local > 0.3 && local < 0.55) scanning = true;
    });
    if (beam.current) beam.current.visible = scanning;
  });

  return (
    <>
      <Room camera={[1.0, 1.7, 2.5]} target={[0, 0.8, 0]} />
      {/* kiosk body + screen */}
      <Slab size={[1.3, 0.92, 0.55]} material={k.stone} radius={0.03} />
      <Slab size={[1.34, 0.04, 0.6]} material={k.travertine} radius={0.01} position={[0, 0.92, 0]} />
      <group position={[-0.35, 0.96, -0.18]} rotation={[-0.35, 0.15, 0]}>
        <Slab size={[0.42, 0.3, 0.03]} material={k.ink} radius={0.015} />
        <mesh position={[0, 0.15, 0.016]}>
          <planeGeometry args={[0.38, 0.26]} />
          <meshBasicMaterial color="#e9e3d8" toneMapped={false} />
        </mesh>
      </group>
      {/* scanner window */}
      <Slab size={[0.3, 0.008, 0.24]} material={k.inkMatte} radius={0.004} position={[-0.05, 0.96, 0.1]} />
      <mesh ref={beam} position={[-0.05, 0.975, 0.1]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[0.26, 0.02]} />
        <meshBasicMaterial color="#c2602a" toneMapped={false} transparent opacity={0.8} />
      </mesh>
      {/* open kraft bag */}
      <group position={[0.48, 0.96, 0.1]}>
        <KraftBox size={[0.32, 0.36, 0.2]} taped={false} position={[0, -0.24, 0]} />
      </group>
      {ITEMS.map((it, i) => (
        <group key={i} ref={(el) => void (items.current[i] = el)} position={[-0.55, 0.96, 0.1]}>
          <Slab size={it.size} material={k.linen} radius={0.015}>
            <meshStandardMaterial color={it.color} roughness={0.8} />
          </Slab>
        </group>
      ))}
    </>
  );
}
