'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { DATA } from '@/lib/konten';
import { useKamus } from './providers/KamusProvider';
import { Bab } from './ui/Bab';
import { GambarBertitik } from './ui/GambarBertitik';
import { Reveal } from './ui/Reveal';
import { TagKata } from './ui/TagKata';
import { TombolDengar } from './ui/TombolDengar';

export function BusanaSection() {
  const { kamus } = useKamus();
  const [aktif, setAktif] = useState(1);
  const b = DATA.busana[aktif];

  return (
    <Bab
      id="busana"
      nomor="05"
      label="Busana & Adat"
      pita
      judul={
        <>
          Busana Pengantin &amp; <span className="teks-emas">Adat Pernikahan</span>
        </>
      }
      deskripsi="Beludru merah, sulaman emas, dan songket berkilau. Ketuk tiap titik untuk mengenal makna di balik busana adat Komering."
    >
      <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Reveal>
          <GambarBertitik
            src="/busana-adat-komering.jpg"
            alt="Sepasang pengantin berbusana adat Komering — beludru merah bersulam emas, songket, kopiah dan mahkota emas — berdiri di depan rumah panggung kayu"
            lebar={1200}
            tinggi={896}
            titik={DATA.busana}
            aktif={aktif}
            onPilih={setAktif}
          />
        </Reveal>
        <Reveal className="permukaan rounded-3xl p-6" delay={0.1}>
          <div className="min-h-[11rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={b.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl font-bold text-gading">{b.nama}</h3>
                  <TombolDengar id={`busana-${b.key}`} teks={`${b.nama}. ${b.isi}`} label={`Dengarkan: ${b.nama}`} rate={1} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gading/75">{b.isi}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="my-5 h-px bg-emas/20" />
          <div className="flex flex-wrap gap-2">
            {DATA.busana.map((t, i) => (
              <button key={t.key} type="button" className="chip" aria-pressed={i === aktif} onClick={() => setAktif(i)}>
                {t.nama}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-16">
        <h3 className="text-center font-display text-2xl font-bold text-gading sm:text-3xl">Tahapan Adat Pernikahan Komering</h3>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-pasir">
          Istilah dan maknanya diambil dari Kamus Basa Kumoring — ketuk 📖 untuk membuka entrinya. Urutan dapat berbeda di setiap marga.
        </p>
      </Reveal>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DATA.adatPernikahan.map((s, i) => {
          const entri = kamus?.id(s.kamus);
          return (
            <Reveal as="li" key={s.km} delay={(i % 3) * 0.08} className="permukaan kartu-motif flex flex-col rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <span className="angka-tahap" aria-hidden>
                  {s.ikon}
                </span>
                <span className="text-xs font-bold tracking-widest text-emas-400">TAHAP {i + 1}</span>
              </div>
              <h4 className="mt-4 font-display text-xl font-bold text-emas-300">{s.km}</h4>
              <p className="text-sm font-semibold text-gading">{s.judul}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gading/75">{s.isi}</p>
              {entri && (
                <TagKata kata={entri.kata} className="mt-4 self-start">
                  📖 {entri.kata} · {entri.id}
                </TagKata>
              )}
            </Reveal>
          );
        })}
      </ol>
    </Bab>
  );
}
