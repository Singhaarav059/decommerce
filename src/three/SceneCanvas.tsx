"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, View } from "@react-three/drei";
import { dprFor, type Tier } from "@/lib/quality";
import { frameloop } from "./frameloop";

function usePageVisible() {
  return useSyncExternalStore(
    (cb) => {
      document.addEventListener("visibilitychange", cb);
      return () => document.removeEventListener("visibilitychange", cb);
    },
    () => document.visibilityState === "visible",
    () => true,
  );
}

/**
 * The one WebGL canvas for the whole page. Fixed over the viewport with
 * pointer-events off; every section's scene is a drei <View> rendered into it
 * through <View.Port>. Events come from the page container (eventSource).
 */
export default function SceneCanvas({ eventSource, tier }: { eventSource: RefObject<HTMLElement>; tier: Tier }) {
  const anyVisible = useSyncExternalStore(frameloop.subscribe, frameloop.anyVisible, () => false);
  const pageVisible = usePageVisible();
  const [range] = useState(() => dprFor(tier));
  const [dpr, setDpr] = useState(range[1]);

  // Drop a resolution step if the device can't keep up, recover if it can.
  const onDecline = () => setDpr((d) => Math.max(range[0], +(d - 0.25).toFixed(2)));
  const onIncline = () => setDpr((d) => Math.min(range[1], +(d + 0.25).toFixed(2)));

  useEffect(() => {
    document.documentElement.dataset.canvas = "on";
    return () => {
      delete document.documentElement.dataset.canvas;
    };
  }, []);

  return (
    <Canvas
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix="client"
      frameloop={anyVisible && pageVisible ? "always" : "never"}
      dpr={dpr}
      gl={{ antialias: tier === "high", alpha: true, powerPreference: "high-performance", stencil: false }}
      camera={{ position: [0, 0, 6], fov: 35 }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 30 }}
      aria-hidden
      onCreated={(state) => {
        if (process.env.NODE_ENV !== "production") (window as unknown as { __r3f: unknown }).__r3f = state;
      }}
    >
      <PerformanceMonitor onDecline={onDecline} onIncline={onIncline} flipflops={3} />
      <View.Port />
    </Canvas>
  );
}
