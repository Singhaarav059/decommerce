"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check } from "@/components/ui/Check";
import { live } from "@/content/home";

/**
 * The product, working: six example screens on daylight panels. Orders arrive, a sale at the
 * store drops every channel's count at once, the van moves along its route, the till takes a
 * tap, the customer record fills in and every channel reports in sync. Loops gently; holds a
 * finished state for reduced-motion visitors.
 */
function useTick(ms: number, steps: number) {
  const [t, setT] = useState(steps - 1);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const raf = requestAnimationFrame(() => setT(0));
    const id = window.setInterval(() => setT((v) => (v + 1) % steps), ms);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [ms, steps]);
  return t;
}

function Panel({ title, className = "", children }: { title: string; className?: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className={`rv tag tag-sm flex flex-col overflow-hidden p-5 md:p-6 bg-studio-light ${className}`}>
      <h3 className="text-[1.125rem] font-semibold tracking-tight">{title}</h3>
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
      <p className="mt-4 text-[0.8125rem] text-ink-2">{live.tag}</p>
    </div>
  );
}

const statusTone: Record<string, string> = {
  Delivered: "bg-ink",
  Packed: "bg-ink/25",
  "Out for delivery": "bg-copper",
  Routed: "bg-copper/45",
};

function Orders() {
  // always five orders; every few seconds the list rotates and the newest slides in on top
  const all = live.orders.rows;
  const n = all.length;
  const t = useTick(2600, n);
  const rows = Array.from({ length: n }, (_, i) => all[(t + n - i) % n]);
  return (
    <Panel title={live.orders.title} className="lg:col-span-7 lg:row-span-2">
      <div className="grid grid-cols-[1fr_auto] gap-2 pb-2 text-[0.8125rem] text-ink-2 sm:grid-cols-[7rem_1fr_1fr_auto]">
        <span>Order</span>
        <span className="hidden sm:block">Channel</span>
        <span className="hidden sm:block">Ships from</span>
        <span>Status</span>
      </div>
      <ul className="mt-1 flex-1">
        {rows.map((r, i) => (
          <li key={r.id} className={`grid grid-cols-[1fr_auto] items-center gap-2 py-3 text-[0.92rem] sm:grid-cols-[7rem_1fr_1fr_auto] ${i === 0 ? "animate-[rise_600ms_var(--ease-out)_both]" : ""}`}>
            <span className="font-medium">{r.id}</span>
            <span className="hidden text-ink-2 sm:block">{r.channel}</span>
            <span className="hidden text-ink-2 sm:block">{r.where}</span>
            <span className="flex items-center gap-2 text-[0.875rem] font-semibold whitespace-nowrap">
              <span aria-hidden className={`tag tag-plain size-2.5 [--cut:4px] ${statusTone[r.status]}`} />
              {r.status}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-[var(--radius-md)] bg-studio p-4">
        <p className="text-[0.8125rem] text-ink-2">{live.mix.title}</p>
        <div className="mt-3 flex h-24 items-end gap-3">
          {live.mix.bars.map(([k, v], i) => (
            <div key={k} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <span className="text-[0.8125rem] text-ink-2">{v}%</span>
              <span className="live-bar w-full rounded-t-[6px] bg-copper" style={{ height: `${Math.round(v * 1.2)}%`, animationDelay: `${i * 120}ms`, opacity: 1 - i * 0.18 }} />
              <span className="truncate text-[0.8125rem] text-ink-2">{k}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-[0.8125rem] text-ink-2">Every order routed to the location that can deliver it fastest. Illustrative figures.</p>
    </Panel>
  );
}

function Stock() {
  const t = useTick(2400, 3); // 0 before the sale, 1 the sale, 2 everyone updated
  const sold = t >= 1;
  const synced = t === 2;
  return (
    <Panel title={live.stock.title} className="lg:col-span-5">
      <div className="grid grid-cols-4 gap-2">
        {live.stock.channels.map((c, i) => {
          const v = (i === 0 ? sold : synced) ? live.stock.from - 1 : live.stock.from;
          const flash = (i === 0 && t === 1) || (i > 0 && t === 2);
          return (
            <div key={c} className={`rounded-[var(--radius-md)] p-3 text-center transition-colors duration-500 ${flash ? "bg-copper text-paper" : "bg-studio"}`}>
              <p key={v} className="display text-[2rem] leading-none animate-[rise_500ms_var(--ease-out)_both]">{v}</p>
              <p className={`mt-1.5 truncate text-[0.8125rem] ${flash ? "text-paper" : "text-ink-2"}`}>{c}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 flex items-center gap-2 text-[0.85rem] text-ink-2">
        <span className={`size-2 rounded-full ${sold ? "bg-copper" : "bg-line-strong"}`} />
        {sold ? (synced ? "Every channel updated at the same moment" : live.stock.sale) : "Waiting for the next sale"}
      </p>
    </Panel>
  );
}

function Route() {
  return (
    <Panel title={live.route.title} className="lg:col-span-5">
      <div className="relative flex-1 overflow-hidden rounded-[var(--radius-md)] bg-studio">
        <svg viewBox="0 0 320 150" className="h-full min-h-[150px] w-full" aria-hidden>
          {/* streets */}
          {[30, 75, 120].map((y) => (
            <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="var(--line-strong)" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
          ))}
          {[60, 150, 240].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="150" stroke="var(--line-strong)" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
          ))}
          <path id="route7" d="M 24 120 L 150 120 L 150 75 L 240 75 L 240 30 L 296 30" fill="none" stroke="var(--copper)" strokeWidth="3" strokeDasharray="6 6" />
          <circle cx="24" cy="120" r="6" fill="var(--ink)" />
          <circle cx="296" cy="30" r="7" fill="var(--copper)" className="route-pin" />
          <g className="route-van">
            <rect x="-9" y="-6" width="18" height="12" rx="3" fill="var(--ink)" />
          </g>
        </svg>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[0.8125rem] text-ink-2">{live.route.stop}</p>
          <p className="text-[0.85rem] text-ink-2">{live.route.note}</p>
        </div>
        <p className="display text-[1.9rem] leading-none text-copper">{live.route.eta}</p>
      </div>
    </Panel>
  );
}

function Till() {
  const t = useTick(1800, 4); // 0 ready, 1 tap, 2 paid, 3 receipt
  return (
    <Panel title={live.till.title} className="lg:col-span-4">
      <p className="text-[0.9rem] text-ink-2">{live.till.item}</p>
      <div className="relative mt-4 flex flex-1 items-center justify-center rounded-[var(--radius-md)] bg-studio py-6">
        <div className={`flex size-16 items-center justify-center rounded-full transition-[scale,background-color,color] duration-500 ${t >= 2 ? "scale-100 bg-copper text-paper" : "scale-90 bg-studio-light text-ink"}`}>
          <span className="text-[1.6rem] leading-none">{t >= 2 ? <Check /> : <svg aria-hidden viewBox="0 0 16 16" className="size-[1em]"><circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>}</span>
        </div>
      </div>
      <p className="mt-4 text-[0.95rem] font-semibold">{t >= 2 ? live.till.paid : "Tap to pay"}</p>
      <p className={`text-[0.85rem] text-ink-2 transition-opacity duration-500 ${t >= 3 ? "opacity-100" : "opacity-0"}`}>{live.till.receipt}</p>
    </Panel>
  );
}

function Customer() {
  const c = live.customer;
  return (
    <Panel title={c.title} className="lg:col-span-4">
      <div className="flex items-center gap-3">
        <span className="display flex size-12 items-center justify-center rounded-[var(--radius-md)] bg-copper text-[1.1rem] text-paper">{c.initials}</span>
        <div>
          <p className="font-semibold">{c.name}</p>
          <p className="text-[0.85rem] text-ink-2">{c.size}</p>
        </div>
      </div>
      <dl className="mt-4 space-y-2 text-[0.88rem]">
        <div className="flex justify-between gap-3 pt-2">
          <dt className="text-ink-2">Last bought</dt>
          <dd className="text-right font-medium">{c.last}</dd>
        </div>
        <div className="flex justify-between gap-3 pt-2">
          <dt className="text-ink-2">Shops on</dt>
          <dd className="flex gap-1.5">
            {c.seen.map((s) => (
              <span key={s} className="bg-studio px-2 py-0.5 text-[0.8125rem]">{s}</span>
            ))}
          </dd>
        </div>
      </dl>
    </Panel>
  );
}

function Sync() {
  const t = useTick(1000, 60);
  return (
    <Panel title={live.sync.title} className="lg:col-span-4">
      <ul className="flex-1 space-y-2.5">
        {live.sync.rows.map((r, i) => (
          <li key={r} className="flex items-center justify-between gap-3 text-[0.92rem]">
            <span className="flex items-center gap-2.5">
              <span className="relative flex size-2.5">
                <span className="relative inline-flex size-2.5 rounded-full bg-copper" />
              </span>
              {r}
            </span>
            <span className="text-[0.8125rem] text-ink-2">{live.sync.note} · {((t + i * 7) % 9) + 1}s ago</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function LiveSystem() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
      <Orders />
      <Stock />
      <Route />
      <Till />
      <Customer />
      <Sync />
    </div>
  );
}
