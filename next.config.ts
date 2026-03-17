import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Turbopack panics on Korean characters in parent path.
  // Use Webpack for local builds; Vercel will handle prod with Turbopack correctly.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.tistory.com" },
      { protocol: "https", hostname: "**.kakaocdn.net" },
    ],
  },
};

export default nextConfig;
