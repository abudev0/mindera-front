/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.mindera.uz' }],
        destination: 'https://mindera.uz/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
