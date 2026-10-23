"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { QualityProvider, useQuality } from "@/lib/quality";

const SceneCanvas = dynamic(() => import("@/three/SceneCanvas"), { ssr: false });

/** Mounts the shared canvas only for mid/high tiers, and only after the page is idle. */
function CanvasGate({ container }: { container: React.RefObject<HTMLDivElement | null> }) {
  const tier = useQuality();
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (tier !== "mid" && tier !== "high") return;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ric(() => setIdle(true), { timeout: 1500 });
    return () => cic(id);
  }, [tier]);

  if (!idle || (tier !== "mid" && tier !== "high")) return null;
  return <SceneCanvas eventSource={container as React.RefObject<HTMLElement>} tier={tier} />;
}

export function SceneHost({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  return (
    <QualityProvider>
      <div ref={container} className="relative">
        {children}
        <CanvasGate container={container} />
      </div>
    </QualityProvider>
  );
}
