"use client";

import { forwardRef, useMemo, type ReactNode } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";
import { brushedTexture, kraftTexture, terrazzoTexture, travertineTexture } from "./textures";

// The store-world kit: every scene on the site is assembled from these parts
// and materials so all pages feel like rooms in one building.

type Group = ThreeElements["group"];

let M: ReturnType<typeof build> | null = null;
function build() {
  const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p);
  return {
    terrazzo: std({ map: terrazzoTexture(2), roughness: 0.55 }),
    terrazzoFine: std({ map: terrazzoTexture(4), roughness: 0.5 }),
    travertine: std({ map: travertineTexture(1), roughness: 0.8 }),
    stone: std({ color: "#f1ece4", roughness: 0.85 }),
    copper: std({ color: "#c2602a", metalness: 1, roughness: 0.3 }),
    copperMatte: std({ color: "#c2602a", roughness: 0.6 }),
    steel: std({ color: "#c3c8ca", map: brushedTexture(), metalness: 1, roughness: 0.34 }),
    ink: std({ color: "#1d1b16", roughness: 0.45 }),
    inkMatte: std({ color: "#25221c", roughness: 0.8 }),
    oak: std({ color: "#8a5a32", roughness: 0.6 }),
    kraft: std({ map: kraftTexture(), roughness: 0.92 }),
    tape: std({ color: "#c9a77a", roughness: 0.5 }),
    paper: std({ color: "#fbf8f2", roughness: 0.9 }),
    olive: std({ color: "#7d8466", roughness: 0.7 }),
    oliveDark: std({ color: "#555d40", roughness: 0.8 }),
    bark: std({ color: "#5b4a3a", roughness: 0.9 }),
    linen: std({ color: "#d9cfbf", roughness: 0.9 }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.05, transmission: 0, transparent: true, opacity: 0.18 }),
    rubber: std({ color: "#2c2a26", roughness: 0.95 }),
    alert: std({ color: "#a13d1c", roughness: 0.5 }),
    lightOff: std({ color: "#d8cfc2", roughness: 0.6 }),
    lightOn: std({ color: "#c2602a", emissive: new THREE.Color("#c2602a"), emissiveIntensity: 1.4, roughness: 0.5, toneMapped: false }),
  };
}
export type KitMaterials = ReturnType<typeof build>;
export function useKit(): KitMaterials {
  if (!M) M = build();
  return M;
}

/** Rounded slab, the basic building block. Size is [w, h, d]; sits on y=0. */
export const Slab = forwardRef<THREE.Mesh, { size: [number, number, number]; material: THREE.Material; radius?: number } & Omit<ThreeElements["mesh"], "args">>(
  function Slab({ size, material, radius = 0.02, position = [0, 0, 0], ...rest }, ref) {
    const [w, h, d] = size;
    const p = position as [number, number, number];
    return (
      <RoundedBox ref={ref} args={[w, h, d]} radius={Math.min(radius, h / 2, w / 2, d / 2)} smoothness={3} position={[p[0], p[1] + h / 2, p[2]]} material={material} {...rest} />
    );
  },
);

/** Terrazzo floor tile with a travertine edge band. */
export function FloorTile({ size = [3, 3], thickness = 0.16, ...g }: { size?: [number, number]; thickness?: number } & Group) {
  const k = useKit();
  return (
    <group {...g}>
      <Slab size={[size[0], thickness, size[1]]} material={k.terrazzo} radius={0.03} position={[0, -thickness, 0]} />
    </group>
  );
}

export function Wall({ size = [3, 1.6], thickness = 0.1, ...g }: { size?: [number, number]; thickness?: number } & Group) {
  const k = useKit();
  return (
    <group {...g}>
      <Slab size={[size[0], size[1], thickness]} material={k.travertine} radius={0.015} />
    </group>
  );
}

/** Shop counter: travertine body, stone top, copper kick strip. */
export function Counter({ w = 1.4, d = 0.55, h = 0.62, ...g }: { w?: number; d?: number; h?: number } & Group) {
  const k = useKit();
  return (
    <group {...g}>
      <Slab size={[w, h - 0.04, d]} material={k.travertine} radius={0.02} />
      <Slab size={[w + 0.04, 0.04, d + 0.04]} material={k.stone} radius={0.01} position={[0, h - 0.04, 0]} />
      <Slab size={[w - 0.02, 0.035, 0.01]} material={k.copper} radius={0.004} position={[0, 0.02, d / 2 + 0.002]} />
    </group>
  );
}

