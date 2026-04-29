import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: '.',
  },
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
  async rewrites() {
    return [
      {
        source: "/scraper",
        destination: "/scraper/index.html",
      },
      {
        source: "/scraper/:path*",
        destination: "/scraper/:path*",
      },
      {
        source: "/scraper-api/:path*",
        destination: "http://localhost:5005/api/:path*",
      },
      {
        source: "/scraper-download/:path*",
        destination: "http://localhost:5005/:path*",
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
