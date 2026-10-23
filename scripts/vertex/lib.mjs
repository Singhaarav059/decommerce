// Shared Vertex AI helpers: auth via local Application Default Credentials
// (gcloud auth application-default login), a hard spending cap, and a ledger
// of every paid call in assets-src/vertex/ledger.json.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export const PROJECT = process.env.VERTEX_PROJECT ?? "silicon-alchemy-476503-i4";
export const REGION = process.env.VERTEX_REGION ?? "us-central1";
/** Stop before any call that would take total spend past this (USD). */
export const CAP_USD = Number(process.env.VERTEX_CAP_USD ?? 100);
const LEDGER = "assets-src/vertex/ledger.json";
const GCLOUD = existsSync("/opt/homebrew/bin/gcloud") ? "/opt/homebrew/bin/gcloud" : "gcloud";

/** USD per second of video, no audio (Vertex pricing page, Oct 2026). Verify against billing after the first calls. */
export const VIDEO_PRICE = {
  "veo-3.1-lite-generate-001": { "720p": 0.03, "1080p": 0.05 },
  "veo-3.1-fast-generate-001": { "720p": 0.08, "1080p": 0.1 },
  "veo-3.1-generate-001": { "720p": 0.2, "1080p": 0.2, "4k": 0.4 },
};

export function token() {
  return execFileSync(GCLOUD, ["auth", "application-default", "print-access-token"], { encoding: "utf8" }).trim();
}

export function ledger() {
  if (!existsSync(LEDGER)) return { entries: [], totalUsd: 0 };
  return JSON.parse(readFileSync(LEDGER, "utf8"));
}

/** Throws if the estimated cost would exceed the cap; call before every paid request. */
export function guard(estimateUsd, label) {
  const l = ledger();
  const after = l.totalUsd + estimateUsd;
  console.log(`[cost] ${label}: est $${estimateUsd.toFixed(2)} · spent so far $${l.totalUsd.toFixed(2)} · cap $${CAP_USD}`);
  if (after > CAP_USD) throw new Error(`Spending cap reached: $${after.toFixed(2)} would exceed $${CAP_USD}. Raise VERTEX_CAP_USD to continue.`);
}

export function record(entry) {
  const l = ledger();
  l.entries.push({ at: new Date().toISOString(), ...entry });
  l.totalUsd = +(l.totalUsd + entry.usd).toFixed(4);
  mkdirSync(dirname(LEDGER), { recursive: true });
  writeFileSync(LEDGER, JSON.stringify(l, null, 2) + "\n");
  console.log(`[cost] recorded $${entry.usd.toFixed(2)} · total $${l.totalUsd.toFixed(2)}`);
}

export async function vertex(path, body) {
  const url = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT}/locations/${REGION}/${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json", "x-goog-user-project": PROJECT },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Vertex ${res.status}: ${JSON.stringify(json.error ?? json).slice(0, 600)}`);
  return json;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
