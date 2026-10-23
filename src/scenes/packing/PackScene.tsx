"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { clips } from "@/content/media";
import { order } from "@/content/home";
import { Bin, Conveyor, KraftBox, Slab, useKit } from "@/three/kit";
import { StoreLight } from "@/three/StoreLight";
import { VideoPlane } from "@/three/VideoPlane";
import { drawnTexture, fonts } from "@/three/textures";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";

const ss = THREE.MathUtils.smoothstep;
const BIN_ROWS = 3;
const BIN_COLS = 4;
const TARGET_BIN = 6; // B-14 in the copy: row 1, col 2

function labelPrint() {
  return drawnTexture(256, 160, (g, w, h) => {
    g.fillStyle = "#fbf8f2";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#17150f";
    g.font = `600 22px ${fonts.mono()}`;
    g.fillText(order.id, 14, 34);
    g.font = `400 13px ${fonts.sans()}`;
    g.fillText(`${order.item} · ${order.size}`, 14, 58);
    for (let i = 0; i < 28; i++) g.fillRect(14 + i * 8, 76, i % 4 ? 3 : 5, 50);
    g.font = `400 10px ${fonts.mono()}`;
    g.fillText("ILLUSTRATIVE", 14, 146);
  }).texture;
}

/** Materials this scene animates, behind methods so frame updates stay out of render. */
class PackMaterials {
  beam = new THREE.MeshBasicMaterial({ color: "#c2602a", transparent: true, opacity: 0, toneMapped: false, depthWrite: false, side: THREE.DoubleSide });
  label: THREE.MeshStandardMaterial;
  lights = Array.from(
    { length: BIN_ROWS * BIN_COLS },
    () => new THREE.MeshStandardMaterial({ color: "#d8cfc2", emissive: new THREE.Color("#c2602a"), emissiveIntensity: 0, roughness: 0.6, toneMapped: false }),
  );
  constructor(print: THREE.Texture) {
    this.label = new THREE.MeshStandardMaterial({ map: print, roughness: 0.9 });
  }
  setBeam(opacity: number) {
    this.beam.opacity = opacity;
  }
  setLight(i: number, on: number) {
    const m = this.lights[i];
    m.emissiveIntensity = on * 1.6;
    m.color.set(on > 0.05 ? "#c2602a" : "#d8cfc2");
  }
}

/**
 * Chapter 6, the packing station: a bin lights up copper, the scanner beam
 * sweeps the overshirt, the label prints and the boxed order rolls off on the
 * conveyor. bus.progress drives it.
 */
