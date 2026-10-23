"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { BlobShadow, StoreLight } from "@/three/StoreLight";
import type { SceneProps } from "./registry";

/** Test scene for the 3D foundation: travertine plinth + copper cube, cursor tilt. */
export default function PlaceholderScene({ progress = 0 }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const cube = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    if (!group.current || !cube.current) return;
    // 3–4° cursor tilt, eased
    const tx = state.pointer.y * 0.06;
    const ty = state.pointer.x * 0.07;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, tx, 4, dt);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, ty - 0.6, 4, dt);
    cube.current.rotation.y += dt * 0.4;
    cube.current.position.y = 0.62 + Math.sin(state.clock.elapsedTime * 1.4) * 0.04 + progress * 0.3;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[3.2, 2.6, 4.2]} fov={30} onUpdate={(c) => c.lookAt(0, 0.35, 0)} />
      <StoreLight />
      <group ref={group}>
        <RoundedBox args={[2.4, 0.3, 2.4]} radius={0.04} smoothness={3} position={[0, 0, 0]}>
          <meshStandardMaterial color="#e6ddcf" roughness={0.85} />
        </RoundedBox>
        <RoundedBox ref={cube} args={[0.6, 0.6, 0.6]} radius={0.05} smoothness={3}>
          <meshStandardMaterial color="#c2602a" roughness={0.35} metalness={0.6} />
        </RoundedBox>
        <BlobShadow position={[0, 0.152, 0]} scale={[1.2, 0.9]} />
      </group>
    </>
  );
}
