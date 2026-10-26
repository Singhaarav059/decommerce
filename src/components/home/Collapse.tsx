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
    <section ref={ref} id="problem" aria-label={c.eyebrow} className="converge relative h-[210svh] bg-studio-light" style={{ "--c": 0 } as CSSProperties}>
      <div className="sticky top-0 grid h-[100svh] grid-rows-[auto_1fr] overflow-hidden lg:grid-cols-12 lg:grid-rows-1">
        <div className="relative z-[1] mx-auto w-full max-w-[var(--max-w)] px-[var(--gutter)] pt-[calc(var(--header-h)+16px)] lg:col-span-5 lg:flex lg:flex-col lg:justify-center lg:pt-0 lg:pr-0 lg:pl-[max(var(--gutter),calc((100vw-var(--max-w))/2+var(--gutter)))]">
          {/* one heading whose two lines of text trade places as the systems merge */}
          <h2 className="display grid text-[clamp(2rem,4vw,3.8rem)] leading-[1] tracking-[-0.035em]">
            <span className="converge-before col-start-1 row-start-1">{c.before.headline}</span>
            <span className="converge-after col-start-1 row-start-1">
              One system. <span className="text-accent">One answer.</span>
            </span>
          </h2>
          <div className="mt-5 grid max-lg:hidden">
            <p className="converge-before col-start-1 row-start-1 max-w-[42ch] text-ink-2">{c.before.body}</p>
            <p className="converge-after col-start-1 row-start-1 max-w-[42ch] text-ink-2">{c.after.body}</p>
          </div>
          <p className="mt-6 text-[0.875rem] text-ink-2 max-lg:hidden">{c.hint}</p>
        </div>
        <div className="relative [container-type:size] lg:col-span-7">
          {/* doubt lines between the systems, fading as they merge */}
          <svg aria-hidden viewBox="-50 -50 100 100" preserveAspectRatio="none" className="converge-lines absolute inset-[12%] h-[76%] w-[76%]">
            {SPOTS.map((a, i) =>
              SPOTS.slice(i + 1).map((b, k) => <line key={`${i}-${k}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--accent)" strokeWidth="0.25" strokeDasharray="1.2 1.6" vectorEffect="non-scaling-stroke" />),
            )}
          </svg>
          {c.systems.map((s, i) => (
            <div key={s.name} className="converge-card absolute top-1/2 left-1/2 w-[min(44%,300px)]" style={{ "--x": SPOTS[i].x, "--y": SPOTS[i].y, "--r": `${SPOTS[i].r}deg` } as CSSProperties}>
              <div className="tone-light tag tag-lg -translate-x-1/2 -translate-y-1/2 bg-paper p-5 pt-14 md:p-7 md:pt-20">
                <p className="text-[0.875rem] font-semibold">{s.name}</p>
                <p className="display mt-3 text-[clamp(3rem,5.5vw,5rem)] leading-none">{s.count}</p>
                <p className="mt-3 text-[0.875rem] text-ink-2">In stock · {s.note}</p>
              </div>
            </div>
          ))}
          <div className="converge-one absolute top-1/2 left-1/2 w-[min(80%,460px)]">
            <div className="tag tag-lg -translate-x-1/2 -translate-y-1/2 bg-accent p-7 pt-20 text-paper md:p-10 md:pt-24">
              <p className="text-[0.875rem] font-semibold">{c.one.label}</p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <p className="display text-[clamp(5rem,10vw,8.5rem)] leading-[0.85]">{c.one.count}</p>
                <p className="pb-2 text-right text-[0.9rem] font-medium">{c.one.item}</p>
              </div>
              <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-[0.94rem] font-medium">
                {c.one.channels.map((ch) => (
                  <li key={ch} className="flex items-center justify-between">
                    {ch}
                    <span>0</span>
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
