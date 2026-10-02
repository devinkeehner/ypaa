import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1"],
  outputFileTracingRoot: process.cwd(),
  experimental: {
    cpus: 1,
    globalNotFound: true,
    staticGenerationMaxConcurrency: 1,
  },
};

export default withPayload(nextConfig);
