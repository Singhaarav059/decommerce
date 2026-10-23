import type { Metadata } from "next";
import { SolutionPage, solutionMetadata } from "@/components/solution/SolutionPage";

export const metadata: Metadata = solutionMetadata("tms");

export default function TmsPage() {
  return <SolutionPage slug="tms" />;
}
