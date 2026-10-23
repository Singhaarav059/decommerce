import type { MetadataRoute } from "next";
import { allRoutes, brand } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes.map((path) => ({
    url: `${brand.siteUrl}${path === "/" ? "" : path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/privacy") || path.startsWith("/terms") ? 0.3 : 0.7,
  }));
}
