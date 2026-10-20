'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Dices, Search } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import type { Entri, Kamus } from '@/lib/kamus';
import { DATA } from '@/lib/konten';
import { urlKata } from '@/lib/tautan';
import { fmtAngka, glosa, norm, pick } from '@/lib/teks';
import { useKamus } from '../providers/KamusProvider';
import { PemuatKamus } from '../ui/PemuatKamus';
import { Reveal } from '../ui/Reveal';
import { TombolDengar } from '../ui/TombolDengar';

const PER_HALAMAN = 12;

/* Peringkat: kata persis > arti persis > awalan kata > kata dalam arti > … > contoh kalimat */
function skor(e: Entri, q: string): number {
  const w = norm(e.kata);
  if (w === q || e.varian.some((v) => norm(v) === q)) return 100;
  if (glosa(e.arti).includes(q)) return 80;
  if (w.startsWith(q)) return 60;
  const arti = ` ${norm(e.arti)} `;
  if (arti.includes(` ${q} `)) return 45;
  if (w.includes(q)) return 30;
  if (arti.includes(q)) return 20;
  if (e.contoh.some(([k, i]) => norm(`${k} ${i}`).includes(q))) return 5;
  return 0;
}

function saring(kamus: Kamus, query: string, kelas: string, dasarSaja: boolean): Entri[] {
  const q = norm(query);
  const daftar = kamus.entri.filter((e) => (kelas === 'semua' || e.kelas === kelas) && (!dasarSaja || !e.induk));
  if (!q) return daftar;
  // Skor sama → kata yang lebih sering dipakai di korpus didahulukan
  return daftar
    .map((e) => [skor(e, q) - (e.induk ? 1 : 0), kamus.frek.get(norm(e.kata)) ?? 0, e] as const)
    .filter(([s]) => s > 0)
    .sort((a, b) => b[0] - a[0] || b[1] - a[1])
    .map(([, , e]) => e);
}

function KartuKata({ e, kamus }: { e: Entri; kamus: Kamus }) {
  const { bukaKamus } = useKamus();
  const anak = e.induk ? [] : kamus.turunanDari(e.kata);
  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="permukaan kartu-motif rounded-2xl p-4 transition-colors hover:border-emas/45"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={urlKata(e.kata)} className="break-words font-display text-xl font-bold text-emas-300 hover:underline" title={`Buka halaman kata “${e.kata}”`}>
            {e.kata}
          </Link>
          <p className="mt-0.5 text-sm text-gading/75">{e.arti}</p>
        </div>
        <TombolDengar id={`kamus-${e.id}`} teks={e.kata} label={`Dengarkan ${e.kata}`} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="tag">{DATA.kelasKata[e.kelas] ?? DATA.kelasKata['']}</span>
        {e.induk && (
          <button type="button" className="tag" onClick={() => bukaKamus(e.induk)}>
            turunan dari {e.induk}
          </button>
        )}
        {e.varian.length > 0 && <span className="tag tag-lembut">varian: {e.varian.join(', ')}</span>}
        {e.catatan && (
          <span className="tag tag-dugaan cursor-help" title={e.catatan}>
            arti dugaan
          </span>
        )}
        {e.lihat && (
          <button type="button" className="tag" onClick={() => bukaKamus(e.lihat)}>
            lihat: {e.lihat}
          </button>
        )}
      </div>
      {e.contoh.length > 0 && (
        <div className="mt-3 border-t border-emas/15 pt-2 text-xs text-pasir">
          {e.contoh.slice(0, 2).map(([k, i]) => (
            <p key={k} className="mt-1.5">
              <span className="italic">“{k}”</span>
              <br />
              {i}
            </p>
          ))}
        </div>
      )}
      {anak.length > 0 && (
        <details className="turunan mt-3">
          <summary>{anak.length} kata turunan</summary>
          <ul>
            {anak.map((t) => (
              <li key={t.id}>
                <button type="button" onClick={() => bukaKamus(t.kata)}>
                  {t.kata}
                </button>{' '}
                — {t.arti}
              </li>
            ))}
          </ul>
        </details>
      )}
      <p className="mt-3 text-[0.65rem] font-semibold tracking-wider text-pasir/80 tabular-nums">{e.id}</p>
    </motion.article>
  );
}

