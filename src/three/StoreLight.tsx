"use client";

import { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * The one light rig every scene uses: a warm low sun from the upper left plus
 * a soft stone-coloured fill. Shadows are baked or faked (BlobShadow), never
 * real-time shadow maps.
 */
export function StoreLight({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <StoreEnvironment />
      <hemisphereLight args={["#fff4e6", "#c9b8a0", 0.6 * intensity]} />
      <directionalLight position={[-4, 6, 3]} intensity={2.4 * intensity} color="#ffd9b0" />
      <directionalLight position={[3, 2, 4]} intensity={0.35 * intensity} color="#e6ddcf" />
    </>
  );
}

// One procedural room reflection per renderer, shared by every view: gives
// copper and steel something warm to reflect without downloading an HDRI.
const envCache = new WeakMap<THREE.WebGLRenderer, THREE.Texture>();
function StoreEnvironment() {
  const get = useThree((s) => s.get);
  useLayoutEffect(() => {
    const { gl, scene } = get();
    let env = envCache.get(gl);
    if (!env) {
      const pmrem = new THREE.PMREMGenerator(gl);
      env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
      envCache.set(gl, env);
    }
    const prev = scene.environment;
    scene.environment = env;
    scene.environmentIntensity = 0.4;
    return () => {
      scene.environment = prev;
    };
  }, [get]);
  return null;
}

let blobTexture: THREE.CanvasTexture | null = null;
function getBlobTexture() {
  if (blobTexture) return blobTexture;
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(23,21,15,0.55)");
  g.addColorStop(0.5, "rgba(23,21,15,0.22)");
  g.addColorStop(1, "rgba(23,21,15,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  blobTexture = new THREE.CanvasTexture(c);
  return blobTexture;
}

/** Soft contact shadow as a textured quad (ContactShadows renders nothing on three 0.186). */
export function BlobShadow({
  position = [0, 0.001, 0],
  scale = [1.6, 1],
  opacity = 1,
}: {
  position?: [number, number, number];
  scale?: [number, number];
  opacity?: number;
}) {
  const map = useMemo(() => getBlobTexture(), []);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0.35]} scale={[scale[0], scale[1], 1]} renderOrder={-1}>
      <planeGeometry />
      <meshBasicMaterial map={map} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
