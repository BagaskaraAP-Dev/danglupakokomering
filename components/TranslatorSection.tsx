'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeftRight, Copy, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DATA } from '@/lib/konten';
import { LABEL_BAHASA, type Bahasa, type HasilTerjemahan, type Segmen } from '@/lib/penerjemah';
import { fmtAngka, glosa, norm } from '@/lib/teks';
import { useKamus } from './providers/KamusProvider';
import { useToast } from './providers/ToastProvider';
import { Bab } from './ui/Bab';
import { Reveal } from './ui/Reveal';
import { TombolDengar } from './ui/TombolDengar';

const MAKS = 400;
const CATATAN: Record<Segmen['type'], string> = {
  exact: 'cocok di kamus',
  same: 'kata sama/serapan',
  korpus: 'dipelajari dari korpus',
  stem: 'dari kata dasar',
  fuzzy: 'koreksi ejaan',
  unknown: 'belum dikenal',
  punct: '',
};
const LEGENDA = [
  { warna: '#8FB58A', label: 'Cocok di kamus' },
  { warna: '#D98B66', label: 'Dipelajari dari korpus' },
  { warna: '#C9B78C', label: 'Dari kata dasar' },
  { warna: '#E5C158', label: 'Koreksi ejaan' },
  { warna: 'rgba(253,251,247,.3)', label: 'Belum dikenal' },
];

const potong = (t: string, n = 26) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);

async function salin(teks: string) {
  try {
    await navigator.clipboard.writeText(teks);
    return true;
  } catch {
    return false;
  }
}

function KataHariIni() {
  const { kamus, bukaKamus } = useKamus();
  const entri = useMemo(() => {
    if (!kamus) return null;
    const pool = kamus.layakAcak.filter((e) => {
      const g = glosa(e.arti)[0];
      return ['n', 'v', 'a'].includes(e.kelas) && g && g.split(' ').length <= 3 && g !== norm(e.kata);
    });
    if (!pool.length) return null;
    const now = new Date();
    const hari = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    return pool[hari % pool.length];
  }, [kamus]);

  return (
    <div className="permukaan rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">Kata Hari Ini</p>
        {entri && <TombolDengar id="kata-hari-ini" teks={`${entri.kata}. ${entri.contoh[0][0]}`} label="Dengarkan kata hari ini" />}
      </div>
      {entri ? (
        <>
          <button type="button" className="mt-3 font-display text-3xl font-bold text-emas-300 hover:underline" title="Buka di kamus" onClick={() => bukaKamus(entri.kata)}>
            {entri.kata}
          </button>
          <p className="mt-1 text-sm text-gading/75">Artinya: {entri.arti}</p>
          <p className="mt-3 text-sm italic text-pasir">
            “{entri.contoh[0][0]}” — {entri.contoh[0][1]}
          </p>
        </>
      ) : (
        <div className="mt-4 space-y-2" aria-hidden>
          <div className="h-8 w-32 animate-pulse rounded-lg bg-white/5" />
          <div className="h-4 w-48 animate-pulse rounded bg-white/5" />
        </div>
      )}
    </div>
  );
}

function SegmenTerjemahan({ s, i, dari }: { s: Segmen; i: number; dari: Bahasa }) {
  const { bukaKamus } = useKamus();
  let hint = CATATAN[s.type];
  if (s.type === 'fuzzy') hint = `maksudmu “${s.base}”?`;
  else if (s.type === 'stem' && s.base) hint = `dasar: ${s.base}`;
  else if (s.ref && dari === 'km' && norm(s.ref.arti) !== norm(s.out)) hint = potong(s.ref.arti);
  else if (s.ref) hint = s.ref.id;
  const isi = (
    <>
      <small>{s.src}</small>
      <b>{s.out}</b>
      <small>{hint}</small>
    </>
  );
  const animasi = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.04 } };
  return s.ref ? (
    <motion.button
      {...animasi}
      type="button"
      className="seg"
      data-jenis={s.type}
      title={`${s.ref.kata} — ${s.ref.arti} (${s.ref.id}). Klik untuk buka di kamus.`}
      onClick={() => s.ref && bukaKamus(s.ref.kata)}
    >
      {isi}
    </motion.button>
  ) : (
    <motion.span {...animasi} className="seg" data-jenis={s.type} title={CATATAN[s.type]}>
      {isi}
    </motion.span>
  );
}

