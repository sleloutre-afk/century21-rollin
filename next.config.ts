import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ne pas annoncer la technologie utilisée dans les en-têtes HTTP.
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
