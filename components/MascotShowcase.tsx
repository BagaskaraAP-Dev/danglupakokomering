'use client';
/* =============================================================================
   Maskot Raka & Ratih di bingkai lengkung bermotif pucuk rebung.
   - GSAP: animasi masuk bergiliran + gerak "bernapas" yang sangat halus.
   - Sentuh/klik Raka: tanpa tulisan apa pun — Raka membesar sedikit dengan cahaya
     emas lalu mengucapkan "Tabik pun!" (suara pria, Web Speech API id-ID).
   - Kartu "Raka & Ratih menyapa": speaker membacakan sapaan beserta artinya;
     kata tersorot satu per satu mengikuti suara, tombol beriak sampai selesai.
   Tidak ada file audio yang dimuat, jadi tidak ada permintaan 404.
   ============================================================================= */
import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { Volume2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DATA } from '@/lib/konten';
import { suara, useSedangBicara } from '@/lib/suara';
import { Avatar } from './ui/Avatar';

gsap.registerPlugin(useGSAP);

const UCAPAN_RAKA = 'Tabik pun!';
/** Titik tengah tubuh Raka di dalam bingkai (persen) — asal skala & pusat cahaya */
const PUSAT_RAKA = '33% 52%';
/** Perkiraan lama satu kata bila suara tidak mengirim event batas kata (ms) */
const MS_PER_KATA = 430;

/* ---------- Kartu sapaan bersuara ---------- */
function KartuSapaan() {
  const diam = useReducedMotion();
  const bicara = useSedangBicara('sapaan');
  const [iSapa, setISapa] = useState(0);
  const [tahan, setTahan] = useState(false);
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

  // Sapaan bergilir selama tidak sedang dibacakan atau di-hover
  useEffect(() => {
    if (diam || tahan || bicara) return;
    const t = setInterval(() => {
      if (!document.hidden) setISapa((i) => (i + 1) % DATA.sapaan.length);
    }, 5500);
    return () => clearInterval(t);
  }, [diam, tahan, bicara]);

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

  const sorot = (j: number) => bicara && j === kataAktif;
  const kata = (daftar: string[], geser: number) =>
    daftar.map((k, j) => (
      <span key={j} className={`rounded transition-colors duration-150 ${sorot(j + geser) ? 'bg-emas/20 text-emas-200' : ''}`}>
        {k}
        {j < daftar.length - 1 ? ' ' : ''}
      </span>
    ));

  return (
    <div
      data-masuk="kartu"
      className="siap-masuk gelembung ekor-atas permukaan-kuat mx-2 mt-7"
      onMouseEnter={() => setTahan(true)}
      onMouseLeave={() => setTahan(false)}
    >
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 -space-x-3">
          <Avatar siapa="raka" />
          <Avatar siapa="ratih" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-emas-400">Raka &amp; Ratih menyapa:</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={iSapa}
              initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35 }}
              aria-live="polite"
            >
              <p className="font-display text-lg italic leading-snug text-gading">{kata(kataKm, 0)}</p>
              <p className="mt-0.5 text-xs text-pasir">({kata(kataId, kataKm.length)})</p>
            </motion.div>
          </AnimatePresence>
        </div>
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
      </div>
    </div>
  );
}

/* ---------- Bingkai maskot ---------- */
export function MascotShowcase() {
  const lingkup = useRef<HTMLDivElement>(null);
  const gambarRef = useRef<HTMLDivElement>(null);
  const diam = useReducedMotion();
  const rakaBicara = useSedangBicara('raka');

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ gerak: '(prefers-reduced-motion: no-preference)', tenang: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      const { gerak } = ctx.conditions as { gerak: boolean };
      if (!gerak) {
        gsap.set('[data-masuk]', { autoAlpha: 1 });
        return;
      }
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('[data-masuk="bingkai"]', { autoAlpha: 0, y: 48, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.1 }, 0.15)
        .fromTo('[data-masuk="kartu"]', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.6')
        .call(() => {
          gsap.to('[data-napas="bingkai"]', { y: -12, scale: 1.012, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        });
    });
  }, { scope: lingkup });

  // Raka disentuh: langsung bersuara, Raka membesar sedikit lalu kembali (asal skala di tubuh Raka)
  const sentuhRaka = () => {
    suara.ucapkan(UCAPAN_RAKA, { id: 'raka', jenis: 'pria', rate: 0.88 });
    const el = gambarRef.current;
    if (diam || !el) return;
    gsap.timeline()
      .to(el, { scale: 1.05, duration: 0.22, ease: 'power2.out', transformOrigin: PUSAT_RAKA, overwrite: 'auto' })
      .to(el, { scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.45)' });
  };

  return (
    <div ref={lingkup} className="relative flex justify-center">
      <div className="cahaya-hero -top-10 left-1/2 -translate-x-1/2" aria-hidden />

      <div className="relative w-full max-w-[25rem]">
        <div data-masuk="bingkai" className="siap-masuk">
          <div data-napas="bingkai" className="bingkai-lengkung">
            <div ref={gambarRef} className="lapis-maskot">
              <Image
                src="/maskot-pasangan-hero.jpg"
                alt="Maskot Raka dan Ratih mengenakan busana adat pengantin Komering berwarna merah marun dan emas"
                fill
                priority
                sizes="(min-width: 1024px) 400px, 90vw"
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
        </div>

        <KartuSapaan />
      </div>
    </div>
  );
}
