"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Slab, Ticket, useKit } from "@/three/kit";
import { StoreLight } from "@/three/StoreLight";
import { drawnTexture, fonts, rng } from "@/three/textures";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";
import { useRig, type Anchors, type View } from "./rig";

const LANES = [
  { name: "Central warehouse", x: -0.2 },
  { name: "Riverside store", x: 0.6 },
  { name: "Old Town store", x: 1.4 },
];
const INBOX = new THREE.Vector3(-1.5, 0.9, 0.2);
// ticket id → lane(s); t2 is a split shipment
const FOLLOW: Record<string, number[]> = { t1: [1], t2: [1, 2], t3: [0] };
const COUNT = 9;
const VIEWS: View[] = [
  { pos: [0.3, 1.5, 4.4], target: [0.1, 1.2, 0] },
  { pos: [-1.3, 1.4, 2.6], target: [-0.7, 1.15, 0] },
  { pos: [0.9, 1.45, 2.2], target: [0.8, 1.3, 0] },
  { pos: [2.1, 1.2, 2.6], target: [1.2, 0.95, 0] },
];
const ANCHORS: Anchors = {
  inbox: [-1.5, 1.12, 0.25],
  rules: [-0.6, 2.08, 0.06],
  lanes: [0.6, 1.98, 0.06],
  split: [1.0, 1.25, 0.14],
};

function laneHeader(name: string) {
  return drawnTexture(320, 64, (g, w, h) => {
    g.fillStyle = "#17150f";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#f5f2ed";
    g.font = `500 24px ${fonts.sans()}`;
    g.fillText(name, 16, 40);
  }).texture;
}
function ticketPrint(id: string) {
  return drawnTexture(130, 200, (g, w, h) => {
    g.fillStyle = "#fbf8f2";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#17150f";
    g.font = `600 18px ${fonts.mono()}`;
    g.fillText(id, 10, 30);
    g.fillStyle = "#c2602a";
    g.fillRect(10, 40, 30, 3);
    g.fillStyle = "#c9b8a0";
    for (let i = 0; i < 5; i++) g.fillRect(10, 60 + i * 20, w - 20 - (i % 2) * 30, 6);
  }).texture;
}

/**
 * OMS: a routing board. Broken: tickets piled in the inbox. Fixed: each ticket
 * slides into its location lane. Live: the picked ticket's route lights up.
 */
export default function OmsScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const { state, camera, part } = useRig(bus, VIEWS, ANCHORS);
  const tickets = useRef<(THREE.Group | null)[]>([]);
  const routes = useRef<(THREE.Mesh | null)[]>([]);

  const data = useMemo(() => {
    const r = rng(51);
    return Array.from({ length: COUNT }, (_, i) => {
      const lane = i % 3;
      const row = Math.floor(i / 3);
      const id = `ORD-${1042 + i}`;
      return {
        id,
        print: ticketPrint(id),
        lane,
        pile: new THREE.Vector3(INBOX.x + (r() - 0.5) * 0.25, INBOX.y + 0.02 + i * 0.035, INBOX.z + (r() - 0.5) * 0.1),
        pileRot: (r() - 0.5) * 1.2,
        slot: new THREE.Vector3(LANES[lane].x, 1.55 - row * 0.42, 0.06),
      };
    });
  }, []);
  const headers = useMemo(() => LANES.map((l) => laneHeader(l.name)), []);
  const routeGeos = useMemo(
    () =>
      LANES.map((l) => {
        const c = new THREE.CubicBezierCurve3(new THREE.Vector3(INBOX.x + 0.2, INBOX.y + 0.2, 0.1), new THREE.Vector3(-0.8, 1.9, 0.12), new THREE.Vector3(l.x - 0.2, 1.9, 0.12), new THREE.Vector3(l.x, 1.75, 0.1));
        return new THREE.TubeGeometry(c, 60, 0.01, 6, false);
      }),
    [],
  );
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const { fixed, time } = state.current;
    const follow = bus.mode === "live" && bus.focus ? FOLLOW[bus.focus] : null;
    const followIdx = bus.mode === "live" && bus.focus ? Number(bus.focus.slice(1)) - 1 : -1;
    data.forEach((d, i) => {
      const g = tickets.current[i];
      if (!g) return;
      const a = THREE.MathUtils.smoothstep(fixed, 0.1 + i * 0.06, 0.4 + i * 0.06);
      tmp.copy(d.pile).lerp(d.slot, a);
      const lift = i === followIdx ? 0.08 + Math.sin(time * 3) * 0.01 : 0;
      g.position.set(tmp.x, tmp.y, tmp.z + lift);
      g.rotation.set(-Math.PI / 2 * (1 - a), 0, d.pileRot * (1 - a));
    });
    routes.current.forEach((m, i) => {
      if (m) m.visible = !!follow?.includes(i);
    });
  });

  return (
    <>
      {camera}
      <StoreLight />
      <Slab size={[6, 0.05, 3]} material={k.terrazzo} position={[0, -0.05, 0.6]} radius={0.01} />
      {/* the board */}
      <Slab size={[4.2, 2.3, 0.08]} material={k.travertine} position={[0, 0.05, -0.04]} radius={0.02} />
      <group ref={part("rules")} position={[-0.6, 2.08, 0.01]}>
        <Slab size={[0.6, 0.12, 0.02]} material={k.copperMatte} radius={0.01} position={[0, -0.06, 0]} />
      </group>
      <group ref={part("lanes")}>
        {LANES.map((l, i) => (
          <group key={l.name} position={[l.x, 0, 0]}>
            <mesh position={[0, 1.86, 0.03]}>
              <planeGeometry args={[0.66, 0.13]} />
              <meshBasicMaterial map={headers[i]} toneMapped={false} />
            </mesh>
            <Slab size={[0.7, 1.4, 0.01]} material={k.stone} radius={0.01} position={[0, 0.3, 0.005]} />
          </group>
        ))}
      </group>
      {/* inbox tray on a stand */}
      <group ref={part("inbox")} position={[INBOX.x, 0, INBOX.z]}>
        <Slab size={[0.5, 0.86, 0.4]} material={k.stone} radius={0.03} />
        <Slab size={[0.42, 0.04, 0.32]} material={k.steel} radius={0.01} position={[0, 0.86, 0]} />
      </group>
      {data.map((d, i) => (
        <group key={d.id} ref={(el) => void (tickets.current[i] = el)}>
          <group ref={i === 4 ? part("split") : undefined}>
            <Ticket print={d.print} scale={0.95} />
          </group>
        </group>
      ))}
      {routeGeos.map((g, i) => (
        <mesh key={i} ref={(el) => void (routes.current[i] = el)} geometry={g} material={k.lightOn} visible={false} />
      ))}
    </>
  );
}
