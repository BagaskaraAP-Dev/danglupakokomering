/* Alamat situs produksi (Vercel) untuk metadataBase, canonical, sitemap, dan Open Graph */
export const SITUS = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

/** JSON-LD aman disisipkan ke <script>: "<" di-escape agar tidak bisa menutup tag */
export const jsonLd = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c');
