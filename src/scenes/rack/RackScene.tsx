"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { themes } from "@/content/themes";
import { useAsset } from "@/three/useAsset";
import { BlobShadow, StoreLight } from "@/three/StoreLight";
import type { SceneProps } from "../registry";
import type { RackBus } from "./bus";

const SPACING = 0.62;
const LIFT_Z = 0.95;
const TWIRL_S = 1.5;
const FADE_TO = new THREE.Color("#e6ddcf");

type Body = {
  x: number;
  vx: number;
  ang: number;
  angVel: number;
  lift: number;
  liftVel: number;
  twirl: number; // seconds since lift began, -1 when idle
};

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Critically-ish damped spring step (semi-implicit Euler). */
function spring(pos: number, vel: number, target: number, k: number, c: number, dt: number): [number, number] {
  const a = -k * (pos - target) - c * vel;
  vel += a * dt;
  pos += vel * dt;
  return [pos, vel];
}

/**
 * The clothing rack (PLAN phase 5). Garments hang on a steel rail; a swipe
 * moves exactly one hanger, the rail travels with momentum and hangers swing
 * on springs and knock their neighbours. Tapping the centred hanger lifts it
 * forward with a full twirl while the others slide apart and recede; dragging
 * then spins it. All intent comes from the DOM controller through `bus`.
 */
