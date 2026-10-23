"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Slab, Van, useKit } from "@/three/kit";
import { StoreLight } from "@/three/StoreLight";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";
import { useRig, type Anchors, type View } from "./rig";

const BAY = new THREE.Vector3(-2.1, 0, 0);
const STOPS = [
  new THREE.Vector3(-1.0, 0, -1.0),
  new THREE.Vector3(0.3, 0, -1.3),
  new THREE.Vector3(1.6, 0, -0.8),
  new THREE.Vector3(1.7, 0, 0.6),
  new THREE.Vector3(0.4, 0, 1.1),
  new THREE.Vector3(-0.9, 0, 0.9),
];
// tangled: the order the stops were taken in before planning
const TANGLED = [0, 3, 1, 5, 2, 4];
const VIEWS: View[] = [
  { pos: [2.6, 5.0, 4.6], target: [0, 0, 0] },
  { pos: [0, 8.2, 0.01], target: [0, 0, 0] },
  { pos: [-1.2, 1.5, 1.9], target: [-2.0, 0.35, 0] },
  { pos: [2.4, 2.4, 3.0], target: [0.6, 0.2, 0.3] },
];

function routeGeometry(order: number[], closed: boolean) {
  const pts = [BAY.clone(), ...order.map((i) => STOPS[i].clone()), ...(closed ? [BAY.clone()] : [])].map((p) => p.setY(0.04));
  const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.15);
  return { curve, geo: new THREE.TubeGeometry(curve, 300, 0.022, 6, false) };
}

/**
 * TMS: a top-down route map. Broken: the day's stops taken in a tangled order.
 * Fixed: one optimised loop from the loading bay. Live: the slider scrubs the
 * delivery day and the van follows the route.
 */
export default function TmsScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const van = useRef<THREE.Group>(null);
  const tangledMesh = useRef<THREE.Mesh>(null);
  const cleanMesh = useRef<THREE.Mesh>(null);
  const vanPos = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const tangled = useMemo(() => routeGeometry(TANGLED, false), []);
  const clean = useMemo(() => routeGeometry([0, 1, 2, 3, 4, 5], true), []);
  const anchors = useMemo<Anchors>(
    () => ({ bay: [BAY.x, 0.75, BAY.z], van: () => vanPos.clone().setY(0.55), route: [0.95, 0.1, -1.1], stop: [1.7, 0.45, 0.6] }),
    [vanPos],
  );
  const { state, camera, part } = useRig(bus, VIEWS, anchors);
  const tangledMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#9ea4a6", toneMapped: false }), []);

  useFrame(() => {
    const { fixed, value } = state.current;
    const f = bus.mode === "scrub" ? fixed : 1;
    const untangle = THREE.MathUtils.smoothstep(f, 0.35, 0.6);
    const draw = THREE.MathUtils.smoothstep(f, 0.55, 0.95);
    if (tangledMesh.current) tangledMesh.current.visible = untangle < 0.99;
    tangled.geo.setDrawRange(0, Math.floor((tangled.geo.index?.count ?? 0) * (1 - untangle)));
    const cleanCount = clean.geo.index?.count ?? 0;
    clean.geo.setDrawRange(0, Math.floor(cleanCount * (bus.mode === "scrub" ? draw : 1)));
    if (cleanMesh.current) cleanMesh.current.visible = f > 0.5;
    const u = bus.mode === "live" ? value : bus.mode === "scrub" ? draw : 0.35;
    const curve = clean.curve;
    curve.getPointAt(Math.min(0.995, u), vanPos);
    curve.getPointAt(Math.min(1, u + 0.005), ahead);
    if (van.current) {
      van.current.position.copy(vanPos);
      van.current.rotation.y = Math.atan2(-(ahead.z - vanPos.z), ahead.x - vanPos.x);
    }
  });

  return (
    <>
      {camera}
      <StoreLight />
      <Slab size={[6.2, 0.1, 4.2]} material={k.terrazzo} position={[0, -0.1, 0]} radius={0.04} />
      <Slab size={[5.9, 0.18, 3.9]} material={k.travertine} position={[0, -0.28, 0]} radius={0.06} />
      <group ref={part("bay")} position={BAY}>
        <Slab size={[0.7, 0.55, 0.9]} material={k.stone} radius={0.03} position={[-0.3, 0, 0]} />
        <Slab size={[0.04, 0.4, 0.5]} material={k.copperMatte} radius={0.01} position={[0.06, 0, 0]} />
      </group>
      {STOPS.map((s, i) => (
        <group key={i} position={s} ref={i === 3 ? part("stop") : undefined}>
          <Slab size={[0.26, 0.2, 0.26]} material={k.stone} radius={0.02} />
          <mesh position={[0, 0.28, 0]} rotation={[0, Math.PI / 4, 0]} material={k.copperMatte}>
            <coneGeometry args={[0.2, 0.14, 4]} />
          </mesh>
        </group>
      ))}
      <mesh ref={tangledMesh} geometry={tangled.geo} material={tangledMat} />
      <group ref={part("route")}>
        <mesh ref={cleanMesh} geometry={clean.geo} material={k.lightOn} />
      </group>
      <group ref={van} scale={0.42}>
        <group ref={part("van")}>
          <Van />
        </group>
      </group>
    </>
  );
}
