import type { ComponentType } from "react";

/** Shared props every scene accepts. `step` lets the page drive the scene (chapter, tab, scroll progress). */
export type SceneProps = {
  step?: number;
  progress?: number;
  interactive?: boolean;
  /** Hotspot or tab currently focused on the DOM side. */
  focus?: string | null;
  /** Mutable state shared with a DOM controller (gestures, keyboard). Scene-specific shape. */
  bus?: unknown;
};

type Loader = () => Promise<{ default: ComponentType<SceneProps> }>;

// Every scene is its own chunk so three.js only loads where a scene is near.
export const sceneLoaders = {
  placeholder: () => import("./PlaceholderScene"),
  rack: () => import("./rack/RackScene"),
  world: () => import("./world/WorldScene"),
  laptop: () => import("./laptop/LaptopScene"),
  orders: () => import("./orders/OrderScene"),
  packing: () => import("./packing/PackScene"),
  delivery: () => import("./delivery/DeliveryScene"),
  pos: () => import("./instore/PosScene"),
  aisle: () => import("./instore/AisleScene"),
  kiosk: () => import("./instore/KioskScene"),
  rooms: () => import("./rooms/RoomsScene"),
} satisfies Record<string, Loader>;

export type SceneKey = keyof typeof sceneLoaders;