export default function RackScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as RackBus;
  const { nodes } = useAsset("/assets/models/rack.glb") as unknown as { nodes: Record<string, THREE.Mesh> };
  const size = useThree((s) => s.size);
  const cam = useRef<THREE.PerspectiveCamera>(null);

  const bodies = useRef<Body[]>(
    themes.map((_, i) => ({ x: (i - bus.index) * SPACING, vx: 0, ang: 0, angVel: 0, lift: 0, liftVel: 0, twirl: -1 })),
  );
  const groups = useRef<(THREE.Group | null)[]>([]);
  const swings = useRef<(THREE.Group | null)[]>([]);
  const spins = useRef<(THREE.Group | null)[]>([]);
  const cloth = useRef<(THREE.Mesh | null)[]>([]);

  // One material clone per garment so each can recede on its own.
  const garments = useMemo(
    () =>
      themes.map((t) => {
        const src = nodes[`garment_${t.key}`];
        const material = (src.material as THREE.MeshStandardMaterial).clone();
        material.side = THREE.DoubleSide;
        material.userData = { base: material.color.clone(), recede: 0 };
        // keep the node transform: mesh quantization stores scale/offset there
        return { geometry: src.geometry, material, position: src.position, scale: src.scale, quaternion: src.quaternion };
      }),
    [nodes],
  );
  // Two materials (oak bar + steel hook) make the hanger a group; clone it per slot.
  const hangers = useMemo(() => themes.map(() => nodes.hanger.clone(true)), [nodes]);

  // Frame ~5 slots on wide screens, ~2.4 on phones.
  const aspect = size.width / Math.max(1, size.height);
  const slotsVisible = aspect > 1.2 ? 5 : 2.4;
  const fov = 30;
  const halfW = (slotsVisible * SPACING) / 2;
  const dist = Math.max(halfW / (Math.tan(THREE.MathUtils.degToRad(fov / 2)) * aspect), 2.2);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    const B = bodies.current;
    const n = B.length;
    const reduced = bus.reduced;
    // projected slot width in CSS px, for DOM hit-testing; also advances spin momentum
    bus.report((SPACING / (2 * dist * Math.tan(THREE.MathUtils.degToRad(fov / 2)) * aspect)) * size.width, dt);

    for (let i = 0; i < n; i++) {
      const b = B[i];
      const isSel = i === bus.index;
      const liftTarget = bus.lifted && isSel ? 1 : 0;
      const othersLift = bus.lifted ? 1 : 0;
      const gap = bus.lifted && !isSel ? Math.sign(i - bus.index) * 0.42 : 0;
      const target = (i - bus.index - bus.drag) * SPACING + gap * othersLift;

      const prevVx = b.vx;
      if (reduced) {
        b.x = target;
        b.vx = 0;
        b.lift = liftTarget;
      } else {
        // slightly under-damped: the rail overshoots and settles, like it has weight
        [b.x, b.vx] = spring(b.x, b.vx, target, 120, 15, dt);
        [b.lift, b.liftVel] = spring(b.lift, b.liftVel, liftTarget, 90, 17, dt);
      }

      // swing: driven by the hanger's own acceleration, damped
      const accel = (b.vx - prevVx) / Math.max(dt, 1e-4);
      const breeze = Math.sin(state.clock.elapsedTime * 0.9 + i * 1.7) * 0.25;
      if (!reduced) {
        const angAcc = -38 * b.ang - 2.6 * b.angVel - accel * 0.09 + breeze * 0.02;
        b.angVel += angAcc * dt;
        b.ang += b.angVel * dt;
        b.ang *= 1 - b.lift * 0.2; // calm the lifted one
      } else b.ang = 0;

      // twirl clock
      if (liftTarget === 1) b.twirl = b.twirl < 0 ? 0 : b.twirl + dt;
      else b.twirl = -1;
    }

    // knock: neighbouring hems that swing into each other trade momentum
    if (!reduced) {
      const L = 0.55;
      for (let i = 0; i < n - 1; i++) {
        const a = B[i];
        const c = B[i + 1];
        const hemA = a.x + Math.sin(a.ang) * L;
        const hemC = c.x + Math.sin(c.ang) * L;
        const min = SPACING * 0.72;
        if (hemC - hemA < min && a.lift < 0.5 && c.lift < 0.5) {
          const push = (min - (hemC - hemA)) * 6;
          a.angVel -= push;
          c.angVel += push;
        }
      }
    }

    for (let i = 0; i < n; i++) {
      const b = B[i];
      const g = groups.current[i];
      const sw = swings.current[i];
      const sp = spins.current[i];
      if (!g || !sw || !sp) continue;
      g.position.set(b.x, b.lift * 0.14, b.lift * LIFT_Z - (bus.lifted && i !== bus.index ? 0.28 : 0));
      sw.rotation.z = b.ang;
      const tw = b.twirl < 0 || reduced ? 0 : easeInOut(Math.min(1, b.twirl / TWIRL_S)) * Math.PI * 2;
      const spinTarget = b.lift > 0.02 && i === bus.index ? tw + bus.spin : 0;
      sp.rotation.y = THREE.MathUtils.damp(sp.rotation.y, spinTarget, b.lift > 0.02 ? 30 : 6, dt);
      // recede the others: fade toward the travertine wall colour
      const mesh = cloth.current[i];
      if (mesh) {
        const m = mesh.material as THREE.MeshStandardMaterial;
        const u = m.userData as { base: THREE.Color; recede: number };
        u.recede = THREE.MathUtils.damp(u.recede, bus.lifted && i !== bus.index ? 0.62 : 0, 6, dt);
        m.color.lerpColors(u.base, FADE_TO, u.recede);
      }
    }

    if (cam.current) {
      // tiny parallax with the pointer
      cam.current.position.x = THREE.MathUtils.damp(cam.current.position.x, state.pointer.x * 0.05, 3, dt);
    }
  });

  const railLen = 40;
  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault position={[0, -0.2, dist]} fov={fov} onUpdate={(c) => c.lookAt(0, -0.42, 0)} />
      <StoreLight />
      {/* rail */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.002, 0]}>
        <cylinderGeometry args={[0.012, 0.012, railLen, 16]} />
        <meshStandardMaterial color="#9ea4a6" metalness={1} roughness={0.28} />
      </mesh>
      {themes.map((t, i) => (
        <group key={t.key} ref={(el) => void (groups.current[i] = el)}>
          <group ref={(el) => void (swings.current[i] = el)}>
            <group ref={(el) => void (spins.current[i] = el)}>
              <primitive object={hangers[i]} />
              <mesh
                ref={(el) => void (cloth.current[i] = el)}
                geometry={garments[i].geometry}
                material={garments[i].material}
                position={garments[i].position}
                scale={garments[i].scale}
                quaternion={garments[i].quaternion}
              />
            </group>
          </group>
          <BlobShadow position={[0, -1.32, 0]} scale={[0.7, 0.3]} opacity={0.55} />
        </group>
      ))}
    </>
  );
}
