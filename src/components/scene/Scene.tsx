"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useQuality, useRequestWebGL } from "@/lib/quality";
import { useCanvasReady } from "./SceneHost";
import { frameloop } from "@/three/frameloop";
import type { SceneKey, SceneProps } from "@/scenes/registry";

const SceneView = dynamic(() => import("@/three/SceneView"), { ssr: false });

/**
 * A 3D scene slot in the page. Poster first: the poster (or fallback) paints
 * immediately and stays for the low tier; on mid/high the scene loads when the
 * slot is within one viewport (load ahead), fades in over the poster when
 * ready, and unloads again once it is more than a viewport away (unload behind).
 */
export function Scene({
  scene,
  poster,
  alt = "",
  fallback,
  sceneProps,
  className = "",
  children,
}: {
  scene: SceneKey;
  /** Rendered still shown before 3D and on the low tier. */
  poster?: ReactNode;
  alt?: string;
  /** Shown when there is no poster yet. */
  fallback?: ReactNode;
  sceneProps?: SceneProps;
  className?: string;
  /** DOM overlays (hotspots, labels) above the scene. */
  children?: ReactNode;
}) {
  const id = useId();
  const tier = useQuality();
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const canvas = useCanvasReady();
  const request = useRequestWebGL();
  const webgl = (tier === "mid" || tier === "high") && canvas;

  // Being near the viewport is what asks the host for WebGL in the first place.
  useEffect(() => {
    const el = box.current;
    if (!el || tier === "low") return;
    const nearIO = new IntersectionObserver(
      ([e]) => {
        setNear(e.isIntersecting);
        if (e.isIntersecting) request();
        else setReady(false);
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    const visIO = new IntersectionObserver(([e]) => frameloop.setVisible(id, e.isIntersecting));
    nearIO.observe(el);
    visIO.observe(el);
    return () => {
      nearIO.disconnect();
      visIO.disconnect();
      frameloop.setVisible(id, false);
    };
  }, [id, tier, request]);

  const onReady = useCallback(() => setReady(true), []);

  return (
    <div className={`relative ${className}`} data-scene={scene} data-ready={ready || undefined}>
      <div
        aria-hidden={!alt || undefined}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        className={`absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out)] ${ready ? "opacity-0" : "opacity-100"}`}
      >
        {poster ?? fallback}
      </div>
      <div ref={box} aria-hidden className="pointer-events-none absolute inset-0" />
      {webgl && near && <SceneView scene={scene} onReady={onReady} sceneProps={sceneProps} />}
      {children && <div className="pointer-events-none absolute inset-0 z-40 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">{children}</div>}
    </div>
  );
}
