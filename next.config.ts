import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: '/tarifs/',
        destination: 'https://www.institutfawaid.fr/formules',
        statusCode: 301,
      },
      {
        source: '/tarifs',
        destination: 'https://www.institutfawaid.fr/formules',
        statusCode: 301,
      },
      {
        source: '/nos-programmes/',
        destination: 'https://www.institutfawaid.fr/programmes',
        statusCode: 301,
      },
      {
        source: '/nos-programmes',
        destination: 'https://www.institutfawaid.fr/programmes',
        statusCode: 301,
      },
      {
        source: '/:path+/',
        destination: '/:path+',
        statusCode: 308,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
