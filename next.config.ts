import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Sembunyikan tombol bulat "N" (Next.js Dev Indicator) di pojok layar saat `npm run dev`
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
