"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { StageBus } from "@/three/stageBus";

/**
 * DOM labels pinned to 3D points. The scene projects each id every frame;
 * this moves the matching elements with transforms (no React re-render).
 * Labels without a projected position stay at their fallback CSS position,
 * which is what the low tier and the poster show.
 */
export function SceneLabels({
  bus,
  items,
  className = "",
}: {
  bus: StageBus;
  items: { id: string; node: ReactNode; fallback?: { left: string; top: string } }[];
  className?: string;
}) {
  const refs = useRef(new Map<string, HTMLDivElement>());
  const root = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      bus.subscribe(() => {
        const box = root.current?.clientWidth ?? 0;
        for (const [id, el] of refs.current) {
          const p = bus.labels.get(id);
          if (!p) continue;
          // keep the whole label inside the frame
          const half = el.offsetWidth / 2 + 8;
          const x = box ? Math.min(Math.max(p.x, half), box - half) : p.x;
          el.style.left = "0px";
          el.style.top = "0px";
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -100%)`;
          el.style.opacity = p.visible ? "" : "0";
        }
      }),
    [bus],
  );

  return (
    <div ref={root} className={`pointer-events-none absolute inset-0 ${className}`}>
      {items.map((it) => (
        <div
          key={it.id}
          ref={(el) => {
            if (el) refs.current.set(it.id, el);
            else refs.current.delete(it.id);
          }}
          className="absolute transition-opacity duration-300 will-change-transform"
          style={{ left: it.fallback?.left ?? "50%", top: it.fallback?.top ?? "50%", transform: "translate(-50%, -100%)" }}
        >
          {it.node}
        </div>
      ))}
    </div>
  );
}
