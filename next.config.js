/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    formats: ['image/webp'],
  },
};

module.exports = nextConfig;
