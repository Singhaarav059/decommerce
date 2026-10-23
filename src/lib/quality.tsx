"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Quality tiers (PLAN.md):
 *   high — real-time 3D + post-processing, dpr up to 2
 *   mid  — real-time 3D, no post, dpr 1–1.5
 *   low  — posters + video loops, no WebGL at all
 * "pending" until detection finishes; treat it like low (posters show first).
 */
export type Tier = "pending" | "low" | "mid" | "high";

const KEY = "dc-tier-v1";
const QualityContext = createContext<Tier>("pending");

export function useQuality() {
  return useContext(QualityContext);
}

export function dprFor(tier: Tier, mobile = isMobile()): [number, number] {
  if (tier === "high") return mobile ? [1, 1.5] : [1, 2];
  return mobile ? [1, 1.25] : [1, 1.5];
}

function isMobile() {
  return typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches;
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Rough guess from hardware hints, used when the benchmark lookup is slow or fails. */
function heuristicTier(): Tier {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency ?? 4;
  if (mem <= 2 || cores <= 2) return "low";
  if (isMobile()) return mem >= 6 && cores >= 8 ? "mid" : "low";
  return cores >= 8 ? "high" : "mid";
}

async function detect(): Promise<Tier> {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";
  if (!hasWebGL()) return "low";
  const forced = new URLSearchParams(location.search).get("tier");
  if (forced === "low" || forced === "mid" || forced === "high") return forced;

  try {
    const { getGPUTier } = await import("detect-gpu");
    const timeout = new Promise<null>((r) => setTimeout(() => r(null), 2500));
    const result = await Promise.race([getGPUTier(), timeout]);
    if (!result) return heuristicTier();
    if (result.tier <= 1) return "low";
    if (result.tier === 2 || result.isMobile) return "mid";
    return "high";
  } catch {
    return heuristicTier();
  }
}

export function QualityProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<Tier>("pending");

  useEffect(() => {
    let cancelled = false;
    const forced = new URLSearchParams(location.search).get("tier");
    let cached: string | null = null;
    try {
      cached = forced ? null : sessionStorage.getItem(KEY);
    } catch {}
    const done = (t: Tier) => {
      if (cancelled) return;
      setTier(t);
      try {
        sessionStorage.setItem(KEY, t);
      } catch {}
    };
    if (cached === "low" || cached === "mid" || cached === "high") {
      queueMicrotask(() => done(cached as Tier));
    } else {
      detect().then(done);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.tier = tier;
  }, [tier]);

  return <QualityContext.Provider value={tier}>{children}</QualityContext.Provider>;
}
