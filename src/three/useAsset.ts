"use client";

import { useGLTF } from "@react-three/drei";

/**
 * Loads a scene GLB. Assets are expected Meshopt-compressed (gltfpack / gltf-transform),
 * Draco is accepted as a fallback. Suspends until loaded, so wrap in <Suspense>;
 * the <Scene> poster stays up meanwhile.
 */
export function useAsset(url: string) {
  return useGLTF(url, true, true);
}

/** Start fetching the next chapter's GLB while the current one is on screen. */
export function preloadAsset(url: string) {
  useGLTF.preload(url, true, true);
}

/** Drop a GLB from the cache once its chapter is two behind. */
export function releaseAsset(url: string) {
  useGLTF.clear(url);
}
