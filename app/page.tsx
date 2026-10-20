import type { Metadata } from 'next';
import { BusanaSection } from '@/components/BusanaSection';
import { FloatingChat } from '@/components/FloatingChat';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { JajulukSection } from '@/components/JajulukSection';
import { KamusSection } from '@/components/KamusSection';
import { KulinerSection } from '@/components/KulinerSection';
import { KuisSection } from '@/components/KuisSection';
import { LaguSection } from '@/components/LaguSection';
import { MargaSection } from '@/components/MargaSection';
import { Navbar } from '@/components/Navbar';
import { PetaSection } from '@/components/PetaSection';
import { KamusProvider } from '@/components/providers/KamusProvider';
import { SejarahSection } from '@/components/SejarahSection';
import { TranslatorSection } from '@/components/TranslatorSection';
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