export function KamusSection() {
  const { kamus, meta, permintaan, status, muat } = useKamus();
  const [query, setQuery] = useState('');
  const [kelas, setKelas] = useState('semua');
  const [dasarSaja, setDasarSaja] = useState(false);
  const [tampil, setTampil] = useState(PER_HALAMAN);
  const q = useDeferredValue(query);
  // Pemuat partikel tetap tampil sebentar setelah kamus siap, selama butirnya memencar
  const [pemuatHilang, setPemuatHilang] = useState(false);
  const sembunyikanPemuat = useCallback(() => setPemuatHilang(true), []);
  const pemuatTampil = status === 'memuat' || (status === 'siap' && !pemuatHilang);

  // Permintaan dari tombol kata di bagian lain (penerjemah, kuliner, chatbot, …)
  const [permintaanTerakhir, setPermintaanTerakhir] = useState(0);
  if (permintaan && permintaan.n !== permintaanTerakhir) {
    setPermintaanTerakhir(permintaan.n);
    setQuery(permintaan.kata);
    setKelas('semua');
    setTampil(PER_HALAMAN);
  }

  const hasil = useMemo(() => (kamus ? saring(kamus, q, kelas, dasarSaja) : []), [kamus, q, kelas, dasarSaja]);

  const jumlahKelas = useMemo(() => {
    const n: Record<string, number> = {};
    kamus?.entri.forEach((e) => {
      n[e.kelas] = (n[e.kelas] ?? 0) + 1;
    });
    return n;
  }, [kamus]);
  const urutanKelas = ['semua', ...Object.keys(DATA.kelasKata).filter((k) => jumlahKelas[k])];
  const ubah = (f: () => void) => {
    f();
    setTampil(PER_HALAMAN);
  };

  return (
    <section id="kamus" className="pita-songket relative pb-20 pt-4 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="penanda-bab">Kamus Basa Kumoring</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-gading sm:text-3xl">{fmtAngka(meta.jumlahKata)} Kata, Lengkap dengan Contoh</h2>
            <p className="mt-2 text-sm text-gading/75">
              {fmtAngka(meta.jumlahKataDasar)} kata dasar &amp; {fmtAngka(meta.jumlahTurunan)} kata turunan — cari dalam Bahasa Indonesia atau Komering.
            </p>
          </div>
          <div className="relative md:w-80">
            <Search className="absolute left-3.5 top-1/2 size-[1.1rem] -translate-y-1/2 text-emas-400" aria-hidden />
            <label htmlFor="kamus-cari" className="sr-only">
              Cari kata
            </label>
            <input
              id="kamus-cari"
              type="search"
              className="isian pl-10"
              placeholder="Cari: makan, lombahan, rumah…"
              autoComplete="off"
              value={query}
              onFocus={muat}
              onChange={(e) => ubah(() => setQuery(e.target.value))}
            />
          </div>
        </Reveal>

        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter kelas kata">
          {urutanKelas.map((k) => (
            <button key={k} type="button" className="chip" aria-pressed={kelas === k} onClick={() => ubah(() => setKelas(k))}>
              {k === 'semua' ? 'Semua' : DATA.kelasKata[k]}{' '}
              <span className="opacity-60">{fmtAngka(k === 'semua' ? kamus?.entri.length : jumlahKelas[k])}</span>
            </button>
          ))}
          <button type="button" className="chip" aria-pressed={dasarSaja} onClick={() => ubah(() => setDasarSaja((d) => !d))}>
            Kata dasar saja
          </button>
          <button
            type="button"
            className="chip"
            disabled={!kamus}
            onClick={() => kamus && ubah(() => {
              setKelas('semua');
              setQuery(pick(kamus.layakAcak).kata);
            })}
          >
            <Dices className="size-4" aria-hidden /> Kata acak
          </button>
        </div>

        <p className="mb-4 text-xs font-semibold text-pasir" aria-live="polite">
          {status === 'memuat' ? (
            <span className="tunda-muncul">Memuat kamus…</span>
          ) : status === 'gagal'
              ? 'Kamus gagal dimuat. Muat ulang halaman.'
              : q.trim()
                ? `${fmtAngka(hasil.length)} hasil untuk “${q.trim()}”`
                : `Menampilkan ${fmtAngka(Math.min(tampil, hasil.length))} dari ${fmtAngka(hasil.length)} kata`}
        </p>

        <div className={`relative ${status === 'memuat' ? 'min-h-56 sm:min-h-64' : ''}`}>
          {pemuatTampil && (
            <PemuatKamus selesai={status !== 'memuat'} onHilang={sembunyikanPemuat} className="absolute inset-x-0 top-0 z-10 h-56 sm:h-64" />
          )}
          <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {kamus && hasil.slice(0, tampil).map((e) => <KartuKata key={e.id} e={e} kamus={kamus} />)}
            </AnimatePresence>
            {kamus && hasil.length === 0 && (
              <p className="col-span-full py-8 text-center text-pasir">
                Kata “{q.trim()}” belum ada di kamus. Coba ejaan lain, atau pakai penerjemah di atas.
              </p>
            )}
          </div>
        </div>

        {tampil < hasil.length && (
          <div className="mt-8 text-center">
            <button type="button" className="btn-kaca" onClick={() => setTampil((t) => t + PER_HALAMAN)}>
              Tampilkan lebih banyak
            </button>
          </div>
        )}
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-pasir">
          Sumber: Kamus Basa Kumoring, dirapikan otomatis (spasi, kelas kata, varian ejaan, rujukan “lihat”, entri ganda). Asal data
          dan catatannya ada di halaman{' '}
          <Link href="/sumber" className="font-semibold text-emas-300 underline-offset-2 hover:underline">
            Sumber &amp; kredit
          </Link>
          . Ejaan dan arti bisa berbeda antar-marga; bantu kami menyempurnakannya bersama penutur asli Komering.
        </p>
      </div>
    </section>
  );
}
