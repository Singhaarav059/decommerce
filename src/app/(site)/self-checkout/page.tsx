import type { Metadata } from "next";
import { SolutionPage, solutionMetadata } from "@/components/solution/SolutionPage";

export const metadata: Metadata = solutionMetadata("self-checkout");

export default function SelfCheckoutPage() {
  return <SolutionPage slug="self-checkout" />;
}
