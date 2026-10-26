import { integrations as it } from "@/content/integrations";

/**
 * Decommerce in the middle, the kinds of system it connects to around it, joined by lines a
 * copper pulse travels along (CSS only; still for reduced motion). Phones get a simple grid.
 */
export function IntegrationHub() {
  const n = it.categories.length;
  return (
    <div className="relative">
      {/* wide screens: the ring */}
      <div aria-hidden className="relative mx-auto hidden aspect-square w-full max-w-[560px] md:block">
        <svg viewBox="-50 -50 100 100" className="absolute inset-0 size-full">
          <circle r="38" fill="none" stroke="var(--line-strong)" strokeWidth="0.25" strokeDasharray="1 1.4" />
          {it.categories.map((c, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(a) * 38, y = Math.sin(a) * 38;
            return (
              <g key={c.name}>
                <line x1="0" y1="0" x2={x} y2={y} stroke="var(--line-strong)" strokeWidth="0.25" />
                <circle r="0.9" fill="var(--copper)" className="hub-pulse" style={{ offsetPath: `path("M 0 0 L ${x.toFixed(2)} ${y.toFixed(2)}")`, animationDelay: `${i * 0.45}s` }} />
              </g>
            );
          })}
        </svg>
        <div className="absolute top-1/2 left-1/2 flex size-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-ink text-center text-paper shadow-[var(--shadow-md)]">
          <span className="display text-[1.35rem] leading-none">decommerce<span className="text-copper-bright">.</span></span>
          <span className="mt-2 text-[0.72rem] text-paper/70">one catalog · one stock count</span>
        </div>
        {it.categories.map((c, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          return (
            <span key={c.name} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper px-3.5 py-2 text-[0.85rem] font-medium whitespace-nowrap shadow-[var(--shadow-sm)] ring-1 ring-black/5" style={{ left: `${50 + Math.cos(a) * 38}%`, top: `${50 + Math.sin(a) * 38}%` }}>
              {c.name}
            </span>
          );
        })}
      </div>
      {/* phones: a grid */}
      <ul className="grid grid-cols-2 gap-2 md:hidden">
        {it.categories.map((c) => (
          <li key={c.name} className="rounded-[var(--radius-md)] bg-paper px-3 py-2.5 text-[0.9rem] font-medium ring-1 ring-black/5">
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
