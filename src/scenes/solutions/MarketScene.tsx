"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { KraftBox, Slab, Ticket, useKit } from "@/three/kit";
import { StoreLight } from "@/three/StoreLight";
import { drawnTexture, fonts } from "@/three/textures";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";
import { useRig, type Anchors, type View } from "./rig";

const CHANNELS = ["A", "B", "C", "D"];
const SHELVES: [number, number, number, number][] = [
  [-1.35, 1.0, -1.0, 0.45],
  [-0.45, 1.35, -1.2, 0.15],
  [0.45, 1.35, -1.2, -0.15],
  [1.35, 1.0, -1.0, -0.45],
];
const VIEWS: View[] = [
  { pos: [0, 2.0, 4.3], target: [0, 0.85, -0.5] },
  { pos: [0.6, 1.25, 1.6], target: [0, 0.72, 0] },
  { pos: [-2.0, 1.8, 2.3], target: [-0.8, 1.05, -1.0] },
  { pos: [2.3, 1.5, 2.1], target: [1.3, 0.5, 0.6] },
];
const ANCHORS: Anchors = {
  box: [0, 0.9, 0],
  shelf: [-1.35, 1.32, -1.0],
  badge: [0.45, 1.85, -1.2],
  queue: [1.35, 0.55, 0.7],
};

function badge(letter: string) {
  return drawnTexture(128, 128, (g, w, h) => {
    g.fillStyle = "#17150f";
    g.beginPath();
    g.arc(w / 2, h / 2, w / 2 - 4, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#f5f2ed";
    g.font = `400 70px ${fonts.serif()}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(letter, w / 2, h / 2 + 4);
  }).texture;
}

/**
 * Marketplace: one master listing (the box on the plinth) copied onto a shelf
 * per channel, with generic channel badges (no third-party logos). Broken:
 * only one channel listed. Fixed / live: every switched-on channel holds it.
 */
export default function MarketScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const { state, camera, part } = useRig(bus, VIEWS, ANCHORS);
  const copies = useRef<(THREE.Group | null)[]>([]);
  const badges = useMemo(() => CHANNELS.map(badge), []);
  const live = useRef(CHANNELS.map(() => 0));

  useFrame((_, dt) => {
    const { fixed, value } = state.current;
    const mask = bus.mode === "live" ? Math.round(bus.value) : 15;
    void value;
    copies.current.forEach((g, i) => {
      if (!g) return;
      const on = bus.mode === "scrub" ? (i === 1 ? 1 : THREE.MathUtils.smoothstep(fixed, 0.35 + i * 0.12, 0.55 + i * 0.12)) : (mask >> i) & 1;
      live.current[i] = THREE.MathUtils.damp(live.current[i], on, 8, dt);
      g.scale.setScalar(0.001 + live.current[i]);
      g.visible = live.current[i] > 0.01;
    });
  });

  return (
    <>
      {camera}
      <StoreLight />
      <Slab size={[6, 0.05, 4]} material={k.terrazzo} position={[0, -0.05, 0]} radius={0.01} />
      <Slab size={[6, 2.6, 0.1]} material={k.travertine} position={[0, 0, -1.45]} radius={0.01} />
      <group ref={part("box")}>
        <Slab size={[0.5, 0.56, 0.5]} material={k.stone} radius={0.03} />
        <KraftBox size={[0.3, 0.22, 0.26]} position={[0, 0.56, 0]} rotation={[0, 0.5, 0]} />
        <Slab size={[0.305, 0.03, 0.04]} material={k.copper} radius={0.005} position={[0, 0.66, 0]} rotation={[0, 0.5, 0]} />
      </group>
      {SHELVES.map(([x, y, z, ry], i) => (
        <group key={i} position={[x, y, z]} rotation={[0, ry, 0]}>
          <group ref={i === 0 ? part("shelf") : undefined}>
            <Slab size={[0.7, 0.04, 0.34]} material={k.oak} radius={0.008} />
            <group ref={(el) => void (copies.current[i] = el)} position={[0, 0.04, 0]}>
              <KraftBox size={[0.24, 0.18, 0.21]} rotation={[0, 0.3, 0]} />
            </group>
          </group>
          <group ref={i === 2 ? part("badge") : undefined} position={[0, 0.5, -0.1]}>
            <mesh>
              <circleGeometry args={[0.1, 32]} />
              <meshBasicMaterial map={badges[i]} toneMapped={false} />
            </mesh>
          </group>
        </group>
      ))}
      {/* one order queue: tickets on a rail */}
      <group ref={part("queue")} position={[1.35, 0, 0.7]}>
        <Slab size={[0.9, 0.05, 0.3]} material={k.steel} radius={0.01} position={[0, 0.3, 0]} />
        {[-0.3, -0.1, 0.1, 0.3].map((tx) => (
          <Ticket key={tx} position={[tx, 0.45, 0]} rotation={[-0.2, 0, 0]} scale={0.6} />
        ))}
      </group>
    </>
  );
}
