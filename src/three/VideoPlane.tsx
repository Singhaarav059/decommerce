"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { pickAlphaSource, wantsStill } from "@/lib/media";
import type { AlphaClip } from "@/components/media/AlphaVideo";

/**
 * An alpha character loop on a plane inside a 3D scene (layer 2 of the plan).
 * Height is in world units; width follows the clip's aspect. Plays while the
 * scene is mounted; still visitors get the poster as a texture instead.
 */
export function VideoPlane({
  clip,
  height = 1.6,
  position,
  rotation,
  opacity = 1,
}: {
  clip: AlphaClip;
  height?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  opacity?: number;
}) {
  const still = useMemo(() => wantsStill(), []);

  const { texture, video } = useMemo(() => {
    if (still) {
      const tex = new THREE.TextureLoader().load(clip.poster);
      tex.colorSpace = THREE.SRGBColorSpace;
      return { texture: tex as THREE.Texture, video: null };
    }
    const v = document.createElement("video");
    v.src = pickAlphaSource(clip);
    v.crossOrigin = "anonymous";
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = "auto";
    const tex = new THREE.VideoTexture(v);
    tex.colorSpace = THREE.SRGBColorSpace;
    return { texture: tex as THREE.Texture, video: v };
  }, [clip, still]);

  useEffect(() => {
    video?.play().catch(() => {});
    return () => {
      video?.pause();
      if (video) video.removeAttribute("src");
      video?.load();
      texture.dispose();
    };
  }, [video, texture]);

  const width = (height * clip.width) / clip.height;
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}
