import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        // pathname: '/photos/**'
      },
      {
        protocol: "https",
        hostname: "airbnbnew.cybersoft.edu.vn",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "airbnbnew.cybersoft.edu.vn",
        pathname: "/avatar/**",
      },
      {
        protocol: "https",
        hostname: "cdn3.ivivu.com",
        pathname: "/2022/09/**",
      },
      {
        protocol: "https",
        hostname: "a0.muscache.com",
        pathname: "/im/pictures/**",
      },
      {
        protocol: "http",
        hostname: "robindelaporte.fr",
        pathname: "/codepen/**",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default withBundleAnalyzer(nextConfig);
