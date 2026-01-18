/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    turbo: {
      rules: {}, // desabilita configs especiais
    },
  },
  // Suprime logs de requisições 404 conhecidas
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Desabilitar logs desnecessários
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Suprimir warnings específicos
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.ignoreWarnings = [
        /Unsupported metadata viewport/,
      ]
    }
    return config
  },
}

export default nextConfig
