/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Disabled to allow API routes (serverless functions) on Vercel
  images: {
    unoptimized: true, 
    domains: [],
    remotePatterns: [],
  },
  // trailingSlash: true, 
}

module.exports = nextConfig

