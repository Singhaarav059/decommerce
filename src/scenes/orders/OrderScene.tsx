"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { order, orderLands } from "@/content/home";
import { KraftBox, Slab, Ticket, useKit } from "@/three/kit";
import { StoreLight } from "@/three/StoreLight";
import { drawnTexture, fonts, rng } from "@/three/textures";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";

const ss = THREE.MathUtils.smoothstep;

/** Customer home and the three candidate locations on the miniature city map. */
const HOME = new THREE.Vector3(-0.15, 0, 0.55);
const SITES: Record<string, THREE.Vector3> = {
  wh: new THREE.Vector3(-1.25, 0, -0.85),
  st: new THREE.Vector3(0.45, 0, 0.05),
  st2: new THREE.Vector3(1.15, 0, -0.75),
};

function ticketPrint() {
  return drawnTexture(260, 400, (g, w, h) => {
    g.fillStyle = "#fbf8f2";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#17150f";
    g.font = `600 26px ${fonts.mono()}`;
    g.fillText(order.id, 22, 50);
    g.fillStyle = "#c2602a";
    g.fillRect(22, 66, 40, 4);
    g.fillStyle = "#4a463d";
    g.font = `400 17px ${fonts.sans()}`;
    g.fillText(order.item, 22, 110);
    g.fillText(`Size ${order.size} · Qty 1`, 22, 136);
    g.font = `400 13px ${fonts.mono()}`;
    g.fillText(order.sku, 22, 170);
    g.setLineDash([4, 5]);
    g.strokeStyle = "#c9b8a0";
    g.beginPath();
    g.moveTo(22, 200);
    g.lineTo(w - 22, 200);
    g.stroke();
    g.setLineDash([]);
    g.font = `400 15px ${fonts.sans()}`;
    g.fillText("Ship to: customer, 2.4 km", 22, 236);
    g.fillText("Channel: website", 22, 262);
    for (let i = 0; i < 26; i++) {
      g.fillStyle = "#17150f";
      g.fillRect(22 + i * 8, 300, i % 3 ? 3 : 5, 60);
    }
    g.font = `400 11px ${fonts.mono()}`;
    g.fillStyle = "#6f695d";
    g.fillText("ILLUSTRATIVE", 22, 386);
  }).texture;
}


/**
 * Chapter 5: ORD-1042 drops onto the city map as a paper ticket, checks three
 * locations (lines reach out to each) and routes itself to the nearest store
 * that has the size. bus.progress drives it; bus.focus highlights a location.
 */
