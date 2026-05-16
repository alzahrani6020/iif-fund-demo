/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable Turbopack for Vercel compatibility
  turbopack: {},
  poweredByHeader: false,
}

export default nextConfig