export function TranslatorSection() {
  const { penerjemah, meta, status } = useKamus();
  const toast = useToast();
  const diam = useReducedMotion();
  const [dari, setDari] = useState<Bahasa>('id');
  const [teks, setTeks] = useState('');
  const [hasil, setHasil] = useState<HasilTerjemahan | null>(null);
  const [berpikir, setBerpikir] = useState(false);
  const [putaran, setPutaran] = useState(0);
  const tunda = useRef<ReturnType<typeof setTimeout>>(undefined);
  const terakhir = useRef('');
  const ke: Bahasa = dari === 'id' ? 'km' : 'id';

  const jalankan = (isi: string, arah: Bahasa, denganJeda: boolean) => {
    clearTimeout(tunda.current);
    const t = isi.trim();
    terakhir.current = `${arah}|${t}`;
    if (!t || !penerjemah) {
      setHasil(null);
      setBerpikir(false);
      return;
    }
    if (!denganJeda || diam) {
      setBerpikir(false);
      setHasil(penerjemah.translate(t, arah));
      return;
    }
    setBerpikir(true);
    tunda.current = setTimeout(() => {
      setBerpikir(false);
      setHasil(penerjemah.translate(t, arah));
    }, 450);
  };

  // Terjemahan langsung saat mengetik (jeda 300 ms)
  useEffect(() => {
    if (!penerjemah || terakhir.current === `${dari}|${teks.trim()}`) return;
    const t = setTimeout(() => jalankan(teks, dari, false), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teks, dari, penerjemah]);

  const tukar = () => {
    setPutaran((p) => p + 180);
    const lama = hasil?.text ?? '';
    setDari(ke);
    if (lama) setTeks(lama);
  };

  const pct = Math.round((hasil?.conf ?? 0) * 100);

  return (
    <Bab
      id="penerjemah"
      label="Ratih Menerjemahkan"
      pita
      judul={
        <>
          AI Penerjemah <span className="teks-emas">Basa Kumoring</span>
        </>
      }
      deskripsi={
        <>
          Ketik kalimat Bahasa Indonesia atau Basa Kumoring. Mesin NLP lokal belajar dari{' '}
          <strong className="text-emas-200">{fmtAngka(meta.jumlahKata)} kata</strong> dan{' '}
          <strong className="text-emas-200">{fmtAngka(meta.jumlahContoh)} contoh kalimat</strong> Kamus Basa Kumoring, mengenali
          imbuhan, memperbaiki salah ketik, lalu membacakan hasilnya.
        </>
      }
    >
      <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal as="aside" className="order-2 space-y-5 lg:order-1">
          <div className="bingkai-persegi mx-auto max-w-sm lg:max-w-none">
            <Image
              src="/maskot-ratih-penerjemah.jpg"
              alt="Maskot Ratih berhijab merah dengan mahkota emas, menunjuk ke arah penerjemah"
              width={1200}
              height={896}
              sizes="(min-width: 1024px) 30vw, 90vw"
            />
          </div>
          <div className="gelembung ekor-atas permukaan-kuat">
            <p className="text-sm leading-relaxed text-gading/75">
              <strong className="text-emas-300">Ratih:</strong> “Tabik! Nyak Ratih. Coba ketik <em>‘Saya mau makan’</em>, nanti nyak
              terjemahkan jadi <em className="text-emas-200">‘Nyak haga mongan’</em>.”
            </p>
          </div>
          <KataHariIni />
        </Reveal>

        <Reveal className="permukaan sudut-songket order-1 rounded-3xl p-5 sm:p-7 lg:order-2" delay={0.1}>
          <div className="flex items-center gap-3">
            <div className="pil-bahasa" data-km={dari === 'km'}>
              {LABEL_BAHASA[dari]}
            </div>
            <motion.button
              type="button"
              className="ikon-btn"
              aria-label="Tukar arah terjemahan"
              animate={{ rotate: putaran }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              onClick={tukar}
            >
              <ArrowLeftRight className="size-5" aria-hidden />
            </motion.button>
            <div className="pil-bahasa" data-km={ke === 'km'}>
              {LABEL_BAHASA[ke]}
            </div>
          </div>

          <label htmlFor="tr-masukan" className="sr-only">
            Teks yang akan diterjemahkan
          </label>
          <textarea
            id="tr-masukan"
            className="isian mt-4"
            rows={3}
            maxLength={MAKS}
            value={teks}
            placeholder={dari === 'id' ? 'Ketik kalimat… contoh: Saya mau makan ikan' : 'Ketik Basa Kumoring… contoh: Nyak haga mongan'}
            onChange={(e) => setTeks(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                jalankan(teks, dari, true);
              }
            }}
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xs text-pasir">
              {teks.length}/{MAKS}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-kaca btn-kecil"
                onClick={() => {
                  setTeks('');
                  setHasil(null);
                  document.getElementById('tr-masukan')?.focus();
                }}
              >
                Hapus
              </button>
              <button type="button" className="btn-emas btn-kecil" disabled={status !== 'siap'} onClick={() => jalankan(teks, dari, true)}>
                <Sparkles className="size-4" aria-hidden /> {status === 'memuat' ? 'Memuat kamus…' : 'Terjemahkan'}
              </button>
            </div>
          </div>

          <div className="hasil-terjemahan mt-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-emas-400">Hasil · {LABEL_BAHASA[ke]}</p>
                <div aria-live="polite" className="min-h-[2.2rem]">
                  {berpikir ? (
                    <span className="berpikir" aria-label="Sedang menerjemahkan">
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : hasil?.text ? (
                    <p className="break-words font-display text-[1.3rem] font-semibold leading-snug text-gading sm:text-[1.45rem]">{hasil.text}</p>
                  ) : (
                    <p className="font-display text-lg italic text-pasir">
                      {status === 'gagal' ? 'Kamus gagal dimuat. Muat ulang halaman.' : 'Hasil terjemahan akan muncul di sini.'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <TombolDengar id="hasil-terjemahan" teks={hasil?.text ?? ''} label="Dengarkan hasil terjemahan" kecil={false} rate={dari === 'id' ? 0.85 : 0.95} />
                <button
                  type="button"
                  className="ikon-btn"
                  aria-label="Salin hasil terjemahan"
                  onClick={async () => {
                    if (!hasil?.text) return toast('Belum ada hasil untuk disalin.');
                    toast((await salin(hasil.text)) ? 'Tersalin ke clipboard ✓' : 'Gagal menyalin — salin manual, ya.');
                  }}
                >
                  <Copy className="size-[1.1rem]" aria-hidden />
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="shrink-0 text-xs font-semibold text-pasir">Keyakinan AI</span>
              <div className="meter flex-1">
                <span style={{ width: `${hasil ? pct : 0}%` }} />
              </div>
              <span className="w-10 text-right text-xs font-bold text-emas-300">{hasil ? `${pct}%` : '—'}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <AnimatePresence>
                {!berpikir &&
                  hasil?.segs.filter((s) => s.type !== 'punct').map((s, i) => <SegmenTerjemahan key={`${s.src}-${i}`} s={s} i={i} dari={dari} />)}
              </AnimatePresence>
            </div>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.72rem] text-pasir">
              {LEGENDA.map((l) => (
                <span key={l.label}>
                  <i className="titik-legenda" style={{ background: l.warna }} />
                  {l.label}
                </span>
              ))}
            </p>
          </div>

          <div className="mt-6">
            <p className="mb-2.5 text-xs font-semibold text-pasir">Coba contoh kalimat:</p>
            <div className="flex flex-wrap gap-2">
              {DATA.contohKalimat[dari].map((k) => (
                <button
                  key={k}
                  type="button"
                  className="chip"
                  onClick={() => {
                    setTeks(k);
                    jalankan(k, dari, true);
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Bab>
  );
}
