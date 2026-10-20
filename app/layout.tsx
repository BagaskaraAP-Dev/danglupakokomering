import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { TautanLewati } from '@/components/ui/TautanLewati';
import { SITUS } from '@/lib/situs';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const GAMBAR_PRATINJAU_ALT = 'Logo Dang Lupa ko Komering dan maskot Raka & Ratih berbusana adat pengantin Komering, menangkupkan tangan memberi salam';

export const metadata: Metadata = {
  metadataBase: new URL(SITUS),
  title: {
    default: 'Dang Lupa ko Komering — Portal Budaya & AI Suku Komering',
    template: '%s · Dang Lupa ko Komering',
  },
  description:
    'Kenali sejarah, bahasa, marga, busana adat, kuliner, dan lagu Suku Komering bersama pemandu virtual Raka & Ratih. Dilengkapi penerjemah AI Basa Kumoring, kamus, generator jajuluk, kuis, dan chatbot.',
  openGraph: {
    title: 'Dang Lupa ko Komering',
    description: 'Portal budaya Suku Komering berbasis AI — Vibe Coding IT Festival 2026.',
    // 1200×630 (rasio pratinjau tautan), 84 KB: cukup kecil untuk pratinjau WhatsApp. Nama berkas baru
    // (bukan og-beranda.jpg) agar WhatsApp & Facebook mengambil gambar baru, bukan salinan lama di cache
    images: [{ url: '/og-raka-ratih.jpg', width: 1200, height: 630, alt: GAMBAR_PRATINJAU_ALT }],
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dang Lupa ko Komering',
  },
  twitter: { card: 'summary_large_image', images: [{ url: '/og-raka-ratih.jpg', alt: GAMBAR_PRATINJAU_ALT }] },
  // Kode verifikasi Google Search Console & Bing Webmaster dari Environment Variable Vercel; kosong = tidak dipasang
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: '#140706',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <TautanLewati />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
