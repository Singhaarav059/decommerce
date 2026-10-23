@AGENTS.md

# Decommerce site
- Next.js App Router, TypeScript, static generation. Tailwind for layout, design tokens in src/styles/tokens.css.
- 3D: React Three Fiber + drei. ONE fixed canvas with drei <View>; never create a second WebGL canvas.
- Scroll: GSAP ScrollTrigger + Lenis. UI motion: Motion. Respect prefers-reduced-motion everywhere.
- Quality tiers from detect-gpu: high / mid / low. Low = posters + video, no WebGL.
- Assets live in /public/assets or the CDN; GLB must be Meshopt-compressed, textures KTX2.
- Content in MDX under /src/content; components never hardcode copy.
- Design rules: stone + copper palette only, one accent, one warm light from upper left. No purple, no gradients, no glass blobs, no sparkle icons, no icon-card grids.
- Example data is illustrative and labelled so. Never invent customer names, logos or stats.
- Every PR: run lint, typecheck, build, and Lighthouse mobile; report the scores.
- Build plan: PLAN.md. Progress log: PROGRESS.md.
- Bundled Next docs under node_modules/next/dist/docs are blocked by the user's read-deny rules; verify Next APIs by building.