/** Card terminal / till with a screen surface. Pass a texture for the screen. */
export function PosTerminal({ screen, ...g }: { screen?: THREE.Texture } & Group) {
  const k = useKit();
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: screen ?? null, color: screen ? "#ffffff" : "#f5f2ed", toneMapped: false }),
    [screen],
  );
  return (
    <group {...g}>
      <Slab size={[0.2, 0.03, 0.16]} material={k.steel} radius={0.01} />
      <mesh position={[0, 0.1, -0.02]} rotation={[-0.25, 0, 0]} material={k.steel}>
        <cylinderGeometry args={[0.018, 0.024, 0.16, 16]} />
      </mesh>
      <group position={[0, 0.2, -0.01]} rotation={[-0.42, 0, 0]}>
        <Slab size={[0.3, 0.2, 0.02]} material={k.ink} radius={0.012} position={[0, -0.1, 0]} />
        <mesh position={[0, 0, 0.0115]} material={mat}>
          <planeGeometry args={[0.27, 0.17]} />
        </mesh>
      </group>
    </group>
  );
}

/** Handheld card reader on its own. */
export function CardReader(g: Group) {
  const k = useKit();
  return (
    <group {...g}>
      <Slab size={[0.09, 0.025, 0.15]} material={k.ink} radius={0.012} />
      <mesh position={[0, 0.026, -0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.07, 0.07]} />
        <meshBasicMaterial color="#3a362e" toneMapped={false} />
      </mesh>
      <Slab size={[0.05, 0.004, 0.02]} material={k.copper} radius={0.002} position={[0, 0.025, 0.045]} />
    </group>
  );
}

/** Laptop with an open lid; `open` 0..1, screen texture optional. */
export function Laptop({ screen, open = 1, ...g }: { screen?: THREE.Texture; open?: number } & Group) {
  const k = useKit();
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: screen ?? null, color: screen ? "#ffffff" : "#e9e3d8", toneMapped: false }),
    [screen],
  );
  const angle = -Math.PI / 2 + open * (Math.PI / 2 + 0.28);
  return (
    <group {...g}>
      <Slab size={[0.56, 0.018, 0.38]} material={k.steel} radius={0.008} />
      <Slab size={[0.46, 0.002, 0.18]} material={k.inkMatte} radius={0.001} position={[0, 0.018, -0.05]} />
      <group position={[0, 0.018, -0.19]} rotation={[angle, 0, 0]}>
        <Slab size={[0.56, 0.36, 0.012]} material={k.steel} radius={0.008} position={[0, 0, -0.006]} />
        <mesh position={[0, 0.185, 0.0005]} material={mat}>
          <planeGeometry args={[0.52, 0.33]} />
        </mesh>
      </group>
    </group>
  );
}

/** Kraft shipping box with tape across the top. */
export function KraftBox({ size = [0.3, 0.22, 0.24], taped = true, ...g }: { size?: [number, number, number]; taped?: boolean } & Group) {
  const k = useKit();
  const [w, h, d] = size;
  return (
    <group {...g}>
      <Slab size={size} material={k.kraft} radius={0.008} />
      {taped && <Slab size={[w * 0.18, 0.004, d + 0.004]} material={k.tape} radius={0.001} position={[0, h - 0.001, 0]} />}
    </group>
  );
}

/** Steel shelving with oak boards. */
export function Shelf({ w = 1.2, h = 1.3, d = 0.4, levels = 3, children, ...g }: { w?: number; h?: number; d?: number; levels?: number; children?: ReactNode } & Group) {
  const k = useKit();
  const ys = Array.from({ length: levels }, (_, i) => 0.12 + (i * (h - 0.2)) / Math.max(1, levels - 1));
  return (
    <group {...g}>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[(sx * (w - 0.04)) / 2, h / 2, (sz * (d - 0.04)) / 2]} material={k.steel}>
            <boxGeometry args={[0.025, h, 0.025]} />
          </mesh>
        )),
      )}
      {ys.map((y) => (
        <Slab key={y} size={[w, 0.03, d]} material={k.oak} radius={0.006} position={[0, y, 0]} />
      ))}
      {children}
    </group>
  );
}

