"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StageBus } from "@/three/stageBus";

gsap.registerPlugin(ScrollTrigger);

/**
 * A pinned chapter: a sticky full-height viewport that stays put while the
 * visitor scrolls `length` viewports. Scroll progress goes to the scene via a
 * StageBus and to the DOM as `--p` and the active step.
 * Reduced-motion visitors get the same content as normal scrolling sections
 * (`stacked`). Everyone else, including the low tier (posters instead of 3D),
 * gets the pinned layout, which is also what the server renders, so the hero
 * never shifts on hydration.
 */
export function ScrollStage({
  id,
  length = 3,
  steps,
  stage,
  stacked,
  className = "",
  onStep,
  onProgress,
}: {
  id?: string;
  length?: number;
  /** Progress ranges for each copy step: [start, end]. */
  steps: [number, number][];
  /** The pinned visual: receives the bus and the active step. */
  stage: (bus: StageBus, active: number) => ReactNode;
  /** Unpinned version for still visitors. */
  stacked: (bus: StageBus) => ReactNode;
  className?: string;
  onStep?: (step: number) => void;
  /** Called on every scroll update with 0–1 progress (for DOM transforms; no re-render). */
  onProgress?: (p: number) => void;
}) {
  const [bus] = useState(() => new StageBus());
  const section = useRef<HTMLElement>(null);
  const [still, setStill] = useState(false);
  const [active, setActive] = useState(0);
  const onStepRef = useRef(onStep);
  const onProgressRef = useRef(onProgress);
  useEffect(() => {
    onStepRef.current = onStep;
    onProgressRef.current = onProgress;
  });

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    bus.setReduced(reduce);
    if (!reduce) return;
    const raf = requestAnimationFrame(() => setStill(true));
    return () => cancelAnimationFrame(raf);
  }, [bus]);

  useEffect(() => {
    const el = section.current;
    if (still || !el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        bus.setProgress(self.progress);
        el.style.setProperty("--p", self.progress.toFixed(4));
        onProgressRef.current?.(self.progress);
        let s = 0;
        steps.forEach(([a], i) => {
          if (self.progress >= a) s = i;
        });
        if (s !== bus.step) onStepRef.current?.(s);
        setActive(s);
        bus.setStep(s);
      },
    });
    return () => st.kill();
  }, [still, bus, steps]);

  if (still) {
    return (
      <section id={id} className={className}>
        {stacked(bus)}
      </section>
    );
  }

  return (
    <section id={id} ref={section} className={`relative ${className}`} style={{ height: `${length * 100}svh` }}>
      {/* sticky makes its own stacking context: lift it above the canvas (z-30); transparent areas show the 3D */}
      <div className="sticky top-0 z-40 h-[100svh] overflow-hidden">{stage(bus, active)}</div>
    </section>
  );
}
