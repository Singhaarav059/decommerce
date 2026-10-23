import type { Metadata } from "next";
import { SolutionPage, solutionMetadata } from "@/components/solution/SolutionPage";

export const metadata: Metadata = solutionMetadata("endless-aisle");

export default function EndlessAislePage() {
  return <SolutionPage slug="endless-aisle" />;
}
