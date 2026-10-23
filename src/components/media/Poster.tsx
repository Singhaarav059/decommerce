import Image from "next/image";
import type { ReactNode } from "react";

/**
 * A rendered still of a scene. It is the LCP element on hero sections
 * (`priority`), the only thing the low tier sees, and what the 3D fades in over.
 * Without a `src` it falls back to the terrazzo plate + `fallback` drawing.
 */
export function Poster({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 60vw",
  fit = "cover",
  fallback,
  className = "",
}: {
  src?: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  fit?: "cover" | "contain";
  fallback?: ReactNode;
  className?: string;
}) {
  if (!src) {
    return (
      <div role={alt ? "img" : undefined} aria-label={alt || undefined} className={`terrazzo absolute inset-0 ${className}`}>
        {fallback}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
      sizes={sizes}
      className={`${fit === "cover" ? "object-cover" : "object-contain"} ${className}`}
    />
  );
}
