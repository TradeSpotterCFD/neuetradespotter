/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {},
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'osczeivfaaaimfhasfrh.supabase.co',
        port: '',
        pathname: '/**', // ✅ Erlaube ALLE Pfade von Supabase
      },
    ],
  },
}

export default nextConfig;
