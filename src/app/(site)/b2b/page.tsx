import type { Metadata } from "next";
import { SolutionPage, solutionMetadata } from "@/components/solution/SolutionPage";

export const metadata: Metadata = solutionMetadata("b2b");

export default function B2BPage() {
  return <SolutionPage slug="b2b" />;
}
