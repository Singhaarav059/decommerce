import type { Metadata } from "next";
import { SolutionPage, solutionMetadata } from "@/components/solution/SolutionPage";

export const metadata: Metadata = solutionMetadata("marketplace");

export default function MarketplacePage() {
  return <SolutionPage slug="marketplace" />;
}
