'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Download, RefreshCw, Share2, Sparkles } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { buatJajuluk, gambarKartu, type Gender, type HasilJajuluk } from '@/lib/jajuluk';
import { DATA } from '@/lib/konten';
import { norm } from '@/lib/teks';
import { useToast } from './providers/ToastProvider';
import { Bab } from './ui/Bab';
import { Reveal } from './ui/Reveal';
import { TombolDengar } from './ui/TombolDengar';

const SIFAT = Object.entries(DATA.jajuluk.sifat);

async function bagikan(teks: string, judul: string, toast: (p: string) => void) {
  if (navigator.share) {
    try {
      await navigator.share({ title: judul, text: teks, url: location.href });
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
}

export function JajulukSection() {
  const toast = useToast();
  const [nama, setNama] = useState('');
  const [gender, setGender] = useState<Gender>('L');
  const [sifat, setSifat] = useState(SIFAT[0][0]);
  const [salt, setSalt] = useState(0);
  const [hasil, setHasil] = useState<(HasilJajuluk & { gender: Gender; sifat: string }) | null>(null);
  const kotakHasil = useRef<HTMLDivElement>(null);
  const namaRef = useRef<HTMLInputElement>(null);

  const kirim = (e: FormEvent) => {
    e.preventDefault();
    const n = nama.trim().replace(/\s+/g, ' ');
    if (!n) {
      toast('Tulis nama panggilanmu dulu, ya!');
      namaRef.current?.focus();
      return;
    }
    setSalt(0);
    setHasil({ ...buatJajuluk(n, gender, sifat, 0), gender, sifat });
    if (window.innerWidth < 1024) setTimeout(() => kotakHasil.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const unduh = async () => {
    if (!hasil) return;
    const css = getComputedStyle(document.documentElement);
    const display = css.getPropertyValue('--font-playfair').trim() || '"Playfair Display"';
    const sans = css.getPropertyValue('--font-jakarta').trim() || '"Plus Jakarta Sans"';
    const blob = await gambarKartu(hasil, display, sans);
    if (!blob) return toast('Gagal membuat kartu.');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `jajuluk-${norm(hasil.nama).replace(/[^a-z0-9]+/g, '-') || 'komering'}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast('Kartu jajuluk diunduh ✓');
  };

  return (
    <Bab
      id="jajuluk"
      nomor="08"
      label="Juluk & Adok"
      judul={
        <>
          Generator <span className="teks-emas">Jajuluk</span>
        </>
      }
      deskripsi={
        <>
          Menurut kamus, <em>jajuluk</em> adalah gelar atau nama panggilan yang diberikan setelah menikah. Bila gelar pengantin laki-laki{' '}
          <strong className="text-emas-200">Mangku Alam</strong>, gelar pengantin perempuannya{' '}
          <strong className="text-emas-200">Nai Mangku Alam</strong>. Ciptakan jajuluk kreasimu!
        </>
      }
    >
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <Reveal as="form" className="permukaan sudut-songket space-y-6 rounded-3xl p-6 sm:p-8">
          <div>
            <label htmlFor="jj-nama" className="mb-2 block text-sm font-bold text-emas-200">
              Nama panggilanmu
            </label>
            <input
              ref={namaRef}
              id="jj-nama"
              className="isian"
              maxLength={24}
              autoComplete="given-name"
              placeholder="contoh: Dimas"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>
          <fieldset>
            <legend className="mb-2 block text-sm font-bold text-emas-200">Jenis kelamin</legend>
            <div className="flex gap-2">
              {([['L', '👦 Laki-laki'], ['P', '👧 Perempuan']] as const).map(([v, label]) => (
                <label key={v}>
                  <input type="radio" name="jj-gender" value={v} className="sr-only" checked={gender === v} onChange={() => setGender(v)} />
                  <span className="chip">{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 block text-sm font-bold text-emas-200">Karakter yang paling menggambarkanmu</legend>
            <div className="flex flex-wrap gap-2">
              {SIFAT.map(([k, s]) => (
                <label key={k}>
                  <input type="radio" name="jj-sifat" value={k} className="sr-only" checked={sifat === k} onChange={() => setSifat(k)} />
                  <span className="chip">
                    {s.ikon} {s.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit" className="btn-emas w-full" onClick={kirim}>
            <Sparkles className="size-[1.1rem]" aria-hidden /> Anugerahkan Jajuluk
          </button>
          <p className="text-xs leading-relaxed text-pasir">
            “Amon niku kahwin rik jolma kumoring bujajuluk” — kalau kamu menikah dengan orang Komering, kamu akan bergelar. Jajuluk di sini
            adalah kreasi untuk edukasi; jajuluk yang sesungguhnya diberikan keluarga dan tetua adat.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div ref={kotakHasil} className="piagam" aria-live="polite">
            <AnimatePresence mode="wait">
              {!hasil ? (
                <motion.div key="kosong" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="eyebrow justify-center">Jajuluk Komering</p>
                  <div className="my-6 text-6xl" aria-hidden>
                    👑
                  </div>
                  <p className="font-display text-2xl text-gading">Jajulukmu akan muncul di sini</p>
                  <p className="mx-auto mt-3 max-w-sm text-sm text-gading/75">
                    Isi nama, pilih karakter, lalu tekan <strong className="text-emas-300">Anugerahkan Jajuluk</strong>.
                  </p>
                </motion.div>
              ) : (
                <motion.div key={`${hasil.judul}-${salt}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="eyebrow justify-center">Jajuluk Komering</p>
                  <p className="mt-5 text-sm text-gading/75">Dianugerahkan kepada</p>
                  <p className="mt-1 font-display text-2xl italic text-gading">{hasil.nama}</p>
                  <motion.h3
                    className="teks-emas mt-5 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-tight"
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)', letterSpacing: '0.2em' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', letterSpacing: '0em' }}
                    transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    {hasil.judul}
                  </motion.h3>
                  <p className="mt-2 text-xs font-semibold text-pasir">{hasil.pasangan}</p>
                  <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-gading/75">
                    {hasil.makna.map((p) => (
                      <li key={p.kata} className="flex gap-2">
                        <span className="text-emas-400">◆</span>
                        <span>
                          <strong className="text-emas-200">{p.kata}</strong> — {p.arti}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mx-auto mt-6 max-w-sm font-display italic text-gading/75">“{hasil.doa}”</p>
                  <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
                    <TombolDengar id="jajuluk" teks={`${hasil.judul}. ${hasil.doa}`} label="Dengarkan jajuluk" kecil={false} />
                    <button
                      type="button"
                      className="btn-kaca btn-kecil"
                      onClick={() => {
                        const s = salt + 1;
                        setSalt(s);
                        setHasil({ ...buatJajuluk(hasil.nama, hasil.gender, hasil.sifat, s), gender: hasil.gender, sifat: hasil.sifat });
                      }}
                    >
                      <RefreshCw className="size-4" aria-hidden /> Acak lagi
                    </button>
                    <button
                      type="button"
                      className="btn-kaca btn-kecil"
                      onClick={() => bagikan(`Jajuluk Komering-ku: ${hasil.judul}! ✨ ${hasil.doa} — buat punyamu di Dang Lupa ko Komering.`, 'Jajuluk Komering', toast)}
                    >
                      <Share2 className="size-4" aria-hidden /> Bagikan
                    </button>
                    <button type="button" className="btn-emas btn-kecil" onClick={unduh}>
                      <Download className="size-4" aria-hidden /> Unduh kartu
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Bab>
  );
}
