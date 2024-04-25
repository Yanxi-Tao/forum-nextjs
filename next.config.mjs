/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer'
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    optimizePackageImports: ['katex'],
  },
}

export default process.env.ANALYZE === 'true'
  ? withBundleAnalyzer(nextConfig)
  : nextConfig
