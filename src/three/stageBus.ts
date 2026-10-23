import * as THREE from "three";

export type LabelPos = { x: number; y: number; visible: boolean };

/**
 * Shared state between a scroll-driven DOM stage and its scene. The DOM writes
 * scroll progress and interaction intent; the scene reads them every frame and
 * writes back screen positions for DOM labels anchored to 3D points.
 */
export class StageBus {
  /**
   * How a solution scene should behave: "live" (hero: fixed state + signature
   * interaction), "scrub" (progress drives broken → fixed), "inside" (fixed
   * state; step picks a camera view, focus highlights a part).
   */
  mode: "live" | "scrub" | "inside" = "scrub";
  /** True when the scene fills a pinned full-screen stage (set by ScrollStage); boxed scenes stay false. */
  fullBleed = false;
  /** Raw 0–1 scroll progress through the stage. */
  progress = 0;
  /** Discrete step chosen by the DOM (tab, hotspot, chapter). */
  step = 0;
  /** Free-form id the DOM has focused (hotspot id, ticket id). */
  focus: string | null = null;
  reduced = false;
  /** Generic interaction value (drag, slider), scene-specific meaning. */
  value = 0;
  frame = 0;
  readonly labels = new Map<string, LabelPos>();
  private listeners = new Set<() => void>();

  setMode(m: "live" | "scrub" | "inside") {
    this.mode = m;
  }
  setFullBleed(v: boolean) {
    this.fullBleed = v;
  }
  setProgress(p: number) {
    this.progress = p;
  }
  setStep(s: number) {
    this.step = s;
  }
  setFocus(id: string | null) {
    this.focus = id;
  }
  setValue(v: number) {
    this.value = v;
  }
  setReduced(v: boolean) {
    this.reduced = v;
  }

  /** Scene side: project a world point into the view box (CSS px from its top-left). */
  project(id: string, world: THREE.Vector3, camera: THREE.Camera, size: { width: number; height: number }, visible = true) {
    const v = tmp.copy(world).project(camera);
    const pos = this.labels.get(id) ?? { x: 0, y: 0, visible: false };
    pos.x = ((v.x + 1) / 2) * size.width;
    pos.y = ((1 - v.y) / 2) * size.height;
    pos.visible = visible && v.z < 1;
    this.labels.set(id, pos);
  }
  /** Scene side: call once per rendered frame after projecting. */
  tick() {
    this.frame++;
    this.listeners.forEach((l) => l());
  }
  /** DOM side: run after every scene frame (no React re-render). */
  subscribe(l: () => void) {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  }
}

const tmp = new THREE.Vector3();
