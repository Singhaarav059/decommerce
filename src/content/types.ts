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


export type Capability = { title: string; body: string };

export type Faq = { q: string; a: string };

/** One labelled part in the anatomy block; its 3D anchor lives in the scene. */
export type Part = { id: string; label: string; detail: string };

/** Front matter exported from every solution MDX file as `meta`. The MDX body is the problem narrative. */
export type SolutionMeta = {
  slug: SolutionSlug;
  title: string;
  description: string;
  eyebrow: string;
  /** Headline with one *italic* accent word. */
  headline: string;
  promise: string;
  problem: { title: string; broken: string };
  fix: { title: string; steps: string[]; fixed: string };
  anatomy: Part[];
  /** Each capability tab shows its own frame of the page's film. */
  capabilities: Capability[];
  worksWith: SolutionSlug[];
  faq: Faq[];
};
