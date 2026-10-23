"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { themes } from "@/content/themes";
import { Slab, useKit } from "@/three/kit";
import { paintSite } from "@/three/screens";
import { StoreLight } from "@/three/StoreLight";
import { drawnTexture, fonts, rng } from "@/three/textures";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";
import { useRig, type Anchors, type View } from "./rig";

const SPACING = 0.78;
const VIEWS: View[] = [
  { pos: [0, 1.2, 3.0], target: [0, 1.05, 0] },
  { pos: [-1.6, 1.3, 2.7], target: [-0.5, 1.15, 0] },
  { pos: [0.25, 1.2, 1.45], target: [0.25, 1.2, 0] },
  { pos: [2.1, 1.05, 2.6], target: [0.8, 0.75, 0.5] },
];
const ANCHORS: Anchors = {
  frame: [0, 1.48, 0.06],
  label: [0.78, 0.74, 0.06],
  wall: [-2.4, 2.05, 0],
  bench: [0.7, 0.52, 1.0],
};

function labelTexture(name: string, status: string) {
  return drawnTexture(256, 96, (g, w, h) => {
    g.fillStyle = "#fbf8f2";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#17150f";
    g.font = `500 26px ${fonts.sans()}`;
    g.fillText(name, 16, 40);
    g.fillStyle = status === "Live" ? "#69714e" : "#9a4718";
    g.font = `400 18px ${fonts.mono()}`;
    g.fillText(status.toUpperCase(), 16, 74);
  }).texture;
}

/**
 * Brand showcase: storefront themes as framed pictures on a travertine wall.
 * Broken: frames scattered and tilted. Fixed: one curated row. Live: the
 * slider slides the wall.
 */
export default function ShowcaseScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const { state, camera, part } = useRig(bus, VIEWS, ANCHORS);
  const wall = useRef<THREE.Group>(null);
  const frames = useRef<(THREE.Group | null)[]>([]);

  const items = useMemo(() => {
    const r = rng(31);
    return themes.map((t, i) => ({
      key: t.key,
      screen: drawnTexture(640, 400, (g, w, h) => paintSite(g, w, h, i, 1)).texture,
      label: labelTexture(t.name, i % 3 === 1 ? "Draft" : "Live"),
      x: (i - (themes.length - 1) / 2) * SPACING,
      mess: { x: (r() - 0.5) * 0.5, y: (r() - 0.5) * 0.7, rz: (r() - 0.5) * 0.5, z: r() * 0.2 },
    }));
  }, []);

  useFrame(() => {
    const { fixed, value } = state.current;
    if (wall.current) wall.current.position.x = bus.mode === "live" ? -(value - 0.5) * SPACING * 4 : 0;
    frames.current.forEach((g, i) => {
      if (!g) return;
      const m = items[i].mess;
      const u = 1 - fixed;
      g.position.set(items[i].x + m.x * u, 1.25 + m.y * u, 0.05 + m.z * u);
      g.rotation.z = m.rz * u;
    });
  });

  return (
    <>
      {camera}
      <StoreLight />
      <Slab size={[9, 0.05, 4]} material={k.terrazzo} position={[0, -0.05, 1]} radius={0.01} />
      <group ref={part("wall")}>
        <Slab size={[9, 2.6, 0.1]} material={k.travertine} position={[0, 0, -0.06]} radius={0.01} />
      </group>
      <group ref={wall}>
        {items.map((it, i) => (
          <group key={it.key}>
            <group ref={(el) => void (frames.current[i] = el)}>
              <group ref={i === 3 ? part("frame") : undefined}>
                <Slab size={[0.66, 0.44, 0.04]} material={k.oak} radius={0.008} position={[0, -0.22, 0]} />
                <mesh position={[0, 0, 0.021]}>
                  <planeGeometry args={[0.6, 0.38]} />
                  <meshBasicMaterial map={it.screen} toneMapped={false} />
                </mesh>
              </group>
            </group>
            <group ref={i === 4 ? part("label") : undefined} position={[it.x, 0.74, 0.03]}>
              <mesh>
                <planeGeometry args={[0.24, 0.09]} />
                <meshStandardMaterial map={it.label} roughness={0.9} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
      <group ref={part("bench")} position={[0.7, 0, 1.0]}>
        <Slab size={[1.4, 0.42, 0.42]} material={k.stone} radius={0.04} />
      </group>
    </>
  );
}