/** Olive tree in a stone pot. Foliage is clustered low-poly leaves. */
export function OliveTree({ height = 1.4, seed = 1, ...g }: { height?: number; seed?: number } & Group) {
  const k = useKit();
  const clusters = useMemo(() => {
    let s = seed * 9301 + 49297;
    const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: 34 }, () => {
      const a = r() * Math.PI * 2;
      const rad = Math.sqrt(r()) * 0.3;
      return {
        p: [Math.cos(a) * rad, height * 0.66 + r() * height * 0.34, Math.sin(a) * rad] as [number, number, number],
        s: 0.055 + r() * 0.06,
        dark: r() > 0.55,
      };
    });
  }, [height, seed]);
  return (
    <group {...g}>
      <mesh position={[0, 0.17, 0]} material={k.stone}>
        <cylinderGeometry args={[0.2, 0.15, 0.34, 28]} />
      </mesh>
      <mesh position={[0, 0.335, 0]} rotation={[-Math.PI / 2, 0, 0]} material={k.bark}>
        <circleGeometry args={[0.18, 24]} />
      </mesh>
      <mesh position={[0.02, height * 0.5, 0]} rotation={[0, 0, 0.08]} material={k.bark}>
        <cylinderGeometry args={[0.022, 0.035, height * 0.7, 8]} />
      </mesh>
      {clusters.map((c, i) => (
        <mesh key={i} position={c.p} scale={[c.s * 1.4, c.s, c.s * 1.2]} material={c.dark ? k.oliveDark : k.olive}>
          <icosahedronGeometry args={[1, 1]} />
        </mesh>
      ))}
    </group>
  );
}

/** Open bin with a status light strip at the front. */
export function Bin({ lit = false, label, ...g }: { lit?: boolean; label?: string } & Group) {
  const k = useKit();
  void label;
  return (
    <group {...g}>
      <Slab size={[0.26, 0.14, 0.3]} material={k.stone} radius={0.01} />
      <Slab size={[0.2, 0.012, 0.012]} material={lit ? k.lightOn : k.lightOff} radius={0.004} position={[0, 0.1, 0.152]} />
    </group>
  );
}

/** Roller conveyor of a given length along x. */
export function Conveyor({ length = 2, width = 0.5, ...g }: { length?: number; width?: number } & Group) {
  const k = useKit();
  const rollers = Math.floor(length / 0.09);
  return (
    <group {...g}>
      {[-1, 1].map((s) => (
        <Slab key={s} size={[length, 0.06, 0.03]} material={k.steel} radius={0.006} position={[0, 0.36, (s * width) / 2]} />
      ))}
      {Array.from({ length: rollers }, (_, i) => (
        <mesh key={i} position={[-length / 2 + 0.05 + i * 0.09, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]} material={k.steel}>
          <cylinderGeometry args={[0.022, 0.022, width - 0.02, 10]} />
        </mesh>
      ))}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[(sx * (length - 0.1)) / 2, 0.18, (sz * width) / 2]} material={k.steel}>
            <boxGeometry args={[0.03, 0.36, 0.03]} />
          </mesh>
        )),
      )}
    </group>
  );
}

/** Small delivery van: ink body, copper stripe. Faces +x. */
export function Van(g: Group) {
  const k = useKit();
  return (
    <group {...g}>
      <Slab size={[0.9, 0.42, 0.44]} material={k.stone} radius={0.05} position={[-0.1, 0.1, 0]} />
      <Slab size={[0.36, 0.3, 0.44]} material={k.stone} radius={0.06} position={[0.5, 0.1, 0]} />
      <Slab size={[0.2, 0.15, 0.42]} material={k.glass} radius={0.03} position={[0.56, 0.24, 0]} />
      <Slab size={[1.22, 0.04, 0.445]} material={k.copper} radius={0.01} position={[0.03, 0.24, 0]} />
      {[-0.42, 0.42].map((x) =>
        [-1, 1].map((s) => (
          <mesh key={`${x}${s}`} position={[x, 0.09, s * 0.22]} rotation={[Math.PI / 2, 0, 0]} material={k.rubber}>
            <cylinderGeometry args={[0.09, 0.09, 0.07, 20]} />
          </mesh>
        )),
      )}
    </group>
  );
}

/** Paper order ticket; pass a drawn texture for the print. */
export function Ticket({ print, ...g }: { print?: THREE.Texture } & Group) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ map: print ?? null, color: "#fbf8f2", roughness: 0.9, side: THREE.DoubleSide }), [print]);
  return (
    <group {...g}>
      <mesh material={mat} castShadow={false}>
        <planeGeometry args={[0.26, 0.4]} />
      </mesh>
    </group>
  );
}

/** Floating island: a terrazzo tile with a travertine underside, for the "four islands" chapter. */
export function Island({ size = [1.4, 1.4], children, ...g }: { size?: [number, number]; children?: ReactNode } & Group) {
  const k = useKit();
  return (
    <group {...g}>
      <Slab size={[size[0], 0.12, size[1]]} material={k.terrazzo} radius={0.03} position={[0, -0.12, 0]} />
      <Slab size={[size[0] * 0.92, 0.22, size[1] * 0.92]} material={k.travertine} radius={0.05} position={[0, -0.32, 0]} />
      {children}
    </group>
  );
}
