"use client";

import { useEffect, useRef, useState } from "react";

const CARDS = [
  { label: "Website", x: 30, y: 24 },
  { label: "Store", x: 340, y: 24 },
  { label: "Warehouse", x: 30, y: 252 },
  { label: "Marketplace", x: 340, y: 252 },
];
// today every channel keeps its own count of the same shirt; with Decommerce they read one
const APART = [3, 2, 0, 5];
const TOGETHER = 2;

/**
 * The whole problem and fix in one drawing (illustrative numbers): four channels keeping their own
 * stock count of one shirt, drifting and disagreeing, then the same four joined to one hang tag that
 * they all read. Draws itself when it scrolls into view; reduced motion shows the finished drawing.
 */
export function ChannelSync({ synced, className = "" }: { synced: boolean; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const hub = { x: 260, y: 170 };
  return (
    <figure className={className}>
      <svg ref={ref} viewBox="0 0 520 340" role="img" aria-label={synced ? "Website, store, warehouse and marketplace all read one stock count: 2." : "Website, store, warehouse and marketplace each keep their own stock count: 3, 2, 0 and 5."} className={`step-graphic channel-sync w-full ${on ? "is-on" : ""} ${synced ? "is-synced" : ""}`}>
        {CARDS.map((c, i) => {
          const cx = c.x + 75, cy = c.y + 32;
          const d = `M${cx} ${cy} L${hub.x} ${hub.y}`;
          return (
            <g key={c.label}>
              {synced ? (
                <>
                  <path d={d} pathLength={1} className="sg-draw" style={{ animationDelay: `${i * 120}ms` }} fill="none" stroke="var(--accent)" strokeWidth="2" />
                  <circle r="5" className="sg-pulse" style={{ offsetPath: `path("${d}")`, animationDelay: `${900 + i * 300}ms` }} fill="var(--accent)" />
                </>
              ) : (
                // the link stops short: nothing joins the counts up
                <path d={`M${cx} ${cy} L${cx + (hub.x - cx) * 0.55} ${cy + (hub.y - cy) * 0.55}`} fill="none" stroke="var(--ink-2)" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="4 6" />
              )}
              <g className={synced ? "sg-pop" : "cs-drift"} style={{ animationDelay: `${i * (synced ? 90 : 700)}ms`, transformOrigin: `${cx}px ${cy}px`, rotate: synced ? undefined : `${[-3, 2, -2, 3][i]}deg` }}>
                <rect x={c.x} y={c.y} width="150" height="64" rx="4" fill="var(--paper)" stroke={synced ? "var(--accent)" : "var(--line-strong)"} strokeWidth={synced ? 1.5 : 1} />
                <text x={c.x + 16} y={c.y + 26} fontSize="13" fill="var(--ink-2)">
                  {c.label}
                </text>
                <text x={c.x + 16} y={c.y + 52} fontSize="22" fontWeight="600" className="tabular" fill={synced ? "var(--accent)" : "var(--ink)"}>
                  {synced ? TOGETHER : APART[i]}
                </text>
                <text x={c.x + 134} y={c.y + 52} fontSize="12" textAnchor="end" fill="var(--ink-2)">
                  in stock
                </text>
              </g>
            </g>
          );
        })}
        {synced ? (
          <g className="sg-pop" style={{ animationDelay: "500ms" }}>
            {/* the hang tag: its top-left corner clipped */}
            <path d={`M${hub.x - 46} ${hub.y - 30} H${hub.x + 60} V${hub.y + 30} H${hub.x - 60} V${hub.y - 16} Z`} fill="var(--accent)" />
            <text x={hub.x} y={hub.y - 4} textAnchor="middle" fontSize="12" fill="#ffffff" fillOpacity="0.85">
              One stock count
            </text>
            <text x={hub.x} y={hub.y + 19} textAnchor="middle" fontSize="20" fontWeight="600" fill="#ffffff">
              {TOGETHER}
            </text>
          </g>
        ) : (
          <g>
            <rect x={hub.x - 46} y={hub.y - 26} width="92" height="52" rx="4" fill="none" stroke="var(--ink-2)" strokeOpacity="0.35" strokeDasharray="4 6" />
            <text x={hub.x} y={hub.y + 8} textAnchor="middle" fontSize="22" fill="var(--ink-2)" fillOpacity="0.6">
              ?
            </text>
          </g>
        )}
      </svg>
      <figcaption className="mt-2 text-[0.8125rem] text-ink-2">{synced ? "Example. Every channel reads the same count." : "Example. Each channel keeps its own count."}</figcaption>
    </figure>
  );
}
