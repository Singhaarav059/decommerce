"use client";

import { useEffect, useRef, useState } from "react";
import { Scene } from "@/components/scene/Scene";
import { themes, type Theme } from "@/content/themes";
import { useQuality } from "@/lib/quality";
import { RackBus } from "@/scenes/rack/bus";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * DOM controller for the rack scene: swipe (one hanger per swipe), tap to
 * lift/twirl, drag to spin the lifted garment, keyboard and buttons for the
 * same actions. Vertical page scrolling stays native (touch-action: pan-y).
 * The low tier gets the same controls over a swatch list instead of 3D.
 */
export function ClothingRack({
  initial = 2,
  onChange,
  className = "",
  label = "Storefront themes",
}: {
  initial?: number;
  onChange?: (theme: Theme, lifted: boolean) => void;
  className?: string;
  label?: string;
}) {
  const [bus] = useState(() => new RackBus(themes.length, initial));
  const [index, setIndex] = useState(initial);
  const [lifted, setLifted] = useState(false);
  const tier = useQuality();
  const webgl = tier === "mid" || tier === "high";
  const surface = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x0: number; t0: number; x: number; t: number; vx: number; moved: boolean } | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    bus.setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (process.env.NODE_ENV !== "production") (window as unknown as { __rack: unknown }).__rack = bus;
  }, [bus]);

  const select = (i: number) => {
    const next = bus.select(i);
    setIndex(next);
    onChangeRef.current?.(themes[next], bus.lifted);
  };

  const setLift = (v: boolean) => {
    bus.setLifted(v);
    setLifted(v);
    onChangeRef.current?.(themes[bus.index], v);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = { id: e.pointerId, x0: e.clientX, t0: e.timeStamp, x: e.clientX, t: e.timeStamp, vx: 0, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      surface.current?.setPointerCapture(e.pointerId);
    }
    const dt = Math.max(1, e.timeStamp - d.t);
    d.vx = (e.clientX - d.x) / dt;
    d.x = e.clientX;
    d.t = e.timeStamp;
    if (!d.moved) return;
    if (bus.lifted) {
      bus.addSpin((d.vx * dt) / 90);
    } else {
      // rubber band: follows the finger for one slot, resists beyond
      const raw = -dx / bus.slotPx;
      const abs = Math.abs(raw);
      const atEdge = (bus.index === 0 && raw < 0) || (bus.index === themes.length - 1 && raw > 0);
      bus.setDrag(atEdge ? raw * 0.25 : Math.sign(raw) * (abs > 1 ? 1 + (abs - 1) * 0.2 : abs));
    }
  };

  const endDrag = (e: React.PointerEvent, cancelled = false) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const dx = e.clientX - d.x0;
    if (cancelled) {
      bus.setDrag(0);
      return;
    }
    if (!d.moved) {
      // tap: which slot was hit?
      const rect = surface.current!.getBoundingClientRect();
      const slot = bus.index + Math.round((e.clientX - (rect.left + rect.width / 2)) / bus.slotPx);
      if (slot === bus.index) setLift(!bus.lifted);
      else if (!bus.lifted) select(slot);
      else setLift(false);
      return;
    }
    if (bus.lifted) {
      bus.fling(d.vx * 11);
      return;
    }
    const flick = Math.abs(d.vx) > 0.35;
    const far = Math.abs(dx) > bus.slotPx * 0.22;
    bus.setDrag(0);
    if (flick || far) select(bus.index + (dx < 0 ? 1 : -1)); // exactly one hanger per swipe
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") select(bus.index + 1);
    else if (e.key === "ArrowLeft") select(bus.index - 1);
    else if (e.key === "Home") select(0);
    else if (e.key === "End") select(themes.length - 1);
    else if (e.key === "Enter" || e.key === " ") setLift(!bus.lifted);
    else if (e.key === "Escape" && bus.lifted) setLift(false);
    else return;
    e.preventDefault();
  };

  const theme = themes[index];

  return (
    <div className={`relative ${className}`}>
      <div
        ref={surface}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${label}. Use left and right arrows to browse, Enter to lift.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endDrag(e)}
        onPointerCancel={(e) => endDrag(e, true)}
        className="relative aspect-[4/5] cursor-grab touch-pan-y select-none overflow-hidden rounded-[var(--radius-lg)] bg-travertine active:cursor-grabbing sm:aspect-[16/9]"
      >
        {webgl ? (
          <Scene
            scene="rack"
            className="size-full"
            sceneProps={{ bus }}
            fallback={<RackFallback index={index} />}
          />
        ) : (
          <RackFallback index={index} lifted={lifted} />
        )}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="min-w-0 flex-1" aria-live="polite">
          <p className="eyebrow tabular-nums">
            {pad(index + 1)} / {pad(themes.length)}
          </p>
          <p className="mt-1 truncate text-lg font-medium">{theme.name}</p>
          <p className="truncate text-sm text-ink-muted">{theme.note}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <IconButton label="Previous theme" disabled={index === 0 || lifted} onClick={() => select(index - 1)} d="M10 3 5 8l5 5" />
          <button
            type="button"
            onClick={() => setLift(!lifted)}
            aria-pressed={lifted}
            className="h-11 rounded-full px-4 text-sm font-medium shadow-[inset_0_0_0_1px_var(--ink)] transition-colors hover:bg-ink hover:text-stone-50 aria-pressed:bg-ink aria-pressed:text-stone-50"
          >
            {lifted ? "Put back" : "Try it on"}
          </button>
          <IconButton label="Next theme" disabled={index === themes.length - 1 || lifted} onClick={() => select(index + 1)} d="m6 3 5 5-5 5" />
        </div>
      </div>
    </div>
  );
}

function IconButton({ label, d, onClick, disabled }: { label: string; d: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex size-11 items-center justify-center rounded-full shadow-[inset_0_0_0_1px_var(--line)] transition-[background-color,opacity] hover:bg-travertine disabled:opacity-35"
    >
      <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
        <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/** Low tier / pre-3D: hangers as flat swatches on a rail, same index. */
function RackFallback({ index, lifted = false }: { index: number; lifted?: boolean }) {
  return (
    <div className="terrazzo absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-x-0 top-[14%] h-[3px] bg-steel" />
      <div
        className="absolute top-[14%] left-1/2 flex gap-[4%] transition-transform duration-500 ease-[var(--ease-overshoot)]"
        style={{ width: "100%", transform: `translateX(calc(${-index} * (22% + 4%) - 11%))` }}
      >
        {themes.map((t, i) => (
          <div
            key={t.key}
            className="relative shrink-0 basis-[22%] transition-[transform,opacity] duration-500 ease-[var(--ease-out)]"
            style={{ transform: lifted && i === index ? "translateY(6%) scale(1.08)" : undefined, opacity: lifted && i !== index ? 0.35 : 1 }}
          >
            <div className="mx-auto h-4 w-px bg-steel" />
            <div className="mx-auto h-1.5 w-[70%] rounded-full bg-[#5c3a1c]" />
            <div className="mx-auto mt-0.5 aspect-[3/4] w-[86%] rounded-t-[30%] rounded-b-md" style={{ background: t.swatch }} />
          </div>
        ))}
      </div>
    </div>
  );
}
