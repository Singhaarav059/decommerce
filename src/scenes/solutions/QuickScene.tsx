"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { KraftBox, Shelf, Slab, useKit } from "@/three/kit";
import { StoreLight } from "@/three/StoreLight";
import { rng } from "@/three/textures";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";
import { useRig, type Anchors, type View } from "./rig";

const ROUTE = new THREE.CatmullRomCurve3(
  [new THREE.Vector3(-0.6, 0, 0.55), new THREE.Vector3(0.4, 0, 0.6), new THREE.Vector3(1.0, 0, 0.2), new THREE.Vector3(1.6, 0, 0.45), new THREE.Vector3(2.0, 0, 0.95)],
  false,
  "catmullrom",
  0.3,
);
const VIEWS: View[] = [
  { pos: [3.0, 3.4, 4.6], target: [0.5, 0.3, 0] },
  { pos: [0.6, 7.2, 2.2], target: [0.6, 0, 0.1] },
  { pos: [-1.0, 1.4, 1.7], target: [-1.4, 0.75, -0.35] },
  { pos: [2.1, 1.2, 2.2], target: [1.0, 0.25, 0.55] },
];

/** Scooter with a copper delivery box, facing +x. */
function Scooter() {
  const k = useKit();
  return (
    <group>
      <Slab size={[0.3, 0.06, 0.1]} material={k.inkMatte} radius={0.02} position={[0, 0.06, 0]} />
      <Slab size={[0.16, 0.14, 0.16]} material={k.copperMatte} radius={0.02} position={[-0.08, 0.12, 0]} />
      <mesh position={[0.13, 0.17, 0]} rotation={[0, 0, -0.3]} material={k.steel}>
        <cylinderGeometry args={[0.008, 0.008, 0.22, 6]} />
      </mesh>
      {[-0.12, 0.13].map((x) => (
        <mesh key={x} position={[x, 0.045, 0]} rotation={[Math.PI / 2, 0, 0]} material={k.rubber}>
          <cylinderGeometry args={[0.045, 0.045, 0.03, 16]} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Quick commerce: a dark store's shelves on one side, a city block on the
 * other, a rider between. Broken: the rider waits at the store (45 min).
 * Fixed / live: the rider travels the route (slider = position).
 */
export default function QuickScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const rider = useRef<THREE.Group>(null);
  const riderPos = useMemo(() => new THREE.Vector3(), []);
  const anchors = useMemo<Anchors>(
    () => ({
      shelves: [-1.4, 1.35, -0.4],
      rider: () => riderPos.clone().setY(0.45),
      timer: [2.15, 0.9, 1.05],
      block: [1.4, 0.55, -0.65],
    }),
    [riderPos],
  );
  const { state, camera, part } = useRig(bus, VIEWS, anchors);
  const ahead = useMemo(() => new THREE.Vector3(), []);

  const blocks = useMemo(() => {
    const r = rng(41);
    const out: { x: number; z: number; h: number; w: number }[] = [];
    for (let gx = 0; gx < 4; gx++) for (let gz = 0; gz < 3; gz++) if (r() > 0.25) out.push({ x: 0.5 + gx * 0.55, z: -0.9 + gz * 0.42 - (gz === 2 ? 1.0 : 0), h: 0.12 + r() * 0.35, w: 0.32 + r() * 0.1 });
    return out;
  }, []);
  const road = useMemo(() => new THREE.TubeGeometry(ROUTE, 80, 0.16, 4, false), []);

  useFrame(() => {
    const { fixed, value } = state.current;
    const u = Math.min(0.995, bus.mode === "live" ? value : bus.mode === "scrub" ? THREE.MathUtils.smoothstep(fixed, 0.3, 1) : 0.6);
    ROUTE.getPointAt(u, riderPos);
    ROUTE.getPointAt(Math.min(1, u + 0.01), ahead);
    if (rider.current) {
      rider.current.position.copy(riderPos);
      rider.current.rotation.y = Math.atan2(-(ahead.z - riderPos.z), ahead.x - riderPos.x);
    }
  });

  return (
    <>
      {camera}
      <StoreLight />
      <Slab size={[6.4, 0.08, 4]} material={k.terrazzo} position={[0.2, -0.08, 0]} radius={0.02} />
      <mesh geometry={road} position={[0, -0.13, 0]} scale={[1, 0.9, 1]}>
        <meshStandardMaterial color="#d3c8b7" roughness={0.9} />
      </mesh>
      {/* dark store: closed box with open front, shelves inside */}
      <group position={[-1.5, 0, -0.35]}>
        <Slab size={[1.6, 1.5, 0.08]} material={k.travertine} position={[0, 0, -0.42]} radius={0.01} />
        <Slab size={[0.08, 1.5, 0.9]} material={k.travertine} position={[-0.8, 0, 0]} radius={0.01} />
        <group ref={part("shelves")}>
          <Shelf w={1.3} h={1.3} d={0.36} levels={4} position={[0.05, 0, -0.2]}>
            {[0.12, 0.49, 0.86].map((y) =>
              [-0.42, -0.1, 0.22, 0.5].map((x) => <KraftBox key={`${x}${y}`} size={[0.22, 0.16, 0.24]} position={[x, y + 0.03, 0]} />),
            )}
          </Shelf>
        </group>
      </group>
      <group ref={part("block")}>
        {blocks.map((b, i) => (
          <Slab key={i} size={[b.w, b.h, b.w]} material={i % 3 ? k.travertine : k.stone} position={[b.x, 0, b.z]} radius={0.015} />
        ))}
      </group>
      {/* the customer's door */}
      <group position={[2.25, 0, 1.15]}>
        <Slab size={[0.5, 0.55, 0.4]} material={k.stone} radius={0.02} />
        <Slab size={[0.16, 0.32, 0.01]} material={k.copperMatte} radius={0.004} position={[-0.08, 0.02, 0.2]} />
      </group>
      <group ref={rider}>
        <group ref={part("rider")}>
          <Scooter />
        </group>
      </group>
    </>
  );
}
