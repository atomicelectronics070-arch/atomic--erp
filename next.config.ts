import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/dashboard/scraper",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' http://localhost:5173 http://localhost:5005;",
          },
        ],
      },
    ]
  },
};

export default nextConfig;
