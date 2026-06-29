import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the Turbopack root to this app dir so stray lockfiles in parent
  // folders can't make Next infer the wrong workspace root.
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: "/stays", destination: "/stay", permanent: true },
      { source: "/plan", destination: "/plan-my-trip", permanent: true },
      { source: "/hidden-kotagiri", destination: "/hidden-gems", permanent: true },
      {
        source: "/hidden-kotagiri/:path*",
        destination: "/hidden-gems",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

// Cloudflare OpenNext adapter: enables Workers bindings during `next dev`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
