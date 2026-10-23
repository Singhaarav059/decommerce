"use client";

import dynamic from "next/dynamic";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { QualityProvider, useQuality } from "@/lib/quality";

const SceneCanvas = dynamic(() => import("@/three/SceneCanvas"), { ssr: false });

const CanvasContext = createContext(false);
/** True once the shared canvas is mounted; scenes load their 3D only after that. */
export function useCanvasReady() {
  return useContext(CanvasContext);
}

/**
 * Mounts the shared canvas for mid/high tiers once a scene has asked for it.
 * Desktop: after the page is idle. Touch devices: after the first scroll or
 * touch (PLAN: phones show posters until the visitor scrolls), so three.js
 * never competes with the first paint on a phone.
 */
function useCanvasGate() {
  const tier = useQuality();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (tier !== "mid" && tier !== "high") return;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cic = window.cancelIdleCallback ?? window.clearTimeout;
    let idle = 0;
    const go = () => {
      idle = ric(() => setOpen(true), { timeout: 1500 });
    };
    if (!matchMedia("(pointer: coarse)").matches) {
      go();
      return () => cic(idle);
    }
    const events = ["scroll", "pointerdown", "touchstart", "keydown"] as const;
    const first = () => {
      events.forEach((e) => removeEventListener(e, first));
      go();
    };
    events.forEach((e) => addEventListener(e, first, { passive: true, once: true }));
    return () => {
      events.forEach((e) => removeEventListener(e, first));
      cic(idle);
    };
  }, [tier]);
  return open && (tier === "mid" || tier === "high") ? tier : null;
}

function Gate({ container, children }: { container: React.RefObject<HTMLDivElement | null>; children: ReactNode }) {
  const tier = useCanvasGate();
  return (
    <CanvasContext.Provider value={!!tier}>
      {children}
      {tier && <SceneCanvas eventSource={container as React.RefObject<HTMLElement>} tier={tier} />}
    </CanvasContext.Provider>
  );
}

export function SceneHost({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  return (
    <QualityProvider>
      <div ref={container} className="relative">
        <Gate container={container}>{children}</Gate>
      </div>
    </QualityProvider>
  );
}
