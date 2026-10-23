import type { SolutionSlug } from "./site";

/** Front matter exported from every company/legal MDX file as `meta`. */
export type DocMeta = {
  title: string;
  description: string;
  eyebrow: string;
  /** Headline with one *italic* accent word, e.g. "Built by *people* who ship." */
  headline: string;
  /** Light pages: no WebGL, only the terrazzo texture. */
  light?: boolean;
  /** Shown as a note when the page still needs owner review (legal, figures). */
  draftNote?: string;
  /** About: numbered principles, revealed one by one. */
  principles?: { title: string; body: string }[];
  /** About: the company family, shown as three linked rooms. */
  family?: { name: string; role: string; href: string; current?: boolean; poster: string }[];
  /** Security / Infrastructure: layers of the exploded illustration, one per h2 in the body. */
  layers?: { label: string; detail: string }[];
};

export type Hotspot = {
  id: string;
  label: string;
  detail: string;
  /** Position on the poster/scene in percent of width/height. */
  x: number;
  y: number;
};

export type Capability = { title: string; body: string };

export type Faq = { q: string; a: string };

/** One labelled part in the anatomy block; its 3D anchor lives in the scene. */
export type Part = { id: string; label: string; detail: string };

/** The hero's signature interaction, rendered by a generic control. */
export type Interaction =
  | { kind: "rack"; label: string; hint: string }
  | {
      kind: "slider";
      label: string;
      hint: string;
      /** Readout shown next to the slider: lerp(from, to, value) with a unit, or a clock time. */
      readout?: { from: number; to: number; unit?: string; format?: "number" | "clock"; prefix?: string };
      /** Dragging across the scene also moves the slider. */
      drag?: boolean;
    }
  | { kind: "toggles"; label: string; hint: string; options: { id: string; label: string }[]; initial?: number }
  | { kind: "pick"; label: string; hint: string; options: { id: string; label: string; detail?: string }[] };

/** Front matter exported from every solution MDX file as `meta`. The MDX body is the problem narrative. */
export type SolutionMeta = {
  slug: SolutionSlug;
  title: string;
  description: string;
  eyebrow: string;
  /** Headline with one *italic* accent word. */
  headline: string;
  promise: string;
  /** Scene module key in src/scenes/registry.ts */
  scene: string;
  interaction: Interaction;
  problem: { title: string; broken: string };
  fix: { title: string; steps: string[]; fixed: string };
  anatomy: Part[];
  /** Each capability tab moves the camera to the scene's view n + 1. */
  capabilities: Capability[];
  worksWith: SolutionSlug[];
  faq: Faq[];
};
