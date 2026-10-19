'use client';
/* =============================================================================
   Maskot Raka & Ratih di bingkai lengkung bermotif pucuk rebung.
   - Tampil langsung (tanpa menunggu JS); tidak ada gerak berulang tanpa pemicu.
   - Sentuh/klik Raka: Raka membesar sedikit (Web Animations API) lalu mengucapkan
     "Tabik pun!" (suara pria, Web Speech API id-ID). Tanpa tulisan apa pun di atas maskot.
   - Kartu "Raka & Ratih menyapa": speaker membacakan sapaan beserta artinya; kata
     tersorot mengikuti suara. Sapaan berganti hanya lewat tombol "berikutnya".
   ============================================================================= */
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, Volume2 } from 'lucide-react';
import Image from 'next/image';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { DATA } from '@/lib/konten';
import { suara, useSedangBicara } from '@/lib/suara';
import { Avatar } from './ui/Avatar';

const UCAPAN_RAKA = 'Tabik pun!';
/** Titik tengah tubuh Raka di dalam bingkai (persen) — asal skala saat disentuh */
const PUSAT_RAKA = '33% 52%';
/** Perkiraan lama satu kata bila suara tidak mengirim event batas kata (ms) */
const MS_PER_KATA = 430;

/* ---------- Kartu sapaan bersuara ---------- */
function KartuSapaan() {
  const bicara = useSedangBicara('sapaan');
  const [iSapa, setISapa] = useState(0);
  const [kataAktif, setKataAktif] = useState(-1);
  const cadangan = useRef<ReturnType<typeof setInterval>>(undefined);

  const sapaan = DATA.sapaan[iSapa];
  const kataKm = sapaan.km.split(' ');
  const kataId = sapaan.id.split(' ');
  const ucapan = `${sapaan.km} ${sapaan.id}`;
  /* Indeks karakter awal tiap kata di dalam ucapan (untuk event onboundary) */
  const awalKata = useMemo(() => {
    const posisi: number[] = [];
    let i = 0;
    ucapan.split(' ').forEach((k) => {
      posisi.push(ucapan.indexOf(k, i));
      i = posisi[posisi.length - 1] + k.length;
    });
    return posisi;
  }, [ucapan]);

  useEffect(() => () => clearInterval(cadangan.current), []);

  const putar = () => {
    if (bicara) {
      suara.berhenti();
      return;
    }
    clearInterval(cadangan.current);
    let adaBatas = false;
    const jumlah = awalKata.length;
    suara.ucapkan(ucapan, {
      id: 'sapaan',
      rate: 0.9,
      mulai: () => {
        setKataAktif(0);
        // Cadangan bila suara tidak mengirim batas kata: sorot sesuai perkiraan durasi
        cadangan.current = setInterval(() => {
          if (!adaBatas) setKataAktif((k) => Math.min(k + 1, jumlah - 1));
        }, MS_PER_KATA);
      },
      batas: (ci) => {
        adaBatas = true;
        clearInterval(cadangan.current);
        let k = 0;
        while (k + 1 < jumlah && awalKata[k + 1] <= ci) k++;
        setKataAktif(k);
      },
      selesai: () => {
        clearInterval(cadangan.current);
        setKataAktif(-1);
      },
    });
  };

  const berikutnya = () => {
    if (bicara) suara.berhenti();
    setISapa((i) => (i + 1) % DATA.sapaan.length);
  };

  const sorot = (j: number) => bicara && j === kataAktif;
  const kata = (daftar: string[], geser: number) =>
    daftar.map((k, j) => (
      // nowrap: kata ulang seperti "jama-jama" tidak terpotong di tanda hubung; spasi di luar span tetap jadi titik lipat baris
      <Fragment key={j}>
        <span className={`whitespace-nowrap rounded transition-colors duration-150 ${sorot(j + geser) ? 'bg-emas/20 text-emas-200' : ''}`}>{k}</span>
        {j < daftar.length - 1 ? ' ' : ''}
      </Fragment>
    ));

  return (
    <div className="gelembung ekor-atas permukaan-kuat mx-2 mt-7">
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 -space-x-3">
          <Avatar siapa="raka" />
          <Avatar siapa="ratih" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-emas-400">Raka &amp; Ratih menyapa:</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={iSapa}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              aria-live="polite"
            >
              <p className="font-display text-lg italic leading-snug text-gading">{kata(kataKm, 0)}</p>
              <p className="mt-0.5 text-xs text-pasir">({kata(kataId, kataKm.length)})</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex shrink-0 flex-col gap-1.5">
          <button
            type="button"
            className="ikon-btn kecil relative"
            data-bicara={bicara}
            aria-label={bicara ? 'Hentikan sapaan' : `Dengarkan sapaan: ${sapaan.km}`}
            onClick={putar}
          >
            {bicara &&
              [0, 1, 2].map((n) => (
                <motion.span
                  key={n}
                  className="riak-suara"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 2.1, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: n * 0.5, ease: 'easeOut' }}
                  aria-hidden
                />
              ))}
            <Volume2 className="relative size-[1.05rem]" aria-hidden />
          </button>
          <button type="button" className="ikon-btn kecil" aria-label="Sapaan berikutnya" onClick={berikutnya}>
            <ChevronRight className="size-[1.05rem]" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Bingkai maskot ---------- */
export function MascotShowcase() {
  const gambarRef = useRef<HTMLDivElement>(null);
  const diam = useReducedMotion();
  const rakaBicara = useSedangBicara('raka');

  // Raka disentuh: langsung bersuara, lalu membesar sedikit dan memantul kembali
  const sentuhRaka = () => {
    suara.ucapkan(UCAPAN_RAKA, { id: 'raka', jenis: 'pria', rate: 0.88 });
    const el = gambarRef.current;
    if (diam || !el) return;
    el.style.transformOrigin = PUSAT_RAKA;
    el.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.05)', offset: 0.2 },
        { transform: 'scale(0.985)', offset: 0.5 },
        { transform: 'scale(1.01)', offset: 0.72 },
        { transform: 'scale(1)' },
      ],
      { duration: 1000, easing: 'ease-out' },
    );
  };

  return (
    <div className="relative mx-auto w-full max-w-[25rem]">
      {/* Di HP bingkai sedikit lebih kecil agar maskot muat di layar pertama */}
      <div className="bingkai-lengkung mx-auto w-[min(17rem,72vw)] sm:w-full">
        <div ref={gambarRef} className="lapis-maskot">
          <Image
            src="/maskot-pasangan-hero.jpg"
            alt="Maskot Raka dan Ratih mengenakan busana adat pengantin Komering berwarna merah marun dan emas"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 400px, 72vw"
          />
        </div>
        {/* Cahaya emas di tubuh Raka selama ia berbicara */}
        <span className="cahaya-raka" data-aktif={rakaBicara} aria-hidden />
        {/* Area sentuh transparan tepat di tubuh Raka (sisi kiri bingkai) */}
        <button
          type="button"
          className="sentuh-raka"
          data-bicara={rakaBicara}
          aria-label="Sentuh Raka untuk mendengar sapaan Tabik pun"
          onClick={sentuhRaka}
        />
      </div>

      <KartuSapaan />
    </div>
  );
}
