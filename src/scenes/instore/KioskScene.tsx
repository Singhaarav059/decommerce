"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { KraftBox, Slab, useKit } from "@/three/kit";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";
import { clips } from "@/content/media";
import { VideoPlane } from "@/three/VideoPlane";
import { Room, phase } from "./shared";
import { useRig, type Anchors, type View } from "../solutions/rig";

const ITEMS = [
  { size: [0.16, 0.1, 0.12] as [number, number, number], color: "#d9cfbf" },
  { size: [0.12, 0.16, 0.1] as [number, number, number], color: "#69714e" },
  { size: [0.18, 0.06, 0.14] as [number, number, number], color: "#c2602a" },
];

const VIEWS: View[] = [
  { pos: [1.0, 1.7, 2.5], target: [0, 0.8, 0] },
  { pos: [-0.2, 1.4, 1.4], target: [-0.35, 1.05, -0.18] },
  { pos: [1.7, 1.5, 1.7], target: [0.3, 0.9, 0] },
  { pos: [0.4, 1.3, 1.15], target: [-0.05, 0.98, 0.1] },
];
const ANCHORS: Anchors = {
  screen: [-0.35, 1.18, -0.18],
  scanner: [-0.05, 0.99, 0.12],
  bag: [0.48, 0.98, 0.1],
  items: [-0.55, 1.08, 0.1],
};
const QUEUE: [number, number, number][] = [
  [-1.0, 0.62, 0.9],
  [-1.45, 0.62, 1.35],
  [-1.9, 0.62, 1.8],
];

/** Self-checkout: a queue (broken), then items pass the scanner and drop into a kraft bag. Live: the slider scans. */
export default function KioskScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const rig = useRig(bus, VIEWS, ANCHORS);
  const queue = useRef<THREE.Group>(null);
  const items = useRef<(THREE.Group | null)[]>([]);
  const beam = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const { fixed, value } = rig.state.current;
    const t = phase(bus.mode, fixed, value, true);
    if (queue.current) queue.current.visible = bus.mode === "scrub" && t < 0.1;
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
      {rig.camera}
      <Room />
      <group ref={queue}>
        {QUEUE.map((q, i) => (
          <group key={i} position={q}>
            <VideoPlane clip={clips.walker} height={1.25} />
          </group>
        ))}
      </group>
      {/* kiosk body + screen */}
      <Slab size={[1.3, 0.92, 0.55]} material={k.stone} radius={0.03} />
      <Slab size={[1.34, 0.04, 0.6]} material={k.travertine} radius={0.01} position={[0, 0.92, 0]} />
      <group ref={rig.part("screen")} position={[-0.35, 0.96, -0.18]} rotation={[-0.35, 0.15, 0]}>
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
      <group ref={rig.part("bag")} position={[0.48, 0.96, 0.1]}>
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