export default function PackScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const size = useThree((s) => s.size);
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const beam = useRef<THREE.Mesh>(null);
  const label = useRef<THREE.Mesh>(null);
  const box = useRef<THREE.Group>(null);
  const shirt = useRef<THREE.Mesh>(null);
  const p = useRef(0);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const print = useMemo(() => labelPrint(), []);
  // one light strip material per bin so only the picked bin glows
  const mats = useMemo(() => new PackMaterials(print), [print]);

  useFrame((st, dt) => {
    p.current += (bus.progress - p.current) * (bus.reduced ? 1 : 1 - Math.exp(-5 * dt));
    const t = p.current;
    const lit = ss(t, 0.02, 0.15);
    const scan = ss(t, 0.25, 0.45);
    const printing = ss(t, 0.48, 0.66);
    const roll = ss(t, 0.7, 0.98);

    // the lit bin pulses until the scan, others stay dark
    for (let i = 0; i < BIN_ROWS * BIN_COLS; i++) {
      mats.setLight(i, i === TARGET_BIN ? lit * (1 - scan * 0.4) * (0.75 + 0.25 * Math.sin(st.clock.elapsedTime * 5)) : 0);
    }

    if (beam.current) {
      mats.setBeam(scan > 0 && scan < 1 ? 0.55 : 0);
      beam.current.position.x = -0.18 + scan * 0.36;
    }
    if (label.current) {
      label.current.position.z = 0.02 + printing * 0.16;
      label.current.visible = printing > 0.01;
    }
    if (shirt.current) shirt.current.visible = printing < 0.95;
    if (box.current) {
      // box closes over the shirt, then rides the conveyor to the right
      // slide along the table, drop onto the rollers, ride off to the right
      const lerp = THREE.MathUtils.lerp;
      const x = roll < 0.3 ? lerp(0.02, 0.95, roll / 0.3) : roll < 0.4 ? lerp(0.95, 1.15, (roll - 0.3) / 0.1) : lerp(1.15, 3.1, (roll - 0.4) / 0.6);
      const y = roll < 0.3 ? 0.79 : roll < 0.4 ? lerp(0.79, 0.43, (roll - 0.3) / 0.1) : 0.43;
      box.current.position.set(x, y, 0.1);
      box.current.scale.setScalar(0.6 + 0.4 * printing);
      box.current.visible = printing > 0.3;
    }
    bus.project("bin", tmp.set(-0.62 + (TARGET_BIN % BIN_COLS) * 0.3, 1.3 + Math.floor(TARGET_BIN / BIN_COLS) * 0.2 + 0.18, -0.46), st.camera, size, lit > 0.5 && roll < 0.5);
    bus.project("label", tmp.set(0.55, 1.05, 0.1), st.camera, size, printing > 0.5 && roll < 0.3);

    if (cam.current) {
      const aspect = size.width / Math.max(1, size.height);
      const far = aspect < 1 ? 1.65 : 1;
      cam.current.position.set(0.55 + 2.4 * far, 3.1 * far, 6.2 * far);
      cam.current.lookAt(0.75, 0.75, 0);
      cam.current.setViewOffset(size.width, size.height, aspect >= 1 ? -size.width * 0.14 : 0, 0, size.width, size.height);
    }
    bus.tick();
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={28} />
      <StoreLight />
      <Slab size={[5, 0.05, 3]} material={k.terrazzo} position={[0.4, -0.05, -0.3]} radius={0.01} />
      <Slab size={[4.4, 2.2, 0.1]} material={k.travertine} position={[0.4, 0, -0.7]} radius={0.01} />
      {/* bin wall */}
      <group position={[-0.62, 1.3, -0.46]}>
        {Array.from({ length: BIN_ROWS * BIN_COLS }, (_, i) => (
          <Bin key={i} light={mats.lights[i]} position={[(i % BIN_COLS) * 0.3, Math.floor(i / BIN_COLS) * 0.2, 0]} scale={[1, 1, 0.8]} />
        ))}
      </group>
      {/* packing table */}
      <Slab size={[1.5, 0.05, 0.8]} material={k.oak} position={[0.15, 0.74, 0.05]} radius={0.01} />
      {[-0.65, 0.95].map((x) =>
        [-0.3, 0.4].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.37, z]} material={k.steel}>
            <boxGeometry args={[0.035, 0.74, 0.035]} />
          </mesh>
        )),
      )}
      {/* folded overshirt + scanner + printer on the table */}
      <mesh ref={shirt} position={[0.02, 0.81, 0.1]} material={k.linen}>
        <boxGeometry args={[0.34, 0.03, 0.26]} />
      </mesh>
      <mesh ref={beam} position={[0, 0.84, 0.1]} rotation={[Math.PI / 2, 0, 0]} material={mats.beam}>
        <planeGeometry args={[0.012, 0.3]} />
      </mesh>
      <group position={[-0.4, 0.79, 0.2]} rotation={[0, 0.6, 0]}>
        <Slab size={[0.06, 0.05, 0.18]} material={k.ink} radius={0.02} />
        <Slab size={[0.04, 0.12, 0.05]} material={k.inkMatte} radius={0.015} position={[0, -0.0, 0.08]} />
      </group>
      <group position={[0.55, 0.79, -0.05]}>
        <Slab size={[0.26, 0.16, 0.24]} material={k.stone} radius={0.03} />
        <Slab size={[0.18, 0.006, 0.01]} material={k.inkMatte} radius={0.002} position={[0, 0.1, 0.121]} />
        <mesh ref={label} position={[0, 0.105, 0.02]} rotation={[-Math.PI / 2, 0, 0]} material={mats.label}>
          <planeGeometry args={[0.16, 0.1]} />
        </mesh>
      </group>
      <group ref={box}>
        <KraftBox size={[0.4, 0.22, 0.3]} />
      </group>
      <Conveyor length={2.6} width={0.46} position={[2.0, 0, 0.1]} />
      <group position={[0.85, 0.62, -0.38]}>
        <VideoPlane clip={clips.walker} height={1.25} />
      </group>
    </>
  );
}
