import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/providers/ToastProvider';
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
    images: ['/maskot-pasangan-hero.jpg'],
    type: 'website',
    locale: 'id_ID',
  },
};

export const viewport: Viewport = {
  themeColor: '#140706',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${playfair.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        {/* Penanda JS aktif: elemen maskot baru disembunyikan bila animasi GSAP bisa berjalan */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="font-sans antialiased">
        <a href="#utama" className="skip-link">
          Lewati ke konten utama
        </a>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
