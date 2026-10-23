import type { Metadata } from "next";
import { SolutionPage, solutionMetadata } from "@/components/solution/SolutionPage";

export const metadata: Metadata = solutionMetadata("quick-commerce");

export default function QuickCommercePage() {
  return <SolutionPage slug="quick-commerce" />;
}
