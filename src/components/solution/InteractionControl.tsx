"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Interaction } from "@/content/types";
import type { StageBus } from "@/three/stageBus";

function fmt(r: NonNullable<Extract<Interaction, { kind: "slider" }>["readout"]>, v: number) {
  const x = r.from + (r.to - r.from) * v;
  if (r.format === "clock") {
    const h = Math.floor(x);
    const m = Math.floor((x - h) * 60 / 5) * 5;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  return `${r.prefix ?? ""}${Math.round(x)}${r.unit ?? ""}`;
}

/**
 * The hero's signature interaction as accessible DOM controls writing to the
 * scene's bus: a slider (optionally also dragged across the scene surface),
 * on/off toggles (bitmask in bus.value) or a single pick (bus.focus).
 */
export function InteractionControl({
  interaction,
  bus,
  surface,
}: {
  interaction: Exclude<Interaction, { kind: "rack" }>;
  bus: StageBus;
  /** Element to listen for horizontal drags on (the scene box). */
  surface?: React.RefObject<HTMLElement | null>;
}) {
  const id = useId();
  const [value, setValue] = useState(interaction.kind === "toggles" ? (interaction.initial ?? 0) : interaction.kind === "slider" ? 0.35 : 0);
  const [picked, setPicked] = useState<string | null>(interaction.kind === "pick" ? interaction.options[0].id : null);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
    bus.setValue(value);
  }, [bus, value]);
  useEffect(() => {
    if (interaction.kind === "pick") bus.setFocus(picked);
  }, [bus, picked, interaction.kind]);

  // drag across the scene box moves the slider
  useEffect(() => {
    const el = surface?.current;
    if (!el || interaction.kind !== "slider" || !interaction.drag) return;
    let start: { x: number; v: number; id: number } | null = null;
    const down = (e: PointerEvent) => {
      start = { x: e.clientX, v: valueRef.current, id: e.pointerId };
    };
    const move = (e: PointerEvent) => {
      if (!start || start.id !== e.pointerId) return;
      const dx = e.clientX - start.x;
      if (Math.abs(dx) > 4) el.setPointerCapture(e.pointerId);
      setValue(Math.min(1, Math.max(0, start.v + dx / el.clientWidth)));
    };
    const up = () => (start = null);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [surface, interaction]);

  return (
    <div className="rounded-[var(--radius-lg)] bg-stone-50 p-4 shadow-[inset_0_0_0_1px_var(--line)] md:p-5">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={interaction.kind === "slider" ? `${id}-r` : undefined} className="text-sm font-medium">
          {interaction.label}
        </label>
        {interaction.kind === "slider" && interaction.readout && (
          <output htmlFor={`${id}-r`} className="font-mono text-sm tabular-nums text-copper-ink">
            {fmt(interaction.readout, value)}
          </output>
        )}
      </div>

      {interaction.kind === "slider" && (
        <input
          id={`${id}-r`}
          type="range"
          min={0}
          max={1000}
          value={Math.round(value * 1000)}
          onChange={(e) => setValue(Number(e.target.value) / 1000)}
          className="range w-full"
        />
      )}

      {interaction.kind === "toggles" && (
        <div className="flex flex-wrap gap-2" role="group" aria-label={interaction.label}>
          {interaction.options.map((o, i) => {
            const on = (value & (1 << i)) !== 0;
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={on}
                onClick={() => setValue(value ^ (1 << i))}
                className={`h-10 rounded-full px-4 text-sm transition-colors ${on ? "bg-ink text-stone-50" : "shadow-[inset_0_0_0_1px_var(--line)] hover:bg-travertine"}`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}

      {interaction.kind === "pick" && (
        <div className="grid gap-2" role="group" aria-label={interaction.label}>
          {interaction.options.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={picked === o.id}
              onClick={() => setPicked(o.id)}
              className={`flex items-baseline justify-between gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left text-sm transition-colors ${
                picked === o.id ? "bg-ink text-stone-50" : "hover:bg-travertine"
              }`}
            >
              <span className="font-mono">{o.label}</span>
              {o.detail && <span className="opacity-70">{o.detail}</span>}
            </button>
          ))}
        </div>
      )}
      <p className="mt-3 text-[0.8rem] text-ink-muted">{interaction.hint}</p>
    </div>
  );
}
