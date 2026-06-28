import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the Turbopack root to this app dir so stray lockfiles in parent
  // folders can't make Next infer the wrong workspace root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

// Cloudflare OpenNext adapter: enables Workers bindings during `next dev`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
