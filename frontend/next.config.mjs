/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */

  allowedDevOrigins: ['192.168.10.15'],

  reactCompiler: true,

  images: {
    // Allows Next.js SSR image optimization to fetch from localhost/private IPs
    dangerouslyAllowSVG: true,
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/posts/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/uploads/posts/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.10.15',
        port: '5000',
        pathname: '/uploads/posts/**',
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
