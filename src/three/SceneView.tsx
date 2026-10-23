"use client";

import { Suspense, useEffect, useState, type ComponentType } from "react";
import { View } from "@react-three/drei";
import { sceneLoaders, type SceneKey, type SceneProps } from "@/scenes/registry";

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

/**
 * The WebGL half of a <Scene>: loads the scene module on demand and renders it
 * into the shared canvas through a drei View. Outside a Canvas, drei's View
 * ignores `track` and tracks the div it renders itself, so that div is sized
 * to fill the scene box (it is also the pointer-event target for raycasts).
 */
export default function SceneView({
  scene,
  onReady,
  sceneProps,
}: {
  scene: SceneKey;
  onReady: () => void;
  sceneProps?: SceneProps;
}) {
  const [Comp, setComp] = useState<ComponentType<SceneProps> | null>(null);

  useEffect(() => {
    let alive = true;
    sceneLoaders[scene]().then((m) => alive && setComp(() => m.default));
    return () => {
      alive = false;
    };
  }, [scene]);

  if (!Comp) return null;
  return (
    <View className="absolute inset-0">
      <Suspense fallback={null}>
        <Comp {...sceneProps} />
        <Ready onReady={onReady} />
      </Suspense>
    </View>
  );
}
