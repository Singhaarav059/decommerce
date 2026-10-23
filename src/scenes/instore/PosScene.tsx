"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clips } from "@/content/media";
import { order } from "@/content/home";
import { CardReader, Counter, PosTerminal, Slab, useKit } from "@/three/kit";
import { VideoPlane } from "@/three/VideoPlane";
import { drawnTexture, fonts } from "@/three/textures";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";
import { Room, phase } from "./shared";
import { useRig, type Anchors, type View } from "../solutions/rig";

const ss = THREE.MathUtils.smoothstep;

function screenTexture() {
  return drawnTexture(512, 320, (g, w, h) => {
    g.fillStyle = "#17150f";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#69714e";
    g.beginPath();
    g.arc(70, 160, 34, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#f5f2ed";
    g.lineWidth = 7;
    g.beginPath();
    g.moveTo(54, 160);
    g.lineTo(66, 173);
    g.lineTo(88, 147);
    g.stroke();
    g.fillStyle = "#f5f2ed";
    g.font = `400 54px ${fonts.serif()}`;
    g.fillText("Paid", 130, 178);
    g.font = `400 20px ${fonts.mono()}`;
    g.fillStyle = "rgba(245,242,237,0.6)";
    g.fillText(`${order.id} · illustrative`, 32, 280);
  }).texture;
}

const VIEWS: View[] = [
  { pos: [1.1, 1.55, 2.4], target: [0, 0.72, 0] },
  { pos: [0.1, 1.1, 0.95], target: [-0.25, 0.86, -0.05] },
  { pos: [1.05, 1.1, 0.85], target: [0.42, 0.8, -0.05] },
  { pos: [-0.85, 1.4, 1.9], target: [-0.1, 0.9, -0.4] },
];
const ANCHORS: Anchors = {
  screen: [-0.25, 0.98, -0.05],
  reader: [0.05, 0.72, 0.15],
  printer: [0.42, 0.82, -0.05],
  counter: [-0.6, 0.35, 0.33],
};
const QUEUE: [number, number, number][] = [
  [0.95, 0.62, 0.85],
  [1.4, 0.62, 1.3],
  [1.85, 0.62, 1.75],
];

/**
 * POS (homepage panel, POS page): a queue waits at the till (broken), then a
 * card taps the reader, the screen turns to Paid and a receipt rises. Live:
 * the slider rotates the terminal.
 */
export default function PosScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const rig = useRig(bus, VIEWS, ANCHORS);
  const queue = useRef<THREE.Group>(null);
  const terminal = useRef<THREE.Group>(null);
  const card = useRef<THREE.Group>(null);
  const receipt = useRef<THREE.Mesh>(null);
  const paid = useMemo(() => screenTexture(), []);
  const screenRef = useRef<THREE.Group>(null);
  const plainRef = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    const { fixed, value } = rig.state.current;
    const t = phase(bus.mode, fixed, value, false);
    if (queue.current) queue.current.visible = t < 0.3;
    if (terminal.current) {
      const turn = bus.mode === "live" ? (value - 0.35) * Math.PI * 1.2 : 0;
      terminal.current.rotation.y = THREE.MathUtils.damp(terminal.current.rotation.y, 0.25 + turn, 8, dt);
    }
    const tap = ss(t, 0.15, 0.45);
    const print = ss(t, 0.5, 0.85);
    if (card.current) {
      card.current.position.set(THREE.MathUtils.lerp(0.55, 0.05, tap), 0.75 + Math.sin(tap * Math.PI) * 0.12 - tap * 0.06, THREE.MathUtils.lerp(0.45, 0.2, tap));
      card.current.rotation.set(-Math.PI / 2 + 0.3 * (1 - tap), 0, 0.4 * (1 - tap));
    }
    if (receipt.current) {
      receipt.current.scale.y = 0.001 + print;
      receipt.current.position.y = 0.86 + print * 0.11;
    }
    if (screenRef.current) screenRef.current.visible = tap > 0.95;
    if (plainRef.current) plainRef.current.visible = tap <= 0.95;
  });

  return (
    <>
      {rig.camera}
      <Room />
      <group ref={rig.part("counter")}>
        <Counter w={1.6} d={0.62} h={0.66} />
      </group>
      <group ref={terminal} position={[-0.25, 0.66, -0.05]} rotation={[0, 0.25, 0]}>
        <group ref={rig.part("screen")}>
          <group ref={plainRef}>
            <PosTerminal />
          </group>
          <group ref={screenRef} visible={false}>
            <PosTerminal screen={paid} />
          </group>
        </group>
      </group>
      <group ref={rig.part("reader")} position={[0.05, 0.66, 0.15]} rotation={[0, -0.2, 0]}>
        <CardReader />
      </group>
      {/* receipt printer */}
      <group ref={rig.part("printer")} position={[0.42, 0.66, -0.05]}>
        <Slab size={[0.18, 0.12, 0.2]} material={k.stone} radius={0.02} />
      </group>
      <group ref={queue}>
        {QUEUE.map((q, i) => (
          <group key={i} position={q}>
            <VideoPlane clip={clips.walker} height={1.25} />
          </group>
        ))}
      </group>
      <mesh ref={receipt} position={[0.42, 0.86, -0.02]} material={k.paper}>
        <boxGeometry args={[0.12, 0.22, 0.003]} />
      </mesh>
      <group ref={card}>
        <Slab size={[0.14, 0.004, 0.09]} material={k.copper} radius={0.004} />
      </group>
      <group position={[-0.1, 0.62, -0.62]}>
        <VideoPlane clip={clips.walker} height={1.3} />
      </group>
    </>
  );
}
