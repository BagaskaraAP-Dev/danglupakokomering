'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { DATA } from '@/lib/konten';
import { Bab } from './ui/Bab';
import { GambarBertitik } from './ui/GambarBertitik';
import { Reveal } from './ui/Reveal';
import { TombolDengar } from './ui/TombolDengar';

const AWAL = Math.max(0, DATA.wilayah.findIndex((w) => w.key === 'martapura'));

export function PetaSection() {
  const [aktif, setAktif] = useState(AWAL);
  const w = DATA.wilayah[aktif];

  return (
    <Bab
      id="peta"
      nomor="03"
      label="Tanoh Kumoring"
      pita
      judul={
        <>
          Peta Wilayah <span className="teks-emas">Sebaran Komering</span>
        </>
      }
      deskripsi="Ketuk titik di peta untuk mengenal kota dan kawasan penting di sepanjang aliran Way Komering — dari Danau Ranau hingga Palembang."
    >
      <div className="grid items-start gap-6 lg:grid-cols-[1.45fr_0.55fr]">
        <Reveal>
          <GambarBertitik
            src="/peta-wilayah-komering.jpg"
            alt="Peta wilayah sebaran Suku Komering di Provinsi Sumatera Selatan: OKU Selatan, OKU Timur, OKU, dan OKI, dengan aliran Sungai Komering dari Danau Ranau ke Palembang"
            lebar={1200}
            tinggi={896}
            titik={DATA.wilayah}
            aktif={aktif}
            onPilih={setAktif}
          />
        </Reveal>

        <Reveal className="permukaan rounded-3xl p-6" delay={0.1}>
          <div className="min-h-[12rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={w.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="tag">{w.kab}</span>
                    <h3 className="mt-2 font-display text-2xl font-bold text-gading">
                      {w.ikon} {w.nama}
                    </h3>
                  </div>
                  <TombolDengar id={`peta-${w.key}`} teks={`${w.nama}. ${w.isi}`} label={`Dengarkan: ${w.nama}`} rate={1} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gading/75">{w.isi}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="my-5 h-px bg-emas/20" />
          <p className="mb-2 text-xs font-semibold text-pasir">Daftar lokasi</p>
          <div className="grid grid-cols-2 gap-1 lg:grid-cols-1">
            {DATA.wilayah.map((t, i) => (
              <button key={t.key} type="button" className="tombol-tempat" aria-pressed={i === aktif} onClick={() => setAktif(i)}>
                <span aria-hidden>{t.ikon}</span>
                {t.nama}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </Bab>
  );
}
