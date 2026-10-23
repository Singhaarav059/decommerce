"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clips } from "@/content/media";
import { themes } from "@/content/themes";
import { Slab, useKit } from "@/three/kit";
import { StoreLight } from "@/three/StoreLight";
import { drawnTexture, fonts } from "@/three/textures";
import { useAsset } from "@/three/useAsset";
import { VideoPlane } from "@/three/VideoPlane";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";
import { useRig, type Anchors, type View } from "./rig";

const GARMENTS = ["linen", "olive", "ink", "stone"] as const;
const VIEWS: View[] = [
  { pos: [1.5, 1.5, 2.9], target: [0, 0.95, 0] },
  { pos: [0.85, 1.25, 1.05], target: [0.55, 1.05, 0.2] },
  { pos: [-0.6, 1.4, 1.9], target: [-0.35, 1.0, -0.3] },
  { pos: [2.3, 1.3, 2.0], target: [0.4, 0.9, 0] },
];
const ANCHORS: Anchors = {
  tablet: [0.55, 1.2, 0.26],
  rack: [-0.35, 1.68, -0.3],
  sizes: [0.64, 1.04, 0.27],
  look: [0.46, 0.96, 0.27],
};

function paintTablet(g: CanvasRenderingContext2D, w: number, h: number, profile: number, mask: number) {
  g.fillStyle = "#f5f2ed";
  g.fillRect(0, 0, w, h);
  if (profile < 0.5) {
    g.fillStyle = "#17150f";
    g.font = `400 54px ${fonts.serif()}`;
    g.fillText("Hello.", 40, h / 2);
    g.font = `400 18px ${fonts.sans()}`;
    g.fillStyle = "#6f695d";
    g.fillText("No customer selected", 40, h / 2 + 40);
    return;
  }
  g.fillStyle = "#17150f";
  g.font = `400 34px ${fonts.serif()}`;
  g.fillText("Welcome back", 30, 54);
  g.font = `400 15px ${fonts.mono()}`;
  g.fillStyle = "#6f695d";
  g.fillText("CUSTOMER PROFILE · ILLUSTRATIVE", 30, 82);
  g.fillStyle = "#17150f";
  g.font = `500 18px ${fonts.sans()}`;
  g.fillText("Sizes", 30, 124);
  g.font = `400 18px ${fonts.sans()}`;
  g.fillText("Shirts M · Knit M · Coats 38", 30, 150);
  g.font = `500 18px ${fonts.sans()}`;
  g.fillText("Last bought", 30, 192);
  g.font = `400 18px ${fonts.sans()}`;
  g.fillText("Linen overshirt, sand · Olive knit", 30, 218);
  g.font = `500 18px ${fonts.sans()}`;
  g.fillText("Today's look", 30, 262);
  GARMENTS.forEach((key, i) => {
    const on = (mask >> i) & 1;
    const t = themes.find((x) => x.key === key)!;
    g.fillStyle = on ? t.swatch : "#e6ddcf";
    g.fillRect(30 + i * 90, 280, 74, 74);
    if (!on) {
      g.strokeStyle = "#c9b8a0";
      g.strokeRect(30.5 + i * 90, 280.5, 73, 73);
    }
  });
}

/**
 * Clienteling: an associate with a tablet beside a rail. Broken: the tablet
 * says a generic hello. Fixed: the customer's profile, sizes and purchases.
 * Live: garments toggled on the rail join "today's look" on the tablet.
 */
export default function ClientScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const { state, camera, part } = useRig(bus, VIEWS, ANCHORS);
  const { nodes } = useAsset("/assets/models/rack.glb") as unknown as { nodes: Record<string, THREE.Object3D> };
  const items = useMemo(() => GARMENTS.map((key) => ({ garment: nodes[`garment_${key}`].clone(true), hanger: nodes.hanger.clone(true) })), [nodes]);
  const hangers = useRef<(THREE.Group | null)[]>([]);
  const tablet = useMemo(() => drawnTexture(560, 380, (g, w, h) => paintTablet(g, w, h, 0, 0)), []);
  const shown = useRef({ profile: -1, mask: -1 });

  useFrame((_, dt) => {
    const { fixed } = state.current;
    const profile = bus.mode === "scrub" ? fixed : 1;
    const mask = bus.mode === "live" ? Math.round(bus.value) : 3;
    const p = profile > 0.5 ? 1 : 0;
    if (p !== shown.current.profile || mask !== shown.current.mask) {
      tablet.repaint((g, w, h) => paintTablet(g, w, h, p, mask));
      shown.current = { profile: p, mask };
    }
    hangers.current.forEach((g, i) => {
      if (!g) return;
      const on = (mask >> i) & 1;
      g.position.z = THREE.MathUtils.damp(g.position.z, on ? 0.12 : 0, 8, dt);
    });
  });

  return (
    <>
      {camera}
      <StoreLight />
      <Slab size={[6, 0.05, 4]} material={k.terrazzo} position={[0, -0.05, 0]} radius={0.01} />
      <Slab size={[6, 2.6, 0.1]} material={k.travertine} position={[0, 0, -0.9]} radius={0.01} />
      <group ref={part("rack")} position={[-0.35, 0, -0.3]}>
        {[-0.65, 0.65].map((x) => (
          <mesh key={x} position={[x, 0.8, 0]} material={k.steel}>
            <cylinderGeometry args={[0.014, 0.014, 1.6, 10]} />
          </mesh>
        ))}
        <mesh position={[0, 1.6, 0]} rotation={[0, 0, Math.PI / 2]} material={k.steel}>
          <cylinderGeometry args={[0.014, 0.014, 1.32, 10]} />
        </mesh>
        {items.map((it, i) => (
          <group key={i} ref={(el) => void (hangers.current[i] = el)} position={[-0.45 + i * 0.3, 1.6, 0]}>
            <group scale={0.75}>
              <primitive object={it.hanger} />
              <primitive object={it.garment} />
            </group>
          </group>
        ))}
      </group>
      {/* tablet on a stand next to the associate */}
      <group position={[0.55, 0, 0.2]}>
        <mesh position={[0, 0.45, 0]} material={k.steel}>
          <cylinderGeometry args={[0.015, 0.05, 0.9, 10]} />
        </mesh>
        <group ref={part("tablet")} position={[0, 1.0, 0.03]} rotation={[-0.35, -0.25, 0]}>
          <Slab size={[0.34, 0.24, 0.02]} material={k.ink} radius={0.015} position={[0, -0.12, 0]} />
          <mesh position={[0, 0, 0.011]}>
            <planeGeometry args={[0.31, 0.21]} />
            <meshBasicMaterial map={tablet.texture} toneMapped={false} />
          </mesh>
        </group>
      </group>
      <group position={[1.0, 0.68, -0.1]}>
        <VideoPlane clip={clips.walker} height={1.36} />
      </group>
    </>
  );
}
