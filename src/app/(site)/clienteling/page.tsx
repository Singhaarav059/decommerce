import type { Metadata } from "next";
import { SolutionPage, solutionMetadata } from "@/components/solution/SolutionPage";

export const metadata: Metadata = solutionMetadata("clienteling");

export default function ClientelingPage() {
  return <SolutionPage slug="clienteling" />;
}
