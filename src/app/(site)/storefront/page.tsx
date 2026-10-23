import type { Metadata } from "next";
import { SolutionPage, solutionMetadata } from "@/components/solution/SolutionPage";

export const metadata: Metadata = solutionMetadata("storefront");

export default function StorefrontPage() {
  return <SolutionPage slug="storefront" />;
}
