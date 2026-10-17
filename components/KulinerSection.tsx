'use client';

import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { DATA, type Hidangan } from '@/lib/konten';
import { artiSingkat } from '@/lib/teks';
import { useKamus } from './providers/KamusProvider';
import { Bab } from './ui/Bab';
import { Reveal } from './ui/Reveal';

/** Tombol kata kamus: "lalak · pedas" → membuka kata itu di kamus */
function TagKosakata({ kata, arti, sebelum }: { kata: string; arti?: string; sebelum?: () => void }) {
  const { kamus, bukaKamus } = useKamus();
  const e = kamus?.cari(kata).find((x) => !x.sensitif);
  if (!e) return null;
  return (
    <button
      type="button"
      className="tag"
      title={e.arti}
      onClick={() => {
        sebelum?.();
        bukaKamus(e.kata);
      }}
    >
      <strong>{e.kata}</strong>&nbsp;· {arti ?? artiSingkat(e.arti, e.kata)}
    </button>
  );
}

function FotoHidangan({ h, tinggi = 'h-52', ukuran }: { h: Hidangan; tinggi?: string; ukuran: string }) {
  return (
    <span className={`foto-hidangan block ${tinggi}`} data-piring={h.piring ? 'true' : undefined} style={{ '--foto': `url('${h.foto}')` } as CSSProperties}>
      {h.piring ? (
        // Foto beresolusi kecil: disajikan sebagai piring bundar berbingkai emas
        <span className="piring-hidangan block transition-transform duration-700 group-hover:scale-105">
          <Image src={h.foto} alt={h.alt} width={600} height={600} sizes="(min-width: 768px) 280px, 60vw" />
        </span>
      ) : (
        <Image src={h.foto} alt={h.alt} fill sizes={ukuran} className="object-cover transition-transform duration-700 group-hover:scale-105" />
      )}
    </span>
  );
}

