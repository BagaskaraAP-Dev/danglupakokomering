'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, RefreshCw, Share2 } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { buatPutaran, JUMLAH_SOAL, peringkat, type Soal } from '@/lib/kuis';
import { fmtAngka } from '@/lib/teks';
import { useKamus } from '../providers/KamusProvider';
import { useToast } from '../providers/ToastProvider';
import { Bab } from '../ui/Bab';
import { Mahkota } from '../ui/Mahkota';
import { Reveal } from '../ui/Reveal';

const KUNCI_TERBAIK = 'dlk-kuis-terbaik';
const EVENT_TERBAIK = 'dlk-kuis-terbaik';

function bacaTerbaik(): number | null {
  try {
    const v = localStorage.getItem(KUNCI_TERBAIK);
    return v === null ? null : Number(JSON.parse(v));
  } catch {
    return null;
  }
}
function simpanTerbaik(n: number) {
  try {
    localStorage.setItem(KUNCI_TERBAIK, JSON.stringify(n));
  } catch {
    /* penyimpanan tidak tersedia */
  }
  window.dispatchEvent(new Event(EVENT_TERBAIK));
}
function langgananTerbaik(f: () => void) {
  window.addEventListener('storage', f);
  window.addEventListener(EVENT_TERBAIK, f);
  return () => {
    window.removeEventListener('storage', f);
    window.removeEventListener(EVENT_TERBAIK, f);
  };
}

type Tahap = 'mulai' | 'soal' | 'selesai';

