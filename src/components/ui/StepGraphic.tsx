/**
 * Small drawn motion graphics for process steps, in place of photographs (so no picture repeats on a
 * page). Each plays when its step opens (`on`) and rests on its finished state; reduced motion shows the
 * finished state. Strokes use currentColor, so a graphic reads on the dark and the light step panels.
 */
export type StepGraphicKind = "connect" | "build" | "launch" | "run" | "message" | "reply";

const CHANNELS = ["Website", "Store", "Warehouse", "Marketplace"];

export function StepGraphic({ kind, on }: { kind: StepGraphicKind; on: boolean }) {
  return (
    <svg viewBox="0 0 400 300" aria-hidden className={`step-graphic size-full ${on ? "is-on" : ""}`}>
      {kind === "connect" && <Connect />}
      {kind === "build" && <Build />}
      {kind === "launch" && <Launch />}
      {kind === "run" && <Run />}
      {kind === "message" && <Message />}
      {kind === "reply" && <Reply />}
    </svg>
  );
}

/** Four channels joined to one record: the lines draw in, then a pulse runs along each. */
function Connect() {
  const pts: [number, number][] = [
    [70, 60],
    [330, 60],
    [70, 240],
    [330, 240],
  ];
  return (
    <g>
      {pts.map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x} ${y} L200 150`} pathLength={1} className="sg-draw" style={{ animationDelay: `${i * 120}ms` }} fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" />
          <circle r="4" className="sg-pulse" style={{ offsetPath: `path("M${x} ${y} L200 150")`, animationDelay: `${700 + i * 160}ms` }} fill="var(--sg-hi)" />
          <rect x={x - 52} y={y - 16} width="104" height="32" rx="4" className="sg-pop" style={{ animationDelay: `${i * 80}ms` }} fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.35" />
          <text x={x} y={y + 5} textAnchor="middle" fontSize="13" fill="currentColor" className="sg-pop" style={{ animationDelay: `${i * 80}ms` }}>
            {CHANNELS[i]}
          </text>
        </g>
      ))}
      <path d="M172 128 h56 v44 h-56 v-30 z" className="sg-pop" style={{ animationDelay: "500ms" }} fill="var(--sg-hi)" />
      <text x="200" y="157" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--sg-on-hi)" className="sg-pop" style={{ animationDelay: "500ms" }}>
        One
      </text>
    </g>
  );
}

/** The catalog filling in: tiles land one by one, a few marked in stock. */
function Build() {
  return (
    <g>
      {Array.from({ length: 12 }, (_, i) => {
        const x = 60 + (i % 4) * 72, y = 50 + Math.floor(i / 4) * 72;
        return (
          <g key={i} className="sg-pop" style={{ animationDelay: `${i * 70}ms` }}>
            <rect x={x} y={y} width="60" height="60" rx="4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.3" />
            <rect x={x + 12} y={y + 10} width="36" height="26" rx="2" fill="currentColor" fillOpacity="0.22" />
            <rect x={x + 12} y={y + 42} width={i % 3 === 0 ? 20 : 30} height="5" rx="2" fill={i % 5 === 1 ? "var(--sg-hi)" : "currentColor"} fillOpacity={i % 5 === 1 ? 1 : 0.35} />
          </g>
        );
      })}
    </g>
  );
}

/** Going live: the switch slides across and the light ripples out. */
function Launch() {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx="250" cy="150" r="40" className="sg-ripple" style={{ animationDelay: `${600 + i * 450}ms` }} fill="none" stroke="var(--sg-hi)" strokeWidth="1.5" />
      ))}
      <rect x="110" y="120" width="180" height="60" rx="30" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.35" />
      <rect x="110" y="120" width="180" height="60" rx="30" className="sg-fade" style={{ animationDelay: "350ms" }} fill="var(--sg-hi)" />
      <circle cx="140" cy="150" r="22" className="sg-slide" fill="currentColor" />
      <text x="200" y="225" textAnchor="middle" fontSize="15" fontWeight="600" fill="currentColor" className="sg-fade" style={{ animationDelay: "450ms" }}>
        Live
      </text>
    </g>
  );
}

/** Running: a steady line draws across a quiet grid, with a marker on the latest point. */
function Run() {
  const d = "M40 220 C90 210 110 170 150 175 S220 120 260 130 S330 80 360 70";
  return (
    <g>
      {[80, 130, 180, 230].map((y) => (
        <line key={y} x1="40" x2="360" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.12" />
      ))}
      <path d={d} pathLength={1} className="sg-draw" style={{ animationDuration: "1600ms" }} fill="none" stroke="var(--sg-hi)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="360" cy="70" r="7" className="sg-pop" style={{ animationDelay: "1400ms" }} fill="var(--sg-hi)" />
      <circle cx="360" cy="70" r="7" className="sg-ripple" style={{ animationDelay: "1600ms" }} fill="none" stroke="var(--sg-hi)" />
    </g>
  );
}

/** Writing to us: a message card slides up and is marked sent. */
function Message() {
  return (
    <g>
      <g className="sg-rise">
        <rect x="80" y="70" width="240" height="150" rx="6" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.35" />
        {[100, 124, 148].map((y, i) => (
          <rect key={y} x="104" y={y} width={[170, 190, 120][i]} height="8" rx="3" fill="currentColor" fillOpacity="0.3" />
        ))}
        <rect x="104" y="180" width="90" height="24" rx="4" fill="var(--sg-hi)" />
      </g>
      <g className="sg-pop" style={{ animationDelay: "900ms" }}>
        <circle cx="318" cy="72" r="18" fill="var(--sg-hi)" />
        <path d="M309 72 l6 6 l12 -13" fill="none" stroke="var(--sg-on-hi)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** Our reply: your note, a moment of typing, then the answer. */
function Reply() {
  return (
    <g>
      <g className="sg-rise">
        <rect x="60" y="60" width="200" height="56" rx="14" fill="currentColor" fillOpacity="0.14" />
        <rect x="80" y="80" width="150" height="7" rx="3" fill="currentColor" fillOpacity="0.4" />
        <rect x="80" y="94" width="100" height="7" rx="3" fill="currentColor" fillOpacity="0.4" />
      </g>
      <g className="sg-typing">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={296 + i * 16} cy="160" r="5" fill="currentColor" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </g>
      <g className="sg-rise" style={{ animationDelay: "1500ms" }}>
        <rect x="140" y="140" width="200" height="90" rx="14" fill="var(--sg-hi)" />
        {[162, 178, 194].map((y, i) => (
          <rect key={y} x="160" y={y} width={[150, 160, 90][i]} height="7" rx="3" fill="var(--sg-on-hi)" fillOpacity="0.75" />
        ))}
      </g>
    </g>
  );
}