function DialogHidangan({ indeks, tutup, geser }: { indeks: number | null; tutup: () => void; geser: (n: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const isiRef = useRef<HTMLDivElement>(null);
  const { kamus } = useKamus();
  const buka = indeks !== null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (buka && !d.open) d.showModal();
    if (!buka && d.open) d.close();
  }, [buka]);

  useEffect(() => {
    isiRef.current?.scrollTo({ top: 0 });
  }, [indeks]);

  if (indeks === null) return <dialog ref={ref} className="hidden" />;
  const h = DATA.kuliner[indeks];
  const n = DATA.kuliner.length;
  const prev = DATA.kuliner[(indeks - 1 + n) % n];
  const next = DATA.kuliner[(indeks + 1) % n];
  const entri = h.kamus ? kamus?.id(h.kamus) : undefined;
  const contoh = entri?.contoh[0];

  return (
    <dialog
      ref={ref}
      aria-labelledby="judul-hidangan"
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(46rem,calc(100vw-2rem))] overflow-visible bg-transparent p-0 text-gading backdrop:bg-kayu-950/75 backdrop:backdrop-blur-sm"
      onClose={tutup}
      onClick={(e) => e.target === ref.current && tutup()}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') geser(-1);
        if (e.key === 'ArrowRight') geser(1);
      }}
    >
      <motion.div
        ref={isiRef}
        key={indeks}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        className="permukaan-kuat relative max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-3xl"
      >
        <FotoHidangan h={h} tinggi="h-[clamp(12rem,38vh,20rem)]" ukuran="(min-width: 768px) 46rem, 100vw" />
        <button type="button" className="ikon-btn absolute right-4 top-4 z-10 bg-kayu-950/75" aria-label="Tutup" onClick={tutup} autoFocus>
          <X className="size-5" aria-hidden />
        </button>
        <div className="p-6 sm:p-8">
          <span className="tag">{h.jenis}</span>
          <h3 id="judul-hidangan" className="mt-3 font-display text-3xl font-bold text-gading">
            {h.nama}
          </h3>
          <p className="font-semibold text-emas-300">{h.alias}</p>
          {h.cerita.map((p) => (
            <p key={p.slice(0, 24)} className="mt-4 leading-relaxed text-gading/75">
              {p}
            </p>
          ))}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emas/20 bg-white/[0.03] p-4">
              <p className="eyebrow">Bahan Utama</p>
              <ul className="mt-3 space-y-1.5 text-sm text-gading/75">
                {h.bahan.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-emas-400">◆</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-emas/20 bg-white/[0.03] p-4">
              <p className="eyebrow">Cara Menikmati</p>
              <p className="mt-3 text-sm leading-relaxed text-gading/75">{h.sajian}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-emas/30 bg-gradient-to-br from-emas/15 to-marun-500/15 p-4">
            <p className="eyebrow">Tahukah Kamu?</p>
            <p className="mt-2 text-sm leading-relaxed text-gading/75">{h.fakta}</p>
          </div>

          <p className="eyebrow mt-6">Kosakata di Pawon</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {h.kosakata.map((k) => (
              <TagKosakata key={k} kata={k} sebelum={tutup} />
            ))}
          </div>

          {entri && (
            <div className="mt-6 rounded-2xl border border-emas/20 bg-white/[0.03] p-4">
              <p className="eyebrow">Dari Kamus · {entri.id}</p>
              <p className="mt-2 text-sm leading-relaxed text-gading/75">
                <strong className="text-emas-200">{entri.kata}</strong> — {entri.arti}
              </p>
              {contoh && (
                <p className="mt-2 text-xs italic text-pasir">
                  “{contoh[0]}” — {contoh[1]}
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-between gap-3">
            <button type="button" className="chip" onClick={() => geser(-1)}>
              ← {prev.nama}
            </button>
            <button type="button" className="chip" onClick={() => geser(1)}>
              {next.nama} →
            </button>
          </div>
        </div>
      </motion.div>
    </dialog>
  );
}

export function KulinerSection() {
  const [indeks, setIndeks] = useState<number | null>(null);
  const pemicu = useRef<HTMLElement | null>(null);
  const n = DATA.kuliner.length;

  const tutup = () => {
    setIndeks(null);
    pemicu.current?.focus({ preventScroll: true });
  };

  return (
    <Bab
      id="kuliner"
      label="Bangik Nihan!"
      judul={
        <>
          Kuliner Khas <span className="teks-emas">Tanah Komering</span>
        </>
      }
      deskripsi={
        <>
          Way Komering kaya iwak (ikan), dan pawon (dapur)-nya kaya rasa: asam, pedas, gurih, hingga legit. Ketuk kartu untuk membaca kisah
          tiap hidangan, bahan, cara menikmatinya, dan kosakata dapurnya. Ada pula tradisi <em>katodan</em>: membagi nasi dan lauk pauk
          kepada tetangga.
        </>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {DATA.kuliner.map((h, i) => (
          <Reveal key={h.nama} as="article" delay={(i % 4) * 0.08} className={`group ${i === 0 ? 'sm:col-span-2' : ''}`}>
            <button
              type="button"
              aria-haspopup="dialog"
              className="permukaan flex h-full w-full flex-col overflow-hidden rounded-[1.4rem] text-left transition-[border-color,translate,box-shadow] duration-300 hover:-translate-y-1 hover:border-emas/50 hover:shadow-[0_28px_60px_-22px_rgba(0,0,0,0.9)]"
              onClick={(e) => {
                pemicu.current = e.currentTarget;
                setIndeks(i);
              }}
            >
              <span className="relative block w-full">
                <FotoHidangan h={h} ukuran={i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'} />
                <span className="tag absolute left-3.5 top-3.5 z-10 bg-kayu-950/70 backdrop-blur">{h.jenis}</span>
              </span>
              <span className="flex flex-1 flex-col p-5">
                <span className="font-display text-xl font-bold text-gading">{h.nama}</span>
                <span className="text-sm font-semibold text-emas-300">{h.alias}</span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-gading/75">{h.teaser}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8rem] font-bold text-emas-400">
                  Baca kisahnya <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <Reveal className="permukaan mt-8 rounded-3xl p-6">
        <p className="eyebrow">Penganan Lain di Kamus</p>
        <p className="mt-2 text-sm text-gading/75">Kamus Basa Kumoring juga mencatat kue dan minuman berikut. Ketuk untuk membuka entrinya.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {DATA.penganan.map(([kata, arti]) => (
            <TagKosakata key={kata} kata={kata} arti={arti} />
          ))}
        </div>
      </Reveal>

      <DialogHidangan indeks={indeks} tutup={tutup} geser={(d) => setIndeks((x) => (x === null ? x : (x + d + n) % n))} />
    </Bab>
  );
}
