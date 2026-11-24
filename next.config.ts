import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 builds a plain static site into `out/` for GitHub Pages
 * (see scripts/deploy.mjs). That build leaves out the server-only routes
 * (`route.server.ts`: the admin API and the /media handler), which only run
 * locally where the admin panel talks to the site.
 */
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  cacheComponents: true,
  ...(isExport
    ? {
        output: "export",
        // Separate build folder so an export never clobbers a running `next start`.
        distDir: ".next-export",
        pageExtensions: ["tsx", "ts", "jsx", "js"],
      }
    : {
        partialPrefetching: true,
        pageExtensions: ["server.ts", "tsx", "ts", "jsx", "js"],
      }),
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
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
