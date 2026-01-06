/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
    domains: [],
    remotePatterns: [],
  },
  trailingSlash: true, // Helps with Firebase Hosting routing
}

module.exports = nextConfig

