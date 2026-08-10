import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  experimental: {
    cpus: 1,
    staticGenerationMaxConcurrency: 1,
  },
};

export default withPayload(nextConfig);
