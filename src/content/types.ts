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

/** Front matter exported from every solution MDX file as `meta`. */
export type SolutionMeta = {
  slug: SolutionSlug;
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  promise: string;
  status: "available" | "coming-soon";
  problem: { title: string; body: string; broken: string };
  fix: { title: string; steps: string[]; fixed: string };
  scene: { name: string; interaction: string };
  anatomy: Hotspot[];
  capabilities: Capability[];
  worksWith: SolutionSlug[];
  faq: Faq[];
};
