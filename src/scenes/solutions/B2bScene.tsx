"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { KraftBox, Laptop, Slab, useKit } from "@/three/kit";
import { StoreLight } from "@/three/StoreLight";
import { drawnTexture, fonts } from "@/three/textures";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";
import { useRig, type Anchors, type View } from "./rig";

const VIEWS: View[] = [
  { pos: [2.9, 2.5, 3.8], target: [0, 0.6, 0] },
  { pos: [1.0, 1.15, 1.65], target: [0.9, 0.88, 0.35] },
  { pos: [-1.1, 1.7, 2.5], target: [-0.6, 0.6, -0.3] },
  { pos: [2.3, 1.45, 1.3], target: [0.9, 0.8, 0.4] },
];
const ANCHORS: Anchors = {
  portal: [0.9, 1.08, 0.28],
  tiers: [1.06, 0.97, 0.31],
  pallets: [-0.7, 1.15, -0.3],
  pad: [0.45, 0.8, 0.6],
};
const TIERS = [
  { range: "24–99 units", price: "List price" },
  { range: "100–399 units", price: "Tier 2 · −8%" },
  { range: "400+ units", price: "Tier 3 · −15%" },
];
const tierFor = (v: number) => (v < 0.09 ? 0 : v < 0.4 ? 1 : 2);

function paintPortal(g: CanvasRenderingContext2D, w: number, h: number, tier: number, qty: number) {
  g.fillStyle = "#f5f2ed";
  g.fillRect(0, 0, w, h);
  g.fillStyle = "#17150f";
  g.font = `400 30px ${fonts.serif()}`;
  g.fillText("Buyer portal", 30, 50);
  g.font = `400 16px ${fonts.mono()}`;
  g.fillStyle = "#6f695d";
  g.fillText("TRADE ACCOUNT · ILLUSTRATIVE", 30, 80);
  g.fillStyle = "#17150f";
  g.font = `500 20px ${fonts.sans()}`;
  g.fillText(`Linen overshirt × ${qty}`, 30, 130);
  TIERS.forEach((t, i) => {
    const y = 160 + i * 62;
    g.fillStyle = i === tier ? "#17150f" : "#e6ddcf";
    g.fillRect(30, y, w - 60, 50);
    g.fillStyle = i === tier ? "#f5f2ed" : "#17150f";
    g.font = `400 19px ${fonts.sans()}`;
    g.fillText(t.range, 46, y + 32);
    g.fillStyle = i === tier ? "#e9a27a" : "#9a4718";
    g.fillText(t.price, w - 230, y + 32);
  });
}

/**
 * B2B: a wholesale stockroom. Broken: a paper order pad on the desk. Fixed:
 * the buyer portal with tiered prices. Live: the quantity slider grows the
 * pallet stacks and moves the price tier.
 */
export default function B2bScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const { state, camera, part } = useRig(bus, VIEWS, ANCHORS);
  const layers = useRef<(THREE.Group | null)[]>([]);
  const pad = useRef<THREE.Group>(null);
  const laptop = useRef<THREE.Group>(null);
  const portal = useMemo(() => drawnTexture(720, 450, (g, w, h) => paintPortal(g, w, h, 1, 120)), []);
  const shown = useRef({ tier: -1, qty: -1 });

  useFrame(() => {
    const { fixed, value } = state.current;
    const v = bus.mode === "live" ? value : 0.35;
    const qty = Math.round(24 + v * 936);
    const tier = tierFor(v);
    if (tier !== shown.current.tier || Math.abs(qty - shown.current.qty) > 4) {
      portal.repaint((g, w, h) => paintPortal(g, w, h, tier, qty));
      shown.current = { tier, qty };
    }
    const stack = 1 + v * 5;
    layers.current.forEach((g, i) => {
      if (!g) return;
      const layer = i % 6;
      const a = Math.min(1, Math.max(0, stack - layer));
      g.scale.set(1, 0.001 + a, 1);
      g.visible = a > 0.01;
    });
    if (pad.current) pad.current.visible = fixed < 0.5;
    if (laptop.current) {
      laptop.current.scale.setScalar(0.001 + THREE.MathUtils.smoothstep(fixed, 0.4, 0.9));
      laptop.current.visible = fixed > 0.4;
    }
  });

  return (
    <>
      {camera}
      <StoreLight />
      <Slab size={[7, 0.05, 5]} material={k.terrazzo} position={[0, -0.05, 0]} radius={0.01} />
      <Slab size={[7, 2.4, 0.1]} material={k.travertine} position={[0, 0, -1.4]} radius={0.01} />
      {/* three pallets of kraft boxes */}
      <group ref={part("pallets")}>
        {[-1.6, -0.7, 0.2].map((x, pi) => (
          <group key={x} position={[x, 0, -0.5]}>
            <Slab size={[0.8, 0.12, 0.8]} material={k.oak} radius={0.01} />
            {Array.from({ length: 6 }, (_, layer) => (
              <group key={layer} ref={(el) => void (layers.current[pi * 6 + layer] = el)} position={[0, 0.12 + layer * 0.2, 0]}>
                {[-0.19, 0.19].map((bx) =>
                  [-0.19, 0.19].map((bz) => <KraftBox key={`${bx}${bz}`} size={[0.36, 0.19, 0.36]} position={[bx, 0, bz]} taped={layer % 2 === 0} />),
                )}
              </group>
            ))}
          </group>
        ))}
      </group>
      {/* desk with paper pad (broken) or the buyer portal (fixed) */}
      <Slab size={[1.3, 0.04, 0.7]} material={k.oak} position={[0.75, 0.72, 0.45]} radius={0.01} />
      {[-0.58, 0.58].map((dx) =>
        [-0.28, 0.28].map((dz) => (
          <mesh key={`${dx}${dz}`} position={[0.75 + dx, 0.36, 0.45 + dz]} material={k.steel}>
            <cylinderGeometry args={[0.014, 0.014, 0.72, 8]} />
          </mesh>
        )),
      )}
      <group ref={pad} position={[0.45, 0.76, 0.6]} rotation={[0, 0.3, 0]}>
        <group ref={part("pad")}>
          <Slab size={[0.24, 0.012, 0.32]} material={k.paper} radius={0.004} />
          <Slab size={[0.09, 0.02, 0.03]} material={k.steel} radius={0.005} position={[0, 0.012, -0.15]} />
        </group>
      </group>
      <group ref={laptop} position={[0.95, 0.76, 0.42]} rotation={[0, -0.25, 0]}>
        <group ref={part("portal")}>
          <Laptop screen={portal.texture} />
        </group>
      </group>
    </>
  );
}
