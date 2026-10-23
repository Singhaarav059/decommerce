import type { Metadata } from "next";
import { CaptureStage } from "./CaptureStage";

export const metadata: Metadata = { title: "Capture", robots: { index: false, follow: false } };

/** Full-viewport scene for scripts/capture-sequence.mjs and scripts/posters.mjs. Not linked anywhere. */
export default function CapturePage() {
  return <CaptureStage />;
}
