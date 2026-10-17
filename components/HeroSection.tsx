'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Languages, MapPin, Sparkles } from 'lucide-react';
import { DATA } from '@/lib/konten';
import { MascotShowcase } from './MascotShowcase';
import { useKamus } from './providers/KamusProvider';
import { StatCounter } from './StatCounter';
import { TautanMagnet } from './ui/TautanMagnet';

const PERCIK = [
  { top: '22%', left: '8%', delay: '0s' },
  { top: '70%', left: '46%', delay: '-1.4s' },
  { top: '16%', right: '10%', delay: '-2.6s' },
  { bottom: '12%', right: '30%', delay: '-0.8s' },
];

export function HeroSection() {
  const { meta } = useKamus();
  const diam = useReducedMotion();
  const muncul = (i: number) => ({
    initial: diam ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.1 + i * 0.09, ease: [0.2, 0.8, 0.2, 1] as const },
  });

  return (
    <section id="beranda" className="relative overflow-hidden pb-16 pt-28 lg:pb-24 lg:pt-36">
      {PERCIK.map(({ delay, ...posisi }, i) => (
        <span key={i} className="percik animate-kelip" style={{ ...posisi, animationDelay: delay }} aria-hidden />
      ))}

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="space-y-6">
          <motion.span {...muncul(0)} className="lencana-kilau">
            <Sparkles className="size-4 text-emas-400" aria-hidden />
            Pelestarian Budaya Suku Komering Berbasis AI
          </motion.span>

          <motion.h1 {...muncul(1)} className="font-display text-5xl font-extrabold leading-[1.03] text-gading sm:text-6xl lg:text-7xl">
            Dang Lupa ko <span className="teks-emas">Komering</span>
          </motion.h1>
          <motion.p {...muncul(2)} className="font-display text-xl italic text-emas-300">
            “Jangan lupakan Komering.”
          </motion.p>

          <motion.p {...muncul(3)} className="max-w-xl text-lg leading-relaxed text-gading/75">
            Kenali sejarah, asal-usul, adat pernikahan, lagu daerah, makanan khas, dan wilayah di sepanjang Sungai Komering,
            hingga terjemahan <strong className="text-emas-200">Basa Kumoring</strong> bersama pemandu virtual{' '}
            <strong className="text-emas-200">Raka &amp; Ratih</strong>.
          </motion.p>

          <motion.div {...muncul(4)} className="flex flex-wrap gap-3 pt-1">
            <TautanMagnet href="#penerjemah" className="btn-emas">
              <Languages className="size-[1.1rem]" aria-hidden />
              Coba AI Penerjemah
            </TautanMagnet>
            <TautanMagnet href="#peta" className="btn-kaca" kekuatan={0.2}>
              <MapPin className="size-[1.1rem]" aria-hidden />
              Jelajahi Peta &amp; Budaya
            </TautanMagnet>
          </motion.div>

          <motion.dl {...muncul(5)} className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
            <StatCounter label="Kata di kamus" nilai={meta.jumlahKata} />
            <StatCounter label="Contoh kalimat" nilai={meta.jumlahContoh} tunda={0.1} />
            <StatCounter label="Kebuayan/marga" nilai={DATA.marga.length} tunda={0.2} />
            <StatCounter label="Kabupaten" nilai={4} tunda={0.3} />
          </motion.dl>
        </div>

        <MascotShowcase />
      </div>
    </section>
  );
}
