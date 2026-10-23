"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { Slab, useKit } from "@/three/kit";
import { StoreLight } from "@/three/StoreLight";
import type { StageBus } from "@/three/stageBus";

/** Smoothed 0–1 progress for a scene panel (snaps when reduced). */
export function useProgress(bus: StageBus) {
  const p = useRef(0);
  useFrame((_, dt) => {
    p.current = bus.reduced ? bus.progress : p.current + (bus.progress - p.current) * (1 - Math.exp(-6 * dt));
  });
  return p;
}

/** Camera + light + terrazzo floor and travertine back wall shared by the small in-store scenes. */
export function Room({ camera, target, fov = 30 }: { camera: [number, number, number]; target: [number, number, number]; fov?: number }) {
  const k = useKit();
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const size = useThree((s) => s.size);
  useFrame(() => {
    if (!cam.current) return;
    const far = size.width / Math.max(1, size.height) < 0.8 ? 1.35 : 1;
    cam.current.position.set(target[0] + (camera[0] - target[0]) * far, target[1] + (camera[1] - target[1]) * far, target[2] + (camera[2] - target[2]) * far);
    cam.current.lookAt(target[0], target[1], target[2]);
  });
  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={fov} />
      <StoreLight />
      <Slab size={[6, 0.05, 4]} material={k.terrazzo} position={[0, -0.05, -0.5]} radius={0.01} />
      <Slab size={[6, 2.4, 0.1]} material={k.travertine} position={[0, 0, -1.2]} radius={0.01} />
    </>
  );
}
