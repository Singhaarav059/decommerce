"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { clips } from "@/content/media";
import { useAsset } from "@/three/useAsset";
import { StoreLight } from "@/three/StoreLight";
import { VideoPlane } from "@/three/VideoPlane";
import { CardReader, Counter, FloorTile, KraftBox, Laptop, OliveTree, PosTerminal, Shelf, Slab, Wall, useKit } from "@/three/kit";
import { drawnTexture, fonts } from "@/three/textures";
import type { StageBus } from "@/three/stageBus";
import type { SceneProps } from "../registry";

const ss = THREE.MathUtils.smoothstep;
const TILE = 1.5;
const HALF = TILE / 2;

/** The four store zones, in the order of the "four islands" chapter. */
export const ZONES = [
  { id: "web", center: [-HALF, HALF] },
  { id: "store", center: [HALF, HALF] },
  { id: "warehouse", center: [-HALF, -HALF] },
  { id: "marketplace", center: [HALF, -HALF] },
] as const;

function posScreen() {
  return drawnTexture(512, 320, (g, w, h) => {
    g.fillStyle = "#17150f";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#c2602a";
    g.fillRect(28, 28, 10, 10);
    g.fillStyle = "#f5f2ed";
    g.font = `500 30px ${fonts.mono()}`;
    g.fillText("ORD-1042", 52, 40);
    g.font = `400 22px ${fonts.sans()}`;
    g.fillStyle = "rgba(245,242,237,0.7)";
    g.fillText("Linen overshirt · M", 28, 100);
    g.fillRect(28, 130, w - 56, 1);
    g.font = `400 64px ${fonts.serif()}`;
    g.fillStyle = "#f5f2ed";
    g.fillText("Tap to pay", 28, 230);
    g.font = `400 18px ${fonts.mono()}`;
    g.fillStyle = "rgba(245,242,237,0.5)";
    g.fillText("ILLUSTRATIVE", 28, 290);
  });
}

function siteScreen() {
  return drawnTexture(640, 400, (g, w, h) => {
    g.fillStyle = "#f5f2ed";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#17150f";
    g.font = `400 26px ${fonts.serif()}`;
    g.fillText("decommerce.", 28, 44);
    g.fillStyle = "#e6ddcf";
    g.fillRect(28, 70, w * 0.55, h - 100);
    g.fillStyle = "#d7cdbe";
    g.fillRect(28 + 40, 110, w * 0.55 - 80, h - 180);
    g.fillStyle = "#17150f";
    g.font = `400 34px ${fonts.serif()}`;
    g.fillText("Linen", w * 0.62, 120);
    g.fillText("overshirt", w * 0.62, 160);
    g.font = `400 18px ${fonts.sans()}`;
    g.fillStyle = "#6f695d";
    g.fillText("Size M · 4 in stock", w * 0.62, 200);
    g.fillStyle = "#17150f";
    g.fillRect(w * 0.62, 240, 150, 40);
    g.fillStyle = "#f5f2ed";
    g.fillText("Add to bag", w * 0.62 + 24, 266);
  });
}

function MiniRack(props: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const k = useKit();
  const { nodes } = useAsset("/assets/models/rack.glb") as unknown as { nodes: Record<string, THREE.Object3D> };
  const items = useMemo(
    () => ["linen", "olive", "ink", "terrazzo"].map((key) => ({ garment: nodes[`garment_${key}`].clone(true), hanger: nodes.hanger.clone(true) })),
    [nodes],
  );
  const s = 0.5;
  return (
    <group {...props}>
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.55, 0]} material={k.steel}>
          <cylinderGeometry args={[0.012, 0.012, 1.1, 10]} />
        </mesh>
      ))}
      <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 2]} material={k.steel}>
        <cylinderGeometry args={[0.012, 0.012, 1.02, 10]} />
      </mesh>
      {items.map((it, i) => (
        <group key={i} position={[-0.33 + i * 0.22, 1.1, 0]} scale={s} rotation={[0, 0.35, 0]}>
          <primitive object={it.hanger} />
          <primitive object={it.garment} />
        </group>
      ))}
    </group>
  );
}

