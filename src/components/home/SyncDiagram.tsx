/**
 * A small motion graphic of the core idea: one stock count in the middle, four channels around it.
 * A sale at the store sends a pulse to the centre, and the centre sends the new count out to every
 * channel at once; each channel's count flips from 1 to 0 as its pulse arrives. Pure SVG + CSS,
 * loops every 6 s, and holds still (showing the synced state) for reduced-motion visitors.
 */
const NODES = [
  { id: "store", label: "Store", x: 70, y: 70 },
  { id: "web", label: "Website", x: 450, y: 70 },
  { id: "wh", label: "Warehouse", x: 70, y: 290 },
  { id: "mkt", label: "Marketplace", x: 450, y: 290 },
];
const C = { x: 260, y: 180 };

export function SyncDiagram({ className = "" }: { className?: string }) {
  return (
    <figure className={`sync ${className}`} aria-label="Diagram: a sale at the store updates one stock count, which every channel reads at once.">
      <svg viewBox="0 0 520 360" className="h-auto w-full" role="img" aria-hidden>
        {NODES.map((n) => (
          <g key={n.id}>
            <line x1={n.x} y1={n.y} x2={C.x} y2={C.y} className="stroke-[var(--line-strong)]" strokeWidth="1.5" strokeDasharray="3 5" />
            {/* the pulse: inbound from the store, outbound to everyone else */}
            <circle r="5" className={`fill-[var(--copper)] sync-pulse ${n.id === "store" ? "sync-in" : "sync-out"}`} style={{ offsetPath: `path("M ${n.id === "store" ? `${n.x} ${n.y} L ${C.x} ${C.y}` : `${C.x} ${C.y} L ${n.x} ${n.y}`}")` }} />
          </g>
        ))}
        <g>
          <rect x={C.x - 92} y={C.y - 40} width="184" height="80" rx="18" className="fill-[var(--ink)]" />
          <circle cx={C.x} cy={C.y} r="56" className="sync-ring fill-none stroke-[var(--copper)]" strokeWidth="1.5" />
          <text x={C.x} y={C.y - 6} textAnchor="middle" className="fill-[var(--paper)] text-[13px] font-semibold">One stock count</text>
          <text x={C.x} y={C.y + 16} textAnchor="middle" className="fill-[var(--paper)] text-[12px] opacity-70">Linen overshirt · M</text>
        </g>
        {NODES.map((n) => (
          <g key={n.id} className={`sync-node sync-${n.id}`}>
            <rect x={n.x - 62} y={n.y - 30} width="124" height="60" rx="14" className="fill-[var(--paper)] stroke-[var(--line)]" />
            <text x={n.x - 46} y={n.y - 4} className="fill-[var(--ink)] text-[13px] font-semibold">{n.label}</text>
            <text x={n.x - 46} y={n.y + 15} className="fill-[var(--ink-2)] text-[11px]">In stock</text>
            <g className="tabular text-[15px] font-semibold">
              <text x={n.x + 44} y={n.y + 15} textAnchor="end" className="sync-old fill-[var(--ink)]">1</text>
              <text x={n.x + 44} y={n.y + 15} textAnchor="end" className="sync-new fill-[var(--copper)]">0</text>
            </g>
          </g>
        ))}
      </svg>
      <figcaption className="mt-3 text-[0.84rem] text-ink-2">Illustrative: the last size M sells at the store, and every channel shows 0 at once.</figcaption>
    </figure>
  );
}
