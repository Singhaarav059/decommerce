import Image from "next/image";

/** Static illustration used until real animated media is available. */
export function CinematicMedia({ image, alt = "", priority = false, sizes = "(max-width: 767px) 100vw, 55vw" }: { image: string; alt?: string; priority?: boolean; sizes?: string }) {
  return <div className="cinematic-media"><Image src={image} alt={alt} fill priority={priority} sizes={sizes} style={{ objectFit: "cover" }} /></div>;
}
