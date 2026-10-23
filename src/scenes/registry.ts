import type { ComponentType } from "react";

/** Shared props every scene accepts. `step` lets the page drive the scene (chapter, tab, scroll progress). */
export type SceneProps = {
  step?: number;
  progress?: number;
  interactive?: boolean;
  /** Hotspot or tab currently focused on the DOM side. */
  focus?: string | null;
};

type Loader = () => Promise<{ default: ComponentType<SceneProps> }>;

// Every scene is its own chunk so three.js only loads where a scene is near.
export const sceneLoaders = {
  placeholder: () => import("./PlaceholderScene"),
} satisfies Record<string, Loader>;

export type SceneKey = keyof typeof sceneLoaders;
