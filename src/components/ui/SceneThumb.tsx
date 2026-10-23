import type { SolutionSlug } from "@/content/site";

/**
 * Isometric plinth with a tiny object per solution. Stand-in for the live 3D
 * mini-scene (drei View) the mega-menu will use once scenes exist.
 */
const objects: Record<SolutionSlug, React.ReactNode> = {
  storefront: <path d="M22 20 38 12 54 20v12L38 40 22 32Z M24 21 38 14 52 21 38 28Z" />,
  "brand-showcase": <path d="M24 14h10v14H24Z M36 10h10v18H36Z M48 16h6v12h-6Z" />,
  b2b: <path d="M22 26 32 21 42 26 32 31Z M22 26v6l10 5v-6Z M42 26v6l-10 5v-6Z M30 18 40 13 50 18 40 23Z M30 18v6l10 5 10-5v-6" />,
  "quick-commerce": <path d="M26 30a4 4 0 1 0 0.1 0Z M46 30a4 4 0 1 0 0.1 0Z M24 26h24l-4-8H30Z" />,
  marketplace: <path d="M30 16 38 12 46 16 38 20Z M30 16v8l8 4v-8Z M46 16v8l-8 4v-8Z M20 30h8 M48 30h8 M36 36h4" />,
  oms: <path d="M24 12h12v16H24Z M40 16h12v16H40Z M27 17h6 M27 21h6 M43 21h6 M43 25h6" />,
  wms: <path d="M22 12h32v24H22Z M22 20h32 M22 28h32 M32 12v24 M44 12v24" />,
  tms: <path d="M20 22h20v10H20Z M40 25h8l4 4v3H40Z M26 34a3 3 0 1 0 .1 0Z M46 34a3 3 0 1 0 .1 0Z" />,
  pos: <path d="M30 12h16v14H30Z M33 15h10v6H33Z M26 28h24l-2 6H28Z" />,
  clienteling: <path d="M28 12h16a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H28a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2Z M30 18h12 M30 22h8 M30 26h10" />,
  "endless-aisle": <path d="M18 14h40 M18 22h40 M18 30h40 M26 14v16 M34 16v12 M40 17v10 M45 18v8 M49 19v6" />,
  "self-checkout": <path d="M30 10h14v18H30Z M33 13h8v8h-8Z M28 28h18v8H28Z M48 24l6 2-2 10h-8" />,
};

export function SceneThumb({ slug, className = "" }: { slug: SolutionSlug; className?: string }) {
  return (
    <svg viewBox="0 0 76 56" aria-hidden className={className}>
      {/* travertine plinth, lit from upper left */}
      <path d="M38 30 72 44 38 56 4 44Z" fill="var(--travertine)" />
      <path d="M4 44v4l34 8v-4Z" fill="var(--terrazzo-chip)" />
      <path d="M72 44v4L38 56v-4Z" fill="var(--steel)" opacity="0.55" />
      <ellipse cx="40" cy="44" rx="16" ry="4" fill="var(--ink)" opacity="0.08" />
      <g fill="none" stroke="var(--ink)" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" transform="translate(0 4)">
        {objects[slug]}
      </g>
    </svg>
  );
}
