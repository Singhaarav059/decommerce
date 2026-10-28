import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    // AVIF first: smaller at the same quality, so photos can be served sharper for the same bytes
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 85],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
