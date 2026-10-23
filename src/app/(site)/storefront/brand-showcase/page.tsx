import type { Metadata } from "next";
import { SolutionPage, solutionMetadata } from "@/components/solution/SolutionPage";

export const metadata: Metadata = solutionMetadata("brand-showcase");

export default function BrandShowcasePage() {
  return <SolutionPage slug="brand-showcase" />;
}
