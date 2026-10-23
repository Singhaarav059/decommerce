"use client";

import { useEffect, useRef } from "react";
import { pickAlphaSource, wantsStill } from "@/lib/media";

export type AlphaClip = {
  /** VP9 with alpha (Chrome, Firefox, Android) */
  webm: string;
  /** HEVC with alpha (Safari, iOS) */
  hevc: string;
  /** First frame as a transparent still: reduced motion, save-data, before load */
  poster: string;
  width: number;
  height: number;
};

/**
 * A transparent character loop placed in the DOM. Plays only while on screen;
 * reduced-motion and save-data visitors see the still. Decorative by default.
 */
export function AlphaVideo({
  clip,
  alt = "",
  className = "",
}: {
  clip: AlphaClip;
  alt?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || wantsStill()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          // Choose the codec on first approach, then play/pause with visibility.
          if (!video.getAttribute("src")) video.src = pickAlphaSource(clip);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "25% 0px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [clip]);

  return (
    <video
      ref={ref}
      poster={clip.poster}
      width={clip.width}
      height={clip.height}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden={alt ? undefined : true}
      aria-label={alt || undefined}
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
