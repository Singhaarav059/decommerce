"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { Conveyor, KraftBox, OliveTree, Slab, Van, useKit } from "@/three/kit";
import { StoreLight } from "@/three/StoreLight";
import { rng } from "@/three/textures";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";

const ss = THREE.MathUtils.smoothstep;
const lerp = THREE.MathUtils.lerp;

// The van's route: out of the store bay, along the high street, round the
// corner and up to the customer's door.
const ROUTE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-3.4, 0, 0.0),
    new THREE.Vector3(-1.5, 0, 0.0),
    new THREE.Vector3(0.8, 0, 0.0),
    new THREE.Vector3(2.4, 0, 0.3),
    new THREE.Vector3(2.9, 0, 1.6),
    new THREE.Vector3(2.95, 0, 2.6),
  ],
  false,
  "catmullrom",
  0.3,
);
const DOOR = new THREE.Vector3(3.55, 0, 2.75);

/** Flat strip of `width` along a curve at height y; `dash` (0–1) leaves gaps for a dashed line. */
function ribbon(curve: THREE.Curve<THREE.Vector3>, width: number, y: number, dash = 0) {
  const steps = 240;
  const pos: number[] = [];
  const idx: number[] = [];
  const p = new THREE.Vector3();
  const t = new THREE.Vector3();
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    curve.getPointAt(u, p);
    curve.getTangentAt(u, t);
    const nx = -t.z;
    const nz = t.x;
    const len = Math.hypot(nx, nz) || 1;
    pos.push(p.x + (nx / len) * width * 0.5, y, p.z + (nz / len) * width * 0.5, p.x - (nx / len) * width * 0.5, y, p.z - (nz / len) * width * 0.5);
    if (i < steps && (!dash || Math.floor(i / 6) % 2 === 0)) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/**
 * Chapter 7 film, rendered to frames by scripts/capture-sequence.mjs:
 * the box rides the conveyor into the van, the van crosses the miniature city
 * and the box is left at the customer's door. bus.progress = film time.
 */
export default function DeliveryScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const size = useThree((s) => s.size);
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const van = useRef<THREE.Group>(null);
  const box = useRef<THREE.Group>(null);
  const p = useRef(0);
  const look = useMemo(() => new THREE.Vector3(), []);
  const camPos = useMemo(() => new THREE.Vector3(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const ahead = useMemo(() => new THREE.Vector3(), []);

  const blocks = useMemo(() => {
    const r = rng(23);
    const out: { x: number; z: number; w: number; d: number; h: number; m: number }[] = [];
    for (let gx = -7; gx <= 7; gx++) {
      for (let gz = -5; gz <= 5; gz++) {
        const x = gx * 0.9 + 0.1;
        const z = gz * 0.9 + 0.45;
        const onRoad = Math.abs(z) < 0.75 || (x > 1.9 && x < 3.9 && z > -0.6 && z < 3.6);
        const nearDoor = Math.hypot(x - DOOR.x, z - DOOR.z) < 0.9;
        const nearStore = x < -2.6 && x > -5.4 && z < 0.2 && z > -1.9;
        if (onRoad || nearDoor || nearStore || r() < 0.3) continue;
        out.push({ x, z, w: 0.42 + r() * 0.14, d: 0.42 + r() * 0.14, h: 0.08 + r() * 0.26, m: r() > 0.72 ? 1 : 0 });
      }
    }
    return out;
  }, []);

  // flat road ribbon along the route, with a dashed centre line
  const road = useMemo(() => ribbon(ROUTE, 0.78, 0.004), []);
  const dashes = useMemo(() => ribbon(ROUTE, 0.035, 0.007, 0.5), []);

  useFrame((_, dt) => {
    p.current = bus.reduced ? bus.progress : p.current + (bus.progress - p.current) * (1 - Math.exp(-6 * dt));
    const t = p.current;
    const load = ss(t, 0.0, 0.24); // box along the conveyor into the van
    const drive = ss(t, 0.26, 0.78); // van along the route
    const drop = ss(t, 0.82, 0.96); // box set down at the door

    const u = Math.min(0.999, drive);
    ROUTE.getPointAt(u, tmp);
    ROUTE.getPointAt(Math.min(1, u + 0.002), ahead);
    if (van.current) {
      van.current.position.copy(tmp);
      van.current.rotation.y = Math.atan2(-(ahead.z - tmp.z), ahead.x - tmp.x);
    }

    if (box.current) {
      if (t < 0.25) {
        // on the conveyor, moving from the store bay to the van's back door
        box.current.visible = true;
        box.current.position.set(lerp(-4.9, -3.95, load), 0.43, -0.05);
      } else if (t < 0.82) {
        box.current.visible = false;
      } else {
        box.current.visible = true;
        box.current.position.set(lerp(tmp.x + 0.25, DOOR.x + 0.02, drop), lerp(0.35, 0.05, drop), lerp(tmp.z, DOOR.z + 0.08, drop));
      }
    }

    // camera follows the action from up and to the side
    const aspect = size.width / Math.max(1, size.height);
    const far = aspect < 1 ? 1.6 : 1;
    const end = t > 0.8;
    const focus = t < 0.25 ? look.set(-4.2, 0.4, -0.2) : end ? look.set(DOOR.x - 0.25, 0.3, DOOR.z - 0.1) : look.copy(tmp).setY(0.3);
    const height = t < 0.25 ? 2.6 : end ? 2.0 : 3.6;
    camPos.set(focus.x + (end ? 1.6 : 2.8) * far, height * far, focus.z + (end ? 3.4 : 4.2) * far);
    if (cam.current) {
      if (bus.reduced) cam.current.position.copy(camPos);
      else cam.current.position.lerp(camPos, 1 - Math.exp(-4 * dt));
      cam.current.lookAt(focus);
    }
    bus.tick();
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={30} position={[0, 4, 6]} />
      <StoreLight />
      <Slab size={[14, 0.1, 10]} material={k.terrazzo} position={[0, -0.1, 0.4]} radius={0.02} />
      <mesh geometry={road}>
        <meshStandardMaterial color="#d3c8b7" roughness={0.9} />
      </mesh>
      <mesh geometry={dashes}>
        <meshStandardMaterial color="#f5f2ed" roughness={0.8} />
      </mesh>
      {blocks.map((b, i) => (
        <Slab key={i} size={[b.w, b.h, b.d]} material={b.m ? k.stone : k.travertine} position={[b.x, 0, b.z]} radius={0.02} />
      ))}
      {/* store bay with copper awning */}
      <group position={[-4.6, 0, -0.9]}>
        <Slab size={[1.6, 1.1, 0.9]} material={k.travertine} radius={0.03} />
        <Slab size={[1.7, 0.05, 0.35]} material={k.copper} radius={0.01} position={[0, 0.9, 0.6]} />
        <Slab size={[0.6, 0.7, 0.02]} material={k.inkMatte} radius={0.01} position={[0.3, 0, 0.46]} />
      </group>
      <Conveyor length={1.3} width={0.42} position={[-4.45, 0, -0.05]} />
      <group ref={box}>
        <KraftBox size={[0.3, 0.2, 0.24]} />
      </group>
      <group ref={van}>
        <Van />
      </group>
      {/* the customer's door */}
      <group position={DOOR}>
        {/* house behind the door, front face toward the street (+z) */}
        <Slab size={[1.0, 0.95, 0.7]} material={k.stone} radius={0.03} position={[0.2, 0, -0.45]} />
        <Slab size={[1.08, 0.06, 0.78]} material={k.travertine} radius={0.02} position={[0.2, 0.95, -0.45]} />
        <Slab size={[0.3, 0.56, 0.02]} material={k.copperMatte} radius={0.01} position={[0, 0.05, -0.09]} />
        <Slab size={[0.44, 0.05, 0.26]} material={k.travertine} radius={0.01} position={[0, 0, 0.04]} />
        <Slab size={[0.22, 0.16, 0.02]} material={k.glass} radius={0.01} position={[0.42, 0.42, -0.095]} />
      </group>
      <OliveTree position={[DOOR.x + 0.9, 0, DOOR.z + 0.1]} height={1.1} seed={5} />
      <OliveTree position={[0.4, 0, -0.9]} height={1.2} seed={9} />
    </>
  );
}
