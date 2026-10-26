"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";
import { rack, type RackItem } from "@/content/rack";

const SPACING = 0.24; // one hanger slot, as a fraction of the rack width
const SIZES = ["S", "M", "L", "XL"];

/**
 * A clothing rack you browse like the real thing (modelled on Motionary's
 * React Native rack): drag the rail, hangers swing on their hooks and knock
 * each other, the centred piece grows with its name and price, and "See the
 * piece" lifts it off the rail with sizes and Add to bag. Built from cut-out
 * garment photos in the DOM; keyboard: arrows to browse, Enter to open, Escape to close.
 */
export function Rack({ scrub }: { scrub?: RefObject<number | null> } = {}) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const state = useRef({ pos: 0, target: 0, vel: 0, angles: rack.map(() => 0), angVel: rack.map(() => 0), dragging: false, reduced: false, lastScrub: -1, shown: 0 });
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState<string | null>(null);

  const go = useCallback((i: number) => {
    const n = Math.max(0, Math.min(rack.length - 1, i));
    state.current.target = n;
    setIndex(n);
  }, []);

  // spring loop: rail position, hanger swing, scale of the centred piece (runs only while on screen)
  useEffect(() => {
    const s = state.current;
    s.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let running = false;
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      // scrolling drives the rail: the spring heads for the scroll position (a fraction of a slot
      // is fine, the garment nearest the middle is the one named); drag and keys still work in between
      const sc = scrub?.current;
      if (sc != null && sc !== s.lastScrub && !s.dragging) {
        s.lastScrub = sc;
        s.target = sc * (rack.length - 1);
        const r = Math.round(s.target);
        if (r !== s.shown) {
          s.shown = r;
          setIndex(r);
        }
      }
      const prev = s.pos;
      if (!s.dragging) {
        if (s.reduced) s.pos = s.target;
        else {
          const a = -170 * (s.pos - s.target) - 22 * s.vel;
          s.vel += a * dt;
          s.pos += s.vel * dt;
        }
      }
      const railVel = (s.pos - prev) / Math.max(dt, 1e-3);
      const w = box.current?.clientWidth ?? 800;
      rack.forEach((_, i) => {
        const el = els.current[i];
        if (!el) return;
        const d = i - s.pos;
        // swing: the hanger is pushed opposite to the rail's motion, then settles
        if (!s.reduced) {
          s.angVel[i] += (-60 * s.angles[i] - 4.5 * s.angVel[i] - railVel * 9) * dt;
          s.angles[i] += s.angVel[i] * dt;
          s.angles[i] = Math.max(-14, Math.min(14, s.angles[i]));
        }
        const near = Math.max(0, 1 - Math.abs(d));
        const scale = 0.8 + 0.3 * near;
        el.style.transform = `translateX(${(d * SPACING * w).toFixed(1)}px) scale(${scale.toFixed(3)}) rotate(${s.angles[i].toFixed(2)}deg)`;
        el.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));
        el.style.opacity = Math.abs(d) > 3.4 ? "0" : "1";
      });
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    if (box.current) io.observe(box.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [scrub]);

  // drag the rail; vertical page scrolling stays native (touch-action: pan-y)
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const s = state.current;
    let start: { x: number; pos: number; id: number; t: number; lx: number } | null = null;
    let v = 0;
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      start = { x: e.clientX, pos: s.pos, id: e.pointerId, t: e.timeStamp, lx: e.clientX };
    };
    const move = (e: PointerEvent) => {
      if (!start || start.id !== e.pointerId) return;
      const dx = e.clientX - start.x;
      if (!s.dragging && Math.abs(dx) > 5) {
        s.dragging = true;
        el.setPointerCapture(e.pointerId);
      }
      if (!s.dragging) return;
      const dt = Math.max(1, e.timeStamp - start.t);
      v = (e.clientX - start.lx) / dt;
      start.t = e.timeStamp;
      start.lx = e.clientX;
      const raw = start.pos - dx / (SPACING * el.clientWidth);
      s.pos = raw < 0 ? raw * 0.3 : raw > rack.length - 1 ? rack.length - 1 + (raw - rack.length + 1) * 0.3 : raw;
    };
    const up = (e: PointerEvent) => {
      if (!start || start.id !== e.pointerId) return;
      const wasDrag = s.dragging;
      s.dragging = false;
      start = null;
      if (wasDrag) {
        s.vel = (-v * 1000) / (SPACING * el.clientWidth);
        go(Math.round(s.pos - v * 0.18 * (1000 / (SPACING * el.clientWidth)) * 0.25));
      }
    };
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
  }, [go]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "ArrowLeft") go(index - 1);
    else if (e.key === "Enter" && !open) setOpen(true);
    else if (e.key === "Escape" && open) setOpen(false);
    else return;
    e.preventDefault();
  };

  const item: RackItem = rack[index];

  return (
    <div className="relative select-none" onKeyDown={onKey}>
      <div
        ref={box}
        role="group"
        aria-roledescription="carousel"
        aria-label="Clothing rack. Use the left and right arrows to browse, Enter to see the piece."
        tabIndex={0}
        className={`relative aspect-square max-h-[60svh] w-full md:aspect-[16/11] cursor-grab touch-pan-y overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_14%)] transition-opacity duration-500 active:cursor-grabbing ${open ? "pointer-events-none opacity-0" : "opacity-100"}`} /* taste-skill-ignore: edge fade mask */
      >
        {/* the rail */}
        <div aria-hidden className="absolute inset-x-0 top-[7%] h-[5px] bg-[#8c9294]" />
        {rack.map((g, i) => (
          <div
            key={g.id}
            ref={(el) => {
              els.current[i] = el;
            }}
            aria-hidden={i !== index}
            className="absolute top-[5.4%] left-1/2 w-[30%] origin-top will-change-transform"
            style={{ marginLeft: "-15%" }}
          >
            <Image src={g.image} alt={i === index ? `${g.name}, ${g.colour}` : ""} width={600} height={800} sizes="(max-width: 768px) 30vw, 16vw" className="h-auto w-full drop-shadow-[0_18px_18px_rgb(27_25_21/0.22)]" draggable={false} />{/* taste-skill-ignore: the garment's own shadow on the wall */}
          </div>
        ))}
      </div>

      {/* the centred piece: name, price, open */}
      <div className={`mt-2 text-center transition-opacity duration-300 ${open ? "pointer-events-none opacity-0" : "opacity-100"}`} aria-live="polite">
        <p className="text-[1.15rem] font-semibold">
          {item.name}, {item.colour}
        </p>
        <p className="tabular text-ink-2">${item.price}</p>
        <button type="button" onClick={() => setOpen(true)} className="tag tag-xs tag-plain mt-4 h-11 bg-ink pr-5 pl-6 text-[0.95rem] font-semibold text-paper transition-colors hover:bg-copper">
          See the piece
        </button>
      </div>

      {/* the piece, lifted off the rail */}
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby={`${id}-name`}
        inert={!open}
        className={`absolute inset-0 grid grid-rows-[1fr_auto] transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${open ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <div className="relative flex min-h-0 items-center justify-center">
          <button type="button" aria-label="Previous piece" onClick={() => go(index - 1)} disabled={index === 0} className="absolute left-0 z-10 tag tag-xs tag-plain flex size-11 items-center justify-center bg-studio-light transition-colors hover:bg-ink hover:text-paper disabled:opacity-30">
            ←
          </button>
          <div className="relative h-full max-h-[min(48svh,440px)] w-[52%] max-w-[340px]">
            <Image key={item.id} src={item.image} alt={`${item.name}, ${item.colour}`} fill sizes="340px" className="animate-[piece-in_600ms_var(--ease-out)] object-contain drop-shadow-[0_24px_24px_rgb(27_25_21/0.25)]" />{/* taste-skill-ignore: the garment's own shadow */}
          </div>
          <button type="button" aria-label="Next piece" onClick={() => go(index + 1)} disabled={index === rack.length - 1} className="absolute right-0 z-10 tag tag-xs tag-plain flex size-11 items-center justify-center bg-studio-light transition-colors hover:bg-ink hover:text-paper disabled:opacity-30">
            →
          </button>
        </div>
        <div className="text-center">
          <p className="tabular text-[0.9rem] text-ink-2">
            {index + 1} / {rack.length}
          </p>
          <p id={`${id}-name`} className="mt-1 text-[1.4rem] font-semibold">
            {item.name}, {item.colour}
          </p>
          <p className="mx-auto mt-1 max-w-[36ch] text-[0.95rem] text-ink-2">
            ${item.price} · {item.note}
          </p>
          <div className="mt-4 flex justify-center gap-2" role="radiogroup" aria-label="Size">
            {SIZES.map((sz) => (
              <button key={sz} type="button" role="radio" aria-checked={size === sz} onClick={() => setSize(sz)} className={`tag tag-xs tag-plain size-11 text-[0.94rem] font-semibold transition-colors ${size === sz ? "bg-ink text-studio" : "bg-studio-light hover:bg-ink/10"}`}>
                {sz}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button type="button" onClick={() => setAdded(`${item.name} · ${size}`)} className="h-12 rounded-[var(--radius-md)] bg-ink px-6 text-[0.95rem] font-semibold text-studio hover:bg-[#2e2a24]">
              Add to bag · ${item.price}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="h-12 px-3 text-[0.95rem] font-semibold underline-offset-4 hover:underline">
              Back to the rail
            </button>
          </div>
          <p role="status" className="mt-3 min-h-6 text-[0.9rem] text-ink-2">
            {added ? `Added to bag: ${added}. Illustrative shop, nothing is charged.` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
