import type { Metadata } from "next";
import { SolutionPage, solutionMetadata } from "@/components/solution/SolutionPage";

export const metadata: Metadata = solutionMetadata("pos");

export default function PosPage() {
  return <SolutionPage slug="pos" />;
}
