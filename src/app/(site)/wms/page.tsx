import type { Metadata } from "next";
import { SolutionPage, solutionMetadata } from "@/components/solution/SolutionPage";

export const metadata: Metadata = solutionMetadata("wms");

export default function WmsPage() {
  return <SolutionPage slug="wms" />;
}
