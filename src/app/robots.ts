import type { MetadataRoute } from "next";
import { brand } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/lab", "/capture", "/api/"] }],
    sitemap: `${brand.siteUrl}/sitemap.xml`,
  };
}