export default function OrderScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const k = useKit();
  const size = useThree((s) => s.size);
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const ticket = useRef<THREE.Group>(null);
  const lines = useRef<Record<string, THREE.Mesh | null>>({});
  const pins = useRef<Record<string, THREE.Mesh | null>>({});
  const p = useRef(0);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const print = useMemo(() => ticketPrint(), []);

  const routes = useMemo(
    () =>
      Object.entries(SITES).map(([id, to]) => {
        const mid = HOME.clone().lerp(to, 0.5).setY(0.45);
        const c = new THREE.QuadraticBezierCurve3(HOME.clone().setY(0.12), mid, to.clone().setY(0.12));
        return { id, geo: new THREE.TubeGeometry(c, 80, 0.011, 6, false) };
      }),
    [],
  );
  const lineMats = useMemo(
    () => ({
      checking: new THREE.MeshBasicMaterial({ color: "#9ea4a6", transparent: true, opacity: 0.9, toneMapped: false }),
      chosen: k.lightOn,
    }),
    [k],
  );

  // City blocks: a seeded grid of low travertine/stone buildings with streets between.
  const blocks = useMemo(() => {
    const out: { x: number; z: number; w: number; d: number; h: number; m: number }[] = [];
    const r = rng(17);
    for (let gx = -4; gx <= 4; gx++) {
      for (let gz = -3; gz <= 3; gz++) {
        const x = gx * 0.42;
        const z = gz * 0.42;
        const nearSite = [HOME, ...Object.values(SITES)].some((v) => Math.hypot(v.x - x, v.z - z) < 0.3);
        if (nearSite || r() < 0.18) continue;
        out.push({ x, z, w: 0.24 + r() * 0.07, d: 0.24 + r() * 0.07, h: 0.04 + r() * 0.13, m: r() > 0.7 ? 1 : 0 });
      }
    }
    return out;
  }, []);

  useFrame((st, dt) => {
    p.current += (bus.progress - p.current) * (bus.reduced ? 1 : 1 - Math.exp(-5 * dt));
    const t = p.current;
    const drop = ss(t, 0.02, 0.26);
    const check = ss(t, 0.3, 0.6);
    const chosen = ss(t, 0.66, 0.86);

    if (ticket.current) {
      // the ticket drops from above, swings flat onto the map next to the home pin
      ticket.current.position.set(HOME.x + 0.45, 0.02 + (1 - drop) * 1.6, HOME.z + 0.45);
      ticket.current.rotation.set(-Math.PI / 2 + (1 - drop) * 1.2, 0, 0.25 + (1 - drop) * 0.6);
      ticket.current.visible = t > 0.005;
    }

    routes.forEach(({ id, geo }) => {
      const m = lines.current[id];
      if (!m) return;
      const isChosen = orderLands.locations.find((l) => l.id === id)?.chosen;
      const count = geo.index ? geo.index.count : 0;
      const reach = isChosen ? Math.max(check, chosen) : check * (1 - chosen * 0.999);
      geo.setDrawRange(0, Math.floor(count * reach));
      m.visible = reach > 0.002;
      m.material = isChosen && chosen > 0.5 ? lineMats.chosen : lineMats.checking;
      const pin = pins.current[id];
      if (pin) {
        const focus = bus.focus === id ? 1.25 : 1;
        const s = (isChosen ? 1 + chosen * 0.35 : 1 - chosen * 0.3) * focus;
        pin.scale.setScalar(THREE.MathUtils.damp(pin.scale.x, s, 8, dt));
      }
      bus.project(`loc-${id}`, tmp.copy(SITES[id]).setY(0.55), st.camera, size, t > 0.28);
    });
    bus.project("home", tmp.copy(HOME).setY(0.4), st.camera, size, t > 0.04);

    if (cam.current) {
      const aspect = size.width / Math.max(1, size.height);
      const far = aspect < 1 ? 1.7 : 1;
      cam.current.position.set(3.6 * far, 5.4 * far, 5.6 * far);
      cam.current.lookAt(0, 0, -0.1);
      cam.current.setViewOffset(size.width, size.height, aspect >= 1 ? -size.width * 0.16 : 0, aspect < 1 ? -size.height * 0.08 : 0, size.width, size.height);
    }
    bus.tick();
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={26} />
      <StoreLight />
      {/* map base */}
      <Slab size={[4.1, 0.12, 3.3]} material={k.terrazzo} position={[0, -0.12, 0]} radius={0.04} />
      <Slab size={[3.9, 0.16, 3.1]} material={k.travertine} position={[0, -0.3, 0]} radius={0.06} />
      {blocks.map((b, i) => (
        <Slab key={i} size={[b.w, b.h, b.d]} material={b.m ? k.stone : k.travertine} position={[b.x, 0, b.z]} radius={0.012} />
      ))}
      {/* home */}
      <group position={HOME}>
        <Slab size={[0.18, 0.12, 0.18]} material={k.stone} radius={0.01} />
        <mesh position={[0, 0.17, 0]} rotation={[0, Math.PI / 4, 0]} material={k.copperMatte}>
          <coneGeometry args={[0.14, 0.1, 4]} />
        </mesh>
      </group>
      {/* locations */}
      {Object.entries(SITES).map(([id, v]) => (
        <group key={id} position={v}>
          {id === "wh" ? (
            <Slab size={[0.42, 0.22, 0.3]} material={k.steel} radius={0.02} />
          ) : (
            <Slab size={[0.3, 0.2, 0.26]} material={k.stone} radius={0.02} />
          )}
          <mesh ref={(el) => void (pins.current[id] = el)} position={[0, 0.34, 0]} material={id === "st" ? k.copper : k.inkMatte}>
            <sphereGeometry args={[0.045, 20, 12]} />
          </mesh>
        </group>
      ))}
      {routes.map(({ id, geo }) => (
        <mesh key={id} ref={(el) => void (lines.current[id] = el)} geometry={geo} material={lineMats.checking} />
      ))}
      <group ref={ticket}>
        <Ticket print={print} scale={1.4} />
      </group>
      <KraftBox size={[0.12, 0.08, 0.1]} position={[SITES.st.x + 0.25, 0, SITES.st.z + 0.12]} />
    </>
  );
}
