# Credits and licences

Every asset on the site, where it came from and under what licence. Update this file whenever an asset is added or replaced.

## 3D, images, video

| Asset | Source | Licence |
| --- | --- | --- |
| Store-world props (counters, shelves, boxes, POS, laptop, van, city, olive trees) | Built in code: `src/three/kit.tsx`, scenes in `src/scenes` | Own work |
| Terrazzo, travertine, kraft, brushed-steel textures | Procedural canvas textures, `src/three/textures.ts` | Own work |
| Reflections | `RoomEnvironment` from three.js examples | MIT |
| Rack garments + hanger (`public/assets/models/rack.glb`) | Blender script `scripts/blender/garments.py` | Own work (placeholder) |
| Character loop (`public/assets/video/placeholder-walker.*`) | Blender script `scripts/blender/figure_walk.py` | Own work (placeholder for AI character clips) |
| Lab test sequence (`public/assets/seq/lab-orbit`) | Blender script `scripts/blender/lab_orbit.py` | Own work |
| Delivery film (`public/assets/seq/delivery`) | Captured from `scenes/delivery` by `scripts/capture-sequence.mjs` | Own work |
| Posters and social card (`public/assets/posters`, `src/app/opengraph-image.png`) | Captured from the live scenes by `scripts/posters.mjs`, `scripts/og.mjs` | Own work |

No third-party models, HDRIs, photos or AI-generated media are used yet. When the real character clips (Higgsfield / Canva / other image-to-video tools) or CC models arrive, add a row each and check the tool's commercial-use terms first (free tiers often watermark or restrict commercial use).

## Fonts

| Font | Source | Licence |
| --- | --- | --- |
| Geist, Geist Mono | Vercel, via `next/font/google` | SIL Open Font License 1.1 |
| Instrument Serif | Instrument, via `next/font/google` | SIL Open Font License 1.1 |

## Libraries (runtime)

| Library | Licence |
| --- | --- |
| Next.js, React | MIT |
| three.js, @react-three/fiber, @react-three/drei | MIT |
| GSAP (+ ScrollTrigger) | GSAP Standard License (free, including commercial use) |
| Lenis | MIT |
| detect-gpu | MIT |
| @next/mdx, @mdx-js | MIT |
| @vercel/analytics | MPL-2.0 |

## Third-party references

Fynd, Morpho, BLUNT, Maison des Elites, Second Ride, Motionary and Decignal were used as references for page scope and interaction patterns only (see PLAN.md). No code, copy, statistics, logos or assets were copied from them. Channel badges on the marketplace page are generic letters, not third-party logos.
