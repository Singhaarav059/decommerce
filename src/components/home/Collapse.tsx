"use client";

import { useRef, type CSSProperties } from "react";
import { collapse as c } from "@/content/home";
import { useScrollVar } from "@/lib/useScrollVar";

// where each system's card starts, as a share of the stage: x, y (percent) and tilt (deg)
const SPOTS = [
  { x: -27, y: -22, r: -6 },
  { x: 27, y: -20, r: 5 },
  { x: -25, y: 23, r: 4 },
  { x: 27, y: 21, r: -5 },
];

/**
 * The problem, as one motion graphic pinned to the screen: four systems each show their own
 * count of the same shirt, joined by dashed lines of doubt. Scrolling pulls them into the
 * centre, where they merge into one stock count that every channel reads. The headline turns
 * from the problem to the answer as they meet.
 */
export function Collapse() {
  const ref = useRef<HTMLElement>(null);
  useScrollVar(ref);
  return (
    <section ref={ref} id="problem" aria-label={c.eyebrow} className="converge relative h-[260svh]" style={{ "--c": 0 } as CSSProperties}>
      <div className="sticky top-0 grid h-[100svh] grid-rows-[auto_1fr] overflow-hidden lg:grid-cols-12 lg:grid-rows-1">
        <div className="relative z-[1] mx-auto w-full max-w-[var(--max-w)] px-[var(--gutter)] pt-[calc(var(--header-h)+16px)] lg:col-span-5 lg:flex lg:flex-col lg:justify-center lg:pt-0 lg:pr-0 lg:pl-[max(var(--gutter),calc((100vw-var(--max-w))/2+var(--gutter)))]">
          <p className="eyebrow">
            <span className="tabular text-copper">02</span>
            {c.eyebrow}
          </p>
          <div className="relative mt-5 grid">
            <div className="converge-before col-start-1 row-start-1">
              <h2 className="display text-[clamp(2rem,4vw,3.8rem)] leading-[1] tracking-[-0.035em]">{c.before.headline}</h2>
              <p className="mt-5 max-w-[42ch] text-ink-2 max-lg:hidden">{c.before.body}</p>
            </div>
            <div className="converge-after col-start-1 row-start-1">
              <h2 className="display text-[clamp(2rem,4vw,3.8rem)] leading-[1] tracking-[-0.035em]">
                One system. <span className="text-copper">One answer.</span>
              </h2>
              <p className="mt-5 max-w-[42ch] text-ink-2 max-lg:hidden">{c.after.body}</p>
            </div>
          </div>
          <p className="mono mt-6 text-[0.72rem] text-ink-2 max-lg:hidden">{c.hint}</p>
        </div>
        <div className="relative [container-type:size] lg:col-span-7">
          {/* doubt lines between the systems, fading as they merge */}
          <svg aria-hidden viewBox="-50 -50 100 100" preserveAspectRatio="none" className="converge-lines absolute inset-[12%] h-[76%] w-[76%]">
            {SPOTS.map((a, i) =>
              SPOTS.slice(i + 1).map((b, k) => <line key={`${i}-${k}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--copper)" strokeWidth="0.25" strokeDasharray="1.2 1.6" vectorEffect="non-scaling-stroke" />),
            )}
          </svg>
          {c.systems.map((s, i) => (
            <div key={s.name} className="converge-card absolute top-1/2 left-1/2 w-[min(42%,240px)]" style={{ "--x": SPOTS[i].x, "--y": SPOTS[i].y, "--r": `${SPOTS[i].r}deg` } as CSSProperties}>
              <div className="tone-light -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-lg)] bg-paper p-4 shadow-[var(--shadow-md)] md:p-5">
                <p className="eyebrow">{s.name}</p>
                <p className="display mt-3 text-[clamp(2.4rem,4vw,3.4rem)] leading-none">{s.count}</p>
                <p className="mt-2 text-[0.82rem] text-ink-2">In stock · {s.note}</p>
              </div>
            </div>
          ))}
          <div className="converge-one absolute top-1/2 left-1/2 w-[min(78%,380px)]">
            <div className="-translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl)] bg-copper p-6 text-night shadow-[0_30px_80px_-20px_rgb(232_145_90/0.45)] md:p-8">
              <p className="mono text-[0.72rem] font-medium tracking-[0.1em] uppercase">{c.one.label}</p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <p className="display text-[clamp(4rem,8vw,6.5rem)] leading-[0.85]">{c.one.count}</p>
                <p className="pb-2 text-right text-[0.9rem] font-medium">{c.one.item}</p>
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-2 text-[0.85rem] font-medium">
                {c.one.channels.map((ch) => (
                  <li key={ch} className="flex items-center justify-between rounded-full bg-night/10 px-3 py-1.5">
                    {ch}
                    <span className="mono">0</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
