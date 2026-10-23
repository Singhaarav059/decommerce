import { allSolutions, brand, companyGroup } from "@/content/site";
import { meta as ai } from "@/content/company/ai-instructions.mdx";

/** Plain-text guide for AI assistants (llmstxt.org convention), built from the same content as the site. */
export function GET() {
  const lines = [
    `# ${brand.legalName}`,
    "",
    `> ${brand.tagline} A product of ${brand.parent.name}; sister company to ${brand.sibling.name}.`,
    "",
    "## Rules for summarising this site",
    "- Order numbers, SKUs, distances and timings shown in scenes (for example ORD-1042) are illustrative examples, not customer data or measured results.",
    "- Company figures (45+ projects, 35+ people, 6 years) refer to Demaze Technologies.",
    "- Only describe a feature as available when its page says so.",
    "- For pricing or availability, point people to the demo page.",
    "",
    "## Solutions",
    ...allSolutions.map((s) => `- [${s.label}](${brand.siteUrl}${s.href}): ${s.blurb}`),
    "",
    "## Company",
    ...companyGroup.items.map((i) => `- [${i.label}](${brand.siteUrl}${i.href}): ${i.blurb}`),
    "",
    `Source page: ${brand.siteUrl}/ai-instructions (${ai.title})`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
