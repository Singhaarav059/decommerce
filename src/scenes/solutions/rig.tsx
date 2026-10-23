"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import type { StageBus } from "@/three/stageBus";

export type View = { pos: [number, number, number]; target: [number, number, number] };
/** Static points, or functions for parts that move (rider, van). */
export type Anchors = Record<string, [number, number, number] | (() => THREE.Vector3)>;

/** Shared frame state a solution scene reads in its own useFrame. */
export type RigState = {
  /** 0 broken → 1 fixed, smoothed. "live"/"inside" modes sit at 1. */
  fixed: number;
  /** Signature-interaction value, smoothed. */
  value: number;
  /** Time in seconds, for idle motion. */
  time: number;
};

/**
 * Camera, progress smoothing and anchor projection for the solution scenes.
 * views[0] is the hero/scrub view; capability tab n uses views[n + 1] in
 * "inside" mode. Anchors are projected for the DOM anatomy pins (`part-<id>`).
 * Parts registered with `part(id)` grow slightly while focused.
 */
export function useRig(
  bus: StageBus,
  views: View[],
  anchors: Anchors,
  opts: { fov?: number; portraitFar?: number; /** shift right in full-screen scrub stages, leaving room for the copy card */ scrubOffset?: number } = {},
) {
  const size = useThree((s) => s.size);
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const state = useRef<RigState>({ fixed: 0, value: 0, time: 0 });
  const parts = useRef(new Map<string, THREE.Object3D>());
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const lookNow = useRef(new THREE.Vector3(...views[0].target));
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const first = useRef(true);

  useFrame((st, dt) => {
    const s = state.current;
    const snap = bus.reduced || first.current;
    const k = snap ? 1 : 1 - Math.exp(-5 * dt);
    const targetFixed = bus.mode === "scrub" ? bus.progress : 1;
    s.fixed += (targetFixed - s.fixed) * k;
    s.value += (bus.value - s.value) * k;
    s.time = st.clock.elapsedTime;

    const view = bus.mode === "inside" ? (views[bus.step + 1] ?? views[0]) : views[0];
    const aspect = size.width / Math.max(1, size.height);
    // full-screen scrub stages pull back a little so the room reads around the copy card
    // tall phone stages pull back in proportion to how narrow they are
    const far = (aspect < 0.9 ? Math.max(opts.portraitFar ?? 1.5, 0.95 / aspect) : aspect < 1.3 ? 1.2 : 1) * (bus.mode === "scrub" && bus.fullBleed ? 1.22 : 1);
    look.set(...view.target);
    pos.set(...view.pos).sub(look).multiplyScalar(far).add(look);
    if (cam.current) {
      const ck = snap ? 1 : 1 - Math.exp(-3.5 * dt);
      cam.current.position.lerp(pos, ck);
      lookNow.current.lerp(look, ck);
      cam.current.lookAt(lookNow.current);
      // scrub stages leave room for the copy card: left of it on wide screens, below it on phones
      const shiftX = bus.fullBleed && aspect >= 1 ? (opts.scrubOffset ?? 0.16) : 0;
      const shiftY = bus.fullBleed && aspect < 1 ? 0.16 : 0;
      if (shiftX || shiftY) cam.current.setViewOffset(size.width, size.height, -size.width * shiftX, size.height * shiftY, size.width, size.height);
      else if (cam.current.view?.enabled) cam.current.clearViewOffset();
    }
    first.current = false;

    for (const [id, p] of Object.entries(anchors)) bus.project(`part-${id}`, typeof p === "function" ? tmp.copy(p()) : tmp.set(...p), st.camera, size, true);
    for (const [id, obj] of parts.current) {
      const target = bus.focus === id ? 1.06 + Math.sin(s.time * 4) * 0.015 : 1;
      obj.scale.setScalar(THREE.MathUtils.damp(obj.scale.x, target, 10, dt));
    }
  });

  // Runs after the scene's own useFrame callbacks so the frame is complete.
  useFrame(() => bus.tick(), 1);

  const camera = <PerspectiveCamera ref={cam} makeDefault fov={opts.fov ?? 30} position={views[0].pos} />;
  const part = (id: string) => (el: THREE.Object3D | null) => {
    if (el) parts.current.set(id, el);
    else parts.current.delete(id);
  };
  return { state, camera, part };
}
