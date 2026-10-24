# Credits and licences

Every asset on the site, where it came from and under what licence. Update this file whenever an asset is added or replaced.

## Images and video

| Asset | Source | Licence / terms |
| --- | --- | --- |
| Three reference renders (`assets-src/refs/ref-counter`, `ref-packing`, `ref-diorama`) | Supplied by the site owner | Owner to confirm rights for commercial use |
| Homepage films (`public/assets/seq/*`) | Google Veo 3.1 on Vertex AI, from the owner's renders and generated stills; frames by `scripts/frames-from-video.sh` | Google Cloud generative AI terms (owner's project `silicon-alchemy-476503-i4`) |
| Solution page films and stills (`public/assets/sol/*`) | Google Gemini 3 Pro Image + Veo 3.1 on Vertex AI, prompts in `scripts/solutions/assets.json` | Same |
| Company stills (`public/assets/company/*`) | Gemini 3 Pro Image on Vertex AI | Same |
| Social card (`src/app/opengraph-image.png`) | Screenshot of `/capture/og` using a hero frame | Own work |

Every paid generation is listed with its prompt and cost in `assets-src/vertex/ledger.json`. People in the footage (the picker, the cashier's hands, shoppers) are AI-generated and are not real individuals. Before launch, check Google's current terms for commercial use of generated media and keep any required disclosure.

## Fonts

| Font | Source | Licence |
| --- | --- | --- |
| Geist, Geist Mono | Vercel, via `next/font/google` | SIL Open Font License 1.1 |
| Instrument Serif | Instrument, via `next/font/google` | SIL Open Font License 1.1 |

## Libraries (runtime)

| Library | Licence |
| --- | --- |
| Next.js, React | MIT |
| GSAP (+ ScrollTrigger) | GSAP Standard License (free, including commercial use) |
| Lenis | MIT |
| @next/mdx, @mdx-js | MIT |
| @vercel/analytics | MPL-2.0 |

## Third-party references

Fynd, Morpho, BLUNT, Maison des Elites, Second Ride, Motionary and Decignal were used as references for page scope and interaction patterns only (see PLAN.md). No code, copy, statistics, logos or assets were copied from them. Channel badges on the marketplace page are generic letters, not third-party logos.
