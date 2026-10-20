'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DATA } from '@/lib/konten';
import { norm } from '@/lib/teks';
import { Bab } from '../ui/Bab';
import { Reveal } from '../ui/Reveal';

const KABUPATEN = ['Semua', ...new Set(DATA.marga.map((m) => m.kab))];

export function MargaSection() {
  const [kab, setKab] = useState('Semua');
  const [q, setQ] = useState('');
  const daftar = useMemo(() => {
    const nq = norm(q);
    return DATA.marga.filter((m) => (kab === 'Semua' || m.kab === kab) && (!nq || norm(`${m.nama} ${m.isi}`).includes(nq)));
  }, [kab, q]);

  return (
    <Bab
      id="marga"
      label="Buay & Marga"
      judul={
        <>
          Kebuayan &amp; <span className="teks-emas">Marga</span> Komering
        </>
      }
      deskripsi={
        <>
          <em>Buay</em> berarti keturunan. Dahulu marga dipimpin seorang Pasirah; kini banyak nama kebuayan hidup sebagai nama kecamatan.
        </>
      }
    >
      <Reveal className="mb-8 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kabupaten">
          {KABUPATEN.map((k) => (
            <button key={k} type="button" className="chip" aria-pressed={k === kab} onClick={() => setKab(k)}>
              {k}
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <Search className="absolute left-3.5 top-1/2 size-[1.1rem] -translate-y-1/2 text-emas-400" aria-hidden />
          <label htmlFor="marga-cari" className="sr-only">
            Cari marga
          </label>
          <input id="marga-cari" type="search" className="isian pl-10" placeholder="Cari marga…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </Reveal>

      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {daftar.map((m, i) => (
            <motion.article
              key={m.nama}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.04 } }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="permukaan kartu-motif rounded-[1.15rem] p-5 transition-colors hover:border-emas/50"
            >
              <span className="tag">{m.kab}</span>
              <h3 className="mt-3 font-display text-xl font-bold text-gading">{m.nama}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gading/75">{m.isi}</p>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
      {daftar.length === 0 && <p className="py-10 text-center text-pasir">Marga tidak ditemukan.</p>}
      <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-pasir">
        Data disusun dari nama kebuayan dan wilayah adat yang kini menjadi nama kecamatan. Silakan lengkapi bersama tetua adat setempat.
      </p>
    </Bab>
  );
}
