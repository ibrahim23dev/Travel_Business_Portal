import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true, // This is a standard Next.js setting, leave it if it's there
  images: {
    domains: [
      'images.pexels.com', 
      'www.conradmaldives.com'
    ],
  },
};

export default nextConfig;