function WebZone({ laptop }: { laptop: THREE.Texture }) {
  const k = useKit();
  return (
    <group>
      <FloorTile size={[TILE - 0.01, TILE - 0.01]} />
      <Wall size={[TILE, 1.35]} position={[-HALF + 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      {/* desk */}
      <group position={[0.05, 0, -0.05]}>
        <Slab size={[0.9, 0.035, 0.5]} material={k.oak} position={[0, 0.66, 0]} radius={0.01} />
        {[-1, 1].map((sx) =>
          [-1, 1].map((sz) => (
            <mesh key={`${sx}${sz}`} position={[sx * 0.4, 0.33, sz * 0.2]} material={k.steel}>
              <cylinderGeometry args={[0.012, 0.012, 0.66, 8]} />
            </mesh>
          )),
        )}
        <Laptop screen={laptop} position={[0, 0.695, 0.02]} rotation={[0, 0.25, 0]} />
      </group>
      <mesh position={[0.15, 0.24, 0.42]} material={k.copperMatte}>
        <cylinderGeometry args={[0.13, 0.12, 0.05, 24]} />
      </mesh>
      <mesh position={[0.15, 0.11, 0.42]} material={k.steel}>
        <cylinderGeometry args={[0.012, 0.03, 0.22, 8]} />
      </mesh>
      <OliveTree position={[-0.45, 0, 0.45]} height={1.25} seed={3} />
    </group>
  );
}

function StoreZone({ pos }: { pos: THREE.Texture }) {
  return (
    <group>
      <FloorTile size={[TILE - 0.01, TILE - 0.01]} />
      <Counter w={1.05} position={[0.05, 0, 0.05]} />
      <PosTerminal screen={pos} position={[0.25, 0.62, 0.03]} rotation={[0, -0.2, 0]} />
      <CardReader position={[-0.12, 0.62, 0.12]} rotation={[0, 0.4, 0]} />
      <KraftBox size={[0.22, 0.14, 0.18]} position={[-0.32, 0.62, -0.02]} rotation={[0, 0.3, 0]} />
      <MiniRack position={[0.0, 0, -0.5]} />
    </group>
  );
}

function WarehouseZone() {
  const boxes: [number, number, number, number][] = [
    [-0.32, 0.16, 0, 0.1],
    [0.0, 0.16, 0, -0.08],
    [0.3, 0.16, 0, 0.05],
    [-0.25, 0.68, 0, -0.04],
    [0.15, 0.68, 0, 0.12],
    [-0.05, 1.2, 0, 0.06],
  ];
  return (
    <group>
      <FloorTile size={[TILE - 0.01, TILE - 0.01]} />
      <Wall size={[TILE, 1.35]} position={[0, 0, -HALF + 0.05]} />
      <Wall size={[TILE, 1.35]} position={[-HALF + 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Shelf w={1.15} h={1.25} d={0.42} levels={3} position={[0.05, 0, -0.42]}>
        {boxes.map(([x, y, , r], i) => (
          <KraftBox key={i} size={[0.26, 0.2, 0.3]} position={[x, y - 0.01, 0]} rotation={[0, r, 0]} />
        ))}
      </Shelf>
      <KraftBox size={[0.34, 0.26, 0.3]} position={[0.3, 0, 0.3]} rotation={[0, 0.3, 0]} />
      <KraftBox size={[0.26, 0.2, 0.24]} position={[0.32, 0.26, 0.3]} rotation={[0, -0.1, 0]} />
    </group>
  );
}

function MarketplaceZone() {
  const k = useKit();
  return (
    <group>
      <FloorTile size={[TILE - 0.01, TILE - 0.01]} />
      <Wall size={[TILE, 1.35]} position={[0, 0, -HALF + 0.05]} />
      <Slab size={[0.42, 0.5, 0.42]} material={k.travertine} position={[0, 0, 0.05]} radius={0.02} />
      <KraftBox size={[0.24, 0.18, 0.2]} position={[0, 0.5, 0.05]} rotation={[0, 0.5, 0]} />
      {/* channel shelves on the wall, each holding the same box */}
      {[-0.45, 0, 0.45].map((x, i) => (
        <group key={x} position={[x, 0.95 + (i === 1 ? 0.12 : 0), -HALF + 0.2]}>
          <Slab size={[0.36, 0.025, 0.2]} material={k.oak} radius={0.005} />
          <KraftBox size={[0.13, 0.1, 0.11]} position={[0, 0.025, 0]} />
          <mesh position={[0, 0.2, 0.0]} material={[k.copperMatte, k.olive, k.inkMatte][i]}>
            <cylinderGeometry args={[0.035, 0.035, 0.012, 20]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Homepage chapters 1–3 in one world: the store diorama (hero), the store
 * splitting into four floating islands with mismatched stock (problem), and
 * the islands locking onto one base with a copper line through them (unify).
 * Driven by StageBus.progress; cursor tilts the world 3–4°.
 */
export default function WorldScene({ bus: rawBus }: SceneProps) {
  const bus = rawBus as StageBus;
  const size = useThree((s) => s.size);
  const k = useKit();
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const world = useRef<THREE.Group>(null);
  const zones = useRef<(THREE.Group | null)[]>([]);
  const undersides = useRef<(THREE.Group | null)[]>([]);
  const base = useRef<THREE.Group>(null);
  const line = useRef<THREE.Mesh>(null);
  const shopper = useRef<THREE.Group>(null);
  const p = useRef(0);
  const target = useMemo(() => new THREE.Vector3(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const screens = useMemo(() => ({ pos: posScreen().texture, site: siteScreen().texture }), []);

  // Copper line: one loop through the four zone centres, drawn in by progress.
  const lineGeo = useMemo(() => {
    const pts = [
      [-HALF, HALF],
      [HALF, HALF],
      [HALF, -HALF],
      [-HALF, -HALF],
      [-HALF, HALF],
    ].map(([x, z]) => new THREE.Vector3(x * 0.55, 0.012, z * 0.55));
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.2);
    return new THREE.TubeGeometry(curve, 200, 0.012, 8, false);
  }, []);

  const aspect = size.width / Math.max(1, size.height);
  const far = aspect < 1 ? 2.05 : aspect < 1.4 ? 1.35 : 1.16;

  useFrame((state, dt) => {
    const k = bus.reduced ? 1 : 1 - Math.exp(-5 * dt);
    p.current += (bus.progress - p.current) * k;
    const t = p.current;
    const split = ss(t, 0.18, 0.4) * (1 - ss(t, 0.56, 0.76));
    const unified = ss(t, 0.6, 0.8);
    const draw = ss(t, 0.7, 0.9);

    ZONES.forEach((z, i) => {
      const g = zones.current[i];
      if (!g) return;
      const [cx, cz] = z.center;
      const lift = [0.32, 0.12, 0.5, 0.24][i];
      const spread = (aspect < 1 ? 0.38 : 0.62) * split;
      g.position.set(cx + Math.sign(cx) * spread, lift * split + Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.03 * split, cz + Math.sign(cz) * spread);
      g.rotation.y = [0.1, -0.08, -0.12, 0.06][i] * split;
      const u = undersides.current[i];
      if (u) {
        u.scale.setScalar(0.001 + split);
        u.visible = split > 0.01;
      }
      bus.project(`zone-${z.id}`, tmp.set(g.position.x, g.position.y + 1.55, g.position.z), state.camera, size, t > 0.24);
    });

    if (base.current) {
      base.current.scale.set(1, 0.001 + unified, 1);
      base.current.visible = unified > 0.01;
    }
    if (line.current) {
      const count = lineGeo.index ? lineGeo.index.count : 0;
      lineGeo.setDrawRange(0, Math.floor(count * draw));
      line.current.visible = draw > 0.001;
    }

    // Camera: hero → pulled up for the islands → settled for unify
    if (cam.current) {
      const up = split;
      const d = (7.2 + up * 2.2 - unified * 0.6) * far;
      const h = 5.6 + up * 3 - unified * 0.5;
      cam.current.position.set(d * 0.72, h * far, d * 0.72);
      target.set(0, 0.35 + up * 0.25, 0);
      cam.current.lookAt(target);
      // hero: push the diorama right of the headline (wide) or below it (tall)
      const hero = 1 - ss(t, 0.08, 0.24);
      const ox = aspect >= 1 ? -size.width * 0.21 * hero : 0;
      const oy = aspect < 1 ? -size.height * 0.24 * hero : 0;
      cam.current.setViewOffset(size.width, size.height, ox, oy, size.width, size.height);
    }

    if (world.current) {
      const tiltX = bus.reduced ? 0 : state.pointer.y * 0.05;
      const tiltY = bus.reduced ? 0 : state.pointer.x * 0.06;
      world.current.rotation.x = THREE.MathUtils.damp(world.current.rotation.x, -tiltX, 3, dt);
      world.current.rotation.y = THREE.MathUtils.damp(world.current.rotation.y, tiltY, 3, dt);
    }

    if (shopper.current) {
      // face the camera around the vertical axis
      shopper.current.rotation.y = Math.atan2(state.camera.position.x - shopper.current.position.x, state.camera.position.z - shopper.current.position.z);
    }

    bus.tick();
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={24} near={0.1} far={80} />
      <StoreLight />
      <group ref={world}>
        <group ref={base} position={[0, -0.16, 0]}>
          <Slab size={[TILE * 2 + 0.3, 0.14, TILE * 2 + 0.3]} material={k.travertine} radius={0.04} position={[0, -0.14, 0]} />
        </group>
        <mesh ref={line} geometry={lineGeo} material={k.lightOn} />
        {ZONES.map((z, i) => (
          <group key={z.id} ref={(el) => void (zones.current[i] = el)}>
            <group ref={(el) => void (undersides.current[i] = el)} position={[0, -0.16, 0]}>
              <Slab size={[TILE * 0.9, 0.3, TILE * 0.9]} material={k.travertine} radius={0.08} position={[0, -0.3, 0]} />
            </group>
            {z.id === "web" && <WebZone laptop={screens.site} />}
            {z.id === "store" && (
              <>
                <StoreZone pos={screens.pos} />
                <group ref={shopper} position={[-0.25, 0.46, 0.55]}>
                  <VideoPlane clip={clips.walker} height={0.92} />
                </group>
              </>
            )}
            {z.id === "warehouse" && <WarehouseZone />}
            {z.id === "marketplace" && <MarketplaceZone />}
          </group>
        ))}
      </group>
    </>
  );
}
