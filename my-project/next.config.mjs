/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure Vercel builds correctly with App Router
  distDir: '.next',
  poweredByHeader: false,
}

export default nextConfig
