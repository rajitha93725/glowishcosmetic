/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.graphassets.com" },
      { protocol: "https", hostname: "media.graphcms.com" },
      { protocol: "https", hostname: "**.hygraph.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
