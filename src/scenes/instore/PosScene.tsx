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
import { Room, useProgress } from "./shared";

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

/** POS: card taps the reader, the screen turns to Paid and a receipt rises. */
export default function PosScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const p = useProgress(bus);
  const card = useRef<THREE.Group>(null);
  const receipt = useRef<THREE.Mesh>(null);
  const paid = useMemo(() => screenTexture(), []);
  const screenRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const t = p.current;
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
  });

  return (
    <>
      <Room camera={[1.1, 1.55, 2.4]} target={[0, 0.72, 0]} />
      <Counter w={1.6} d={0.62} h={0.66} />
      <PosTerminal position={[-0.25, 0.66, -0.05]} rotation={[0, 0.25, 0]} />
      <group ref={screenRef} position={[-0.25, 0.66, -0.05]} rotation={[0, 0.25, 0]} visible={false}>
        <PosTerminal screen={paid} />
      </group>
      <CardReader position={[0.05, 0.66, 0.15]} rotation={[0, -0.2, 0]} />
      {/* receipt printer */}
      <Slab size={[0.18, 0.12, 0.2]} material={k.stone} radius={0.02} position={[0.42, 0.66, -0.05]} />
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
