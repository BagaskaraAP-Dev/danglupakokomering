'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import { DATA } from '@/lib/konten';
import { useKamus } from '../providers/KamusProvider';
import { Bab } from '../ui/Bab';
import { GambarBertitik } from '../ui/GambarBertitik';
import { Reveal } from '../ui/Reveal';
import { TagKata } from '../ui/TagKata';
import { TombolDengar } from '../ui/TombolDengar';

export function BusanaSection() {
  const { kamus } = useKamus();
  const [aktif, setAktif] = useState(1);
  const b = DATA.busana[aktif];

  return (
    <Bab
      id="busana"
      pita
      tata="kiri"
      label="Busana & adat"
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
        <Reveal className="permukaan rounded-3xl p-6">
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

      {/* Tahapan adat: satu alur bernomor dari perkenalan sampai pemberian gelar */}
      <Reveal className="mt-20 grid gap-4 lg:grid-cols-[0.42fr_1fr] lg:gap-12">
        <div>
          <h3 className="font-display text-2xl font-bold text-gading sm:text-3xl">Tahapan Adat Pernikahan</h3>
          <p className="mt-3 text-sm leading-relaxed text-pasir">
            Istilah dan maknanya diambil dari Kamus Basa Kumoring; ketuk nomor kamus untuk membuka entrinya. Urutan dapat berbeda di setiap
            marga.
          </p>
        </div>
        <ol className="alur-adat">
          {DATA.adatPernikahan.map((s, i) => {
            const entri = kamus?.id(s.kamus);
            return (
              <li key={s.km}>
                <span className="nomor-alur" aria-hidden>
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-xl font-bold text-emas-300">
                    {s.km} <span className="font-sans text-sm font-semibold text-gading">· {s.judul}</span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-gading/75">{s.isi}</p>
                  {entri && (
                    <TagKata kata={entri.kata} className="mt-2">
                      <BookOpen className="size-3.5" aria-hidden /> {entri.kata} · {entri.id}
                    </TagKata>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </Reveal>
    </Bab>
  );
}
