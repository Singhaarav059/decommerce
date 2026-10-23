"use client";

import { Slab, useKit } from "@/three/kit";
import { StoreLight } from "@/three/StoreLight";

/** Light, terrazzo floor and travertine back wall shared by the small in-store scenes (camera comes from the rig). */
export function Room() {
  const k = useKit();
  return (
    <>
      <StoreLight />
      <Slab size={[6, 0.05, 4]} material={k.terrazzo} position={[0, -0.05, -0.5]} radius={0.01} />
      <Slab size={[6, 2.4, 0.1]} material={k.travertine} position={[0, 0, -1.2]} radius={0.01} />
    </>
  );
}

/** Progress for the in-store scenes: scroll in scrub mode, the slider in live mode, finished inside. */
export function phase(mode: "live" | "scrub" | "inside", fixed: number, value: number, liveUsesValue: boolean) {
  if (mode === "scrub") return fixed;
  if (mode === "live") return liveUsesValue ? value : 1;
  return 1;
}