export function KuisSection() {
  const { kamus, meta } = useKamus();
  const toast = useToast();
  const [tahap, setTahap] = useState<Tahap>('mulai');
  const [soal, setSoal] = useState<Soal[]>([]);
  const [idx, setIdx] = useState(0);
  const [skor, setSkor] = useState(0);
  const [pilihan, setPilihan] = useState<number | null>(null);
  const terbaik = useSyncExternalStore(langgananTerbaik, bacaTerbaik, () => null);
  const lanjutRef = useRef<HTMLButtonElement>(null);
  const opsiRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (pilihan !== null) lanjutRef.current?.focus({ preventScroll: true });
    else if (tahap === 'soal') opsiRef.current?.focus({ preventScroll: true });
  }, [pilihan, tahap, idx]);

  const mulai = () => {
    setSoal(buatPutaran(kamus));
    setIdx(0);
    setSkor(0);
    setPilihan(null);
    setTahap('soal');
  };

  const jawab = (i: number) => {
    if (pilihan !== null) return;
    setPilihan(i);
    if (soal[idx].opsi[i].benar) setSkor((s) => s + 1);
  };

  const lanjut = () => {
    if (idx + 1 < JUMLAH_SOAL) {
      setIdx(idx + 1);
      setPilihan(null);
      return;
    }
    simpanTerbaik(Math.max(skor, terbaik ?? 0));
    setTahap('selesai');
  };

  const q = soal[idx];
  const benar = q && pilihan !== null ? q.opsi[pilihan].benar : false;
  const p = peringkat(skor);

  return (
    <Bab
      id="kuis"
      tata="tengah"
      pita
      judul={
        <>
          Kuis <span className="teks-emas">Ulun Kumoring</span>
        </>
      }
      deskripsi="Sepuluh pertanyaan acak tentang bahasa, sejarah, dan budaya Komering. Seberapa Komering dirimu?"
    >
      <Reveal className="permukaan-kuat sudut-songket mx-auto max-w-2xl rounded-3xl p-6 sm:p-9">
        <div aria-live="polite">
          <AnimatePresence mode="wait">
            {tahap === 'mulai' && (
              <motion.div key="mulai" className="text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Mahkota className="mx-auto h-14 w-auto" />
                <h3 className="mt-5 font-display text-3xl font-bold text-gading">Siap diuji, Sanak?</h3>
                <p className="mt-3 text-gading/75">
                  {JUMLAH_SOAL} soal acak: budaya Komering, ditambah kosakata yang diambil langsung dari {fmtAngka(meta.jumlahKata)} kata kamus.
                  Tiap jawaban disertai penjelasan.
                </p>
                {terbaik !== null && (
                  <p className="mt-4 text-sm font-semibold text-emas-300">
                    Skor terbaikmu: {terbaik}/{JUMLAH_SOAL}
                  </p>
                )}
                <button type="button" className="btn-emas mt-8" onClick={mulai}>
                  Mulai Kuis <ArrowRight className="size-[1.1rem]" aria-hidden />
                </button>
              </motion.div>
            )}

            {tahap === 'soal' && q && (
              <motion.div key={`soal-${idx}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <div className="mb-3 flex items-center justify-between text-xs font-bold">
                  <span className="tracking-widest text-emas-400">
                    SOAL {idx + 1} / {JUMLAH_SOAL} <span className="tag ml-2 tracking-normal">{q.jenis}</span>
                  </span>
                  <span className="text-pasir">Skor: {skor}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.span
                    className="block h-full bg-gradient-to-r from-emas to-emas-300"
                    initial={false}
                    animate={{ width: `${((idx + (pilihan !== null ? 1 : 0)) / JUMLAH_SOAL) * 100}%` }}
                  />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold leading-snug text-gading">{q.q}</h3>
                <div className="mt-6 grid gap-3">
                  {q.opsi.map((o, i) => {
                    const hasilOpsi = pilihan === null ? undefined : o.benar ? 'benar' : i === pilihan ? 'salah' : undefined;
                    return (
                      <motion.button
                        key={o.t}
                        ref={i === 0 ? opsiRef : undefined}
                        type="button"
                        className="opsi-kuis"
                        data-hasil={hasilOpsi}
                        disabled={pilihan !== null}
                        whileHover={pilihan === null ? { x: 3 } : undefined}
                        animate={hasilOpsi === 'salah' ? { x: [0, -6, 6, -4, 0] } : undefined}
                        transition={{ duration: 0.35 }}
                        onClick={() => jawab(i)}
                      >
                        <span className="kunci">{'ABCD'[i]}</span>
                        <span>{o.t}</span>
                      </motion.button>
                    );
                  })}
                </div>
                {pilihan !== null && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                    <div className={`rounded-2xl border p-4 ${benar ? 'border-daun/40 bg-daun/10' : 'border-[#e8857a]/35 bg-[#e8857a]/10'}`}>
                      <p className={`font-bold ${benar ? 'text-daun' : 'text-[#f0a89e]'}`}>{benar ? '✓ Holau nihan! Benar.' : '✗ Belum tepat.'}</p>
                      <p className="mt-1 text-sm text-gading/75">{q.info}</p>
                    </div>
                    <div className="mt-4 text-right">
                      <button ref={lanjutRef} type="button" className="btn-emas btn-kecil" onClick={lanjut}>
                        {idx + 1 < JUMLAH_SOAL ? 'Soal berikutnya' : 'Lihat hasil'} <ArrowRight className="size-4" aria-hidden />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {tahap === 'selesai' && (
              <motion.div key="selesai" className="text-center" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <div className="cincin-skor mx-auto" style={{ ['--p' as string]: (skor / JUMLAH_SOAL) * 100 }}>
                  <div>
                    <span className="font-display text-4xl font-extrabold text-emas-300">
                      {skor}/{JUMLAH_SOAL}
                    </span>
                  </div>
                </div>
                <h3 className="teks-emas mt-6 font-display text-3xl font-bold">{p.gelar}</h3>
                <p className="mt-3 text-gading/75">{p.pesan}</p>
                <p className="mt-2 text-sm text-pasir">
                  Skor terbaik: {terbaik}/{JUMLAH_SOAL}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button type="button" className="btn-emas" onClick={mulai}>
                    <RefreshCw className="size-[1.1rem]" aria-hidden /> Main lagi
                  </button>
                  <button
                    type="button"
                    className="btn-kaca"
                    onClick={async () => {
                      const teks = `Aku meraih ${skor}/${JUMLAH_SOAL} di Kuis Ulun Kumoring — gelar "${p.gelar}"! Dang lupa ko Komering.`;
                      if (navigator.share) {
                        try {
                          await navigator.share({ title: 'Kuis Ulun Kumoring', text: teks, url: location.href });
                        } catch {
                          /* dibatalkan */
                        }
                        return;
                      }
                      try {
                        await navigator.clipboard.writeText(teks);
                        toast('Tersalin ke clipboard ✓');
                      } catch {
                        toast('Gagal menyalin — salin manual, ya.');
                      }
                    }}
                  >
                    <Share2 className="size-[1.1rem]" aria-hidden /> Bagikan skor
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </Bab>
  );
}
