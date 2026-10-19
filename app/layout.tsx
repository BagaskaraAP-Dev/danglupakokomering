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
    // 1200×630 (rasio pratinjau tautan), 58 KB: cukup kecil untuk pratinjau WhatsApp
    images: [{ url: '/og-beranda.jpg', width: 1200, height: 630, alt: 'Maskot Raka dan Ratih berbusana adat pengantin Komering' }],
    type: 'website',
    locale: 'id_ID',
    siteName: 'Dang Lupa ko Komering',
  },
  twitter: { card: 'summary_large_image' },
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
