"use client";

import { useEffect, useState } from "react";
import { Scene } from "@/components/scene/Scene";
import { SceneHost } from "@/components/scene/SceneHost";
import { sceneLoaders, type SceneKey } from "@/scenes/registry";
import { StageBus } from "@/three/stageBus";

/**
 * Renders one scene full-screen with progress set from the URL (?scene=&p=)
 * or from window.__capture.set(p), with damping off so every frame is exact.
 * The background is the page's travertine so frames match the site.
 */
export function CaptureStage() {
  const [bus] = useState(() => {
    const b = new StageBus();
    b.setReduced(true);
    return b;
  });
  const [scene, setScene] = useState<SceneKey | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const key = q.get("scene") as SceneKey | null;
    bus.setProgress(Number(q.get("p") ?? 0));
    bus.setStep(Number(q.get("step") ?? 0));
    const mode = q.get("mode");
    if (mode === "live" || mode === "scrub" || mode === "inside") bus.setMode(mode);
    if (q.has("v")) bus.setValue(Number(q.get("v")));
    if (q.has("focus")) bus.setFocus(q.get("focus"));
    (window as unknown as { __capture: unknown }).__capture = {
      set: (p: number) => bus.setProgress(p),
      step: (s: number) => bus.setStep(s),
      frame: () => bus.frame,
    };
    const raf = requestAnimationFrame(() => setScene(key && key in sceneLoaders ? key : null));
    return () => cancelAnimationFrame(raf);
  }, [bus]);

  return (
    <SceneHost>
      <main className="fixed inset-0 bg-stone-50">
        {scene && <Scene scene={scene} className="size-full" sceneProps={{ bus }} />}
      </main>
    </SceneHost>
  );
}
