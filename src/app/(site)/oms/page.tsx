import type { Metadata } from "next";
import { SolutionPage, solutionMetadata } from "@/components/solution/SolutionPage";

export const metadata: Metadata = solutionMetadata("oms");

export default function OmsPage() {
  return <SolutionPage slug="oms" />;
}
