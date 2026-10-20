import type { Metadata } from 'next';
import { BusanaSection } from '@/components/bab/BusanaSection';
import { FloatingChat } from '@/components/tata-letak/FloatingChat';
import { Footer } from '@/components/tata-letak/Footer';
import { HeroSection } from '@/components/bab/HeroSection';
import { JajulukSection } from '@/components/bab/JajulukSection';
import { KamusSection } from '@/components/bab/KamusSection';
import { KulinerSection } from '@/components/bab/KulinerSection';
import { KuisSection } from '@/components/bab/KuisSection';
import { LaguSection } from '@/components/bab/LaguSection';
import { MargaSection } from '@/components/bab/MargaSection';
import { Navbar } from '@/components/tata-letak/Navbar';
import { PetaSection } from '@/components/bab/PetaSection';
import { KamusProvider } from '@/components/providers/KamusProvider';
import { SejarahSection } from '@/components/bab/SejarahSection';
import { TranslatorSection } from '@/components/bab/TranslatorSection';
import { Tumpal } from '@/components/ui/Tumpal';
import { jsonLd, SITUS } from '@/lib/situs';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/* Data terstruktur beranda: nama situs dan logo untuk hasil pencarian Google */
const DATA_TERSTRUKTUR = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITUS}/#situs`,
      name: 'Dang Lupa ko Komering',
      url: `${SITUS}/`,
      inLanguage: 'id',
      description: 'Portal budaya Suku Komering: sejarah, Basa Kumoring, marga, busana adat, kuliner, dan lagu bersama pemandu virtual Raka & Ratih.',
      publisher: { '@id': `${SITUS}/#organisasi` },
    },
    {
      '@type': 'Organization',
      '@id': `${SITUS}/#organisasi`,
      name: 'Dang Lupa ko Komering',
      url: `${SITUS}/`,
      logo: { '@type': 'ImageObject', url: `${SITUS}/logo-dang-lupa-ko-komering.jpg`, width: 512, height: 512 },
      image: `${SITUS}/og-raka-ratih.jpg`,
    },
  ],
};

export default function Beranda() {
  // Kamus (±520 KB) hanya dimuat di beranda; halaman mandiri dirender di server
  return (
    <KamusProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(DATA_TERSTRUKTUR) }} />
      <Navbar />
      <main id="utama" tabIndex={-1} className="outline-none">
        <HeroSection />
        <Tumpal />
        <TranslatorSection />
        <KamusSection />
        <SejarahSection />
        <PetaSection />
        <MargaSection />
        <BusanaSection />
        <KulinerSection />
        <LaguSection />
        <JajulukSection />
        <KuisSection />
      </main>
      <Footer />
      <FloatingChat />
    </KamusProvider>
  );
}
