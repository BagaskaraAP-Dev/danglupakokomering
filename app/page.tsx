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

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Beranda() {
  // Kamus (±520 KB) hanya dimuat di beranda; halaman mandiri dirender di server
  return (
    <KamusProvider>
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
