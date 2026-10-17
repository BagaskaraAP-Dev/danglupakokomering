'use client';
/* Asisten mengambang "Tanya Raka & Ratih": tombol di pojok kanan bawah yang membuka
   laci obrolan bergaya songket. Jawaban dari Gemini lewat /api/chat (RAG kamus + bab situs);
   bila gagal, lib/chatbot.ts (niat + penerjemah + kamus lokal) menjawab sebagai cadangan. */
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { tanyaAi } from '@/lib/ai';
import { jawab, isiAngka, type Pembicara } from '@/lib/chatbot';
import { DATA, type AksiChat } from '@/lib/konten';
import { suara } from '@/lib/suara';
import { useKamus } from './providers/KamusProvider';
import { Avatar } from './ui/Avatar';

interface Pesan {
  id: number;
  oleh: Pembicara | 'pengguna';
  teks: string;
  aksi?: AksiChat[];
  mesin?: 'gemini' | 'lokal';
}

const NAMA: Record<Pembicara, string> = { raka: 'Raka', ratih: 'Ratih' };

/** **tebal** dan baris baru → elemen React (tanpa innerHTML) */
function formatTeks(t: string): ReactNode {
  return t.split('\n').map((baris, i, semua) => (
    <Fragment key={i}>
      {baris.split(/\*\*(.+?)\*\*/g).map((bagian, j) => (j % 2 ? <strong key={j}>{bagian}</strong> : bagian))}
      {i < semua.length - 1 && <br />}
    </Fragment>
  ));
}

export function FloatingChat() {
  const { kamus, penerjemah, meta, bukaKamus, muat } = useKamus();
  const diam = useReducedMotion();
  const [buka, setBuka] = useState(false);
  const [pesan, setPesan] = useState<Pesan[]>([]);
  const [mengetik, setMengetik] = useState<Pembicara | null>(null);
  const [masukan, setMasukan] = useState('');
  const daftarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const nomor = useRef(0);
  const batal = useRef<AbortController>(undefined);

  const tambah = (p: Omit<Pesan, 'id'>) => setPesan((d) => [...d, { ...p, id: ++nomor.current }]);

  const bukaLaci = () => {
    muat();
    setBuka(true);
    if (pesan.length === 0) tambah({ oleh: 'ratih', teks: isiAngka(DATA.chatbot.sapaanAwal, meta) });
  };
  const tutupLaci = () => setBuka(false);

  // Kembalikan fokus ke tombol mengambang setelah laci ditutup
  const pernahBuka = useRef(false);
  useEffect(() => {
    if (buka) pernahBuka.current = true;
    else if (pernahBuka.current) fabRef.current?.focus();
  }, [buka]);

  useEffect(() => {
    if (!buka) return;
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBuka(false);
    };
    window.addEventListener('keydown', esc);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', esc);
    };
  }, [buka]);

  useEffect(() => {
    daftarRef.current?.scrollTo({ top: daftarRef.current.scrollHeight, behavior: diam ? 'auto' : 'smooth' });
  }, [pesan, mengetik, diam]);

  useEffect(() => () => batal.current?.abort(), []);

  const kirim = async (q: string) => {
    const teks = q.trim();
    if (!teks || mengetik) return;
    const riwayat = pesan.slice(-6).map(({ oleh, teks: t }) => ({ oleh, teks: t }));
    tambah({ oleh: 'pengguna', teks });
    setMengetik('ratih');
    batal.current = new AbortController();
    const ai = await tanyaAi(teks, riwayat, batal.current.signal);
    if (batal.current.signal.aborted) return;
    setMengetik(null);
    if (ai.ok) {
      tambah({ ...ai.data, mesin: 'gemini' });
      return;
    }
    const r = jawab(teks, kamus, penerjemah, meta);
    tambah({ oleh: r.oleh, teks: r.teks, aksi: r.aksi, mesin: 'lokal' });
    if (r.ucap) suara.ucapkan(r.ucap, { id: 'chat' });
  };

  const ikutiAksi = (a: AksiChat) => {
    if (window.innerWidth < 640) setBuka(false);
    if (a.cari) {
      bukaKamus(a.cari);
      return;
    }
    document.querySelector(a.href)?.scrollIntoView({ behavior: diam ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <>
      <AnimatePresence>
        {!buka && (
          <motion.button
            ref={fabRef}
            type="button"
            className="fixed bottom-5 right-5 z-[60] flex items-center gap-2.5 rounded-full bg-gradient-to-br from-emas-300 to-emas py-1.5 pl-1.5 pr-1.5 text-[0.9rem] font-bold text-kayu-950 shadow-[0_16px_40px_-12px_rgba(212,175,55,0.8)] sm:pr-5"
            aria-haspopup="dialog"
            aria-expanded={buka}
            aria-controls="laci-obrolan"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={bukaLaci}
          >
            <span className="relative">
              <Avatar siapa="ratih" />
              <span className="absolute -right-0.5 top-0 size-3 rounded-full border-2 border-emas-400 bg-daun" aria-hidden />
            </span>
            <span className="hidden sm:inline">Tanya Raka &amp; Ratih</span>
            <span className="sr-only sm:hidden">Tanya Raka &amp; Ratih</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {buka && (
          <>
            <motion.div
              className="fixed inset-0 z-[65] bg-kayu-950/50 backdrop-blur-[2px] sm:bg-kayu-950/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={tutupLaci}
              aria-hidden
            />
            <motion.div
              id="laci-obrolan"
              role="dialog"
              aria-modal="true"
              aria-labelledby="judul-obrolan"
              className="permukaan-kuat fixed inset-x-0 bottom-0 z-[70] flex h-[min(88dvh,40rem)] flex-col overflow-hidden rounded-t-[1.75rem] sm:inset-x-auto sm:bottom-4 sm:right-4 sm:top-4 sm:h-auto sm:w-[26rem] sm:rounded-[1.75rem]"
              initial={diam ? { opacity: 0 } : { opacity: 0, y: 60, x: 0 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={diam ? { opacity: 0 } : { opacity: 0, y: 60 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              {/* Kepala laci dengan pita songket */}
              <div className="pita-songket relative flex items-center gap-3 border-b border-emas/25 px-4 py-3.5">
                <div className="flex -space-x-3">
                  <Avatar siapa="raka" />
                  <Avatar siapa="ratih" />
                </div>
                <div className="min-w-0 flex-1">
                  <p id="judul-obrolan" className="font-display font-bold leading-tight text-gading">
                    Tanya Raka &amp; Ratih
                  </p>
                  <p className="text-[0.7rem] font-semibold text-emas-400">Gemini + Kamus Basa Kumoring</p>
                </div>
                <button type="button" className="ikon-btn kecil" aria-label="Tutup obrolan" onClick={tutupLaci}>
                  <X className="size-4" aria-hidden />
                </button>
              </div>
              <div className="tumpal opacity-50" aria-hidden />

              <div ref={daftarRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
                {pesan.map((m) =>
                  m.oleh === 'pengguna' ? (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pesan-pengguna max-w-[88%] self-end">
                      <div className="pesan-isi">{m.teks}</div>
                    </motion.div>
                  ) : (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex max-w-[92%] items-end gap-2">
                      <Avatar siapa={m.oleh} className="!size-8" />
                      <div className="pesan-isi">
                        <span className="mb-0.5 flex items-baseline gap-2 text-[0.68rem] font-bold text-emas-400">
                          {NAMA[m.oleh]}
                          {m.mesin && (
                            <span className="font-semibold text-pasir" title={m.mesin === 'gemini' ? 'Disusun Gemini dari kamus & bab situs' : 'Gemini tidak tersedia; dijawab mesin lokal'}>
                              {m.mesin === 'gemini' ? 'Gemini' : 'mesin lokal'}
                            </span>
                          )}
                        </span>
                        {formatTeks(m.teks)}
                        {m.aksi && m.aksi.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {m.aksi.map((a) => (
                              <a
                                key={a.label}
                                href={a.href}
                                className="rounded-full border border-emas/40 px-2.5 py-1 text-xs font-bold text-emas-300 hover:bg-emas/15"
                                onClick={(e) => {
                                  // Tautan ke halaman lain (mis. /kuliner/…) dibiarkan berpindah halaman
                                  if (!a.cari && !a.href.startsWith('#')) return;
                                  e.preventDefault();
                                  ikutiAksi(a);
                                }}
                              >
                                {a.label} →
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ),
                )}
                {mengetik && (
                  <div className="flex items-end gap-2">
                    <Avatar siapa={mengetik} className="!size-8" />
                    <div className="pesan-isi">
                      <span className="berpikir" aria-label={`${NAMA[mengetik]} sedang mengetik`}>
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-1.5 overflow-x-auto px-4 py-2.5 [scrollbar-width:none]">
                {DATA.chatbot.saran.map((s) => (
                  <button key={s} type="button" className="chip shrink-0 !px-3 !py-1.5 !text-xs" onClick={() => kirim(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <form
                className="flex gap-2 border-t border-emas/20 p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  kirim(masukan);
                  setMasukan('');
                }}
              >
                <label htmlFor="obrolan-masukan" className="sr-only">
                  Tulis pertanyaan
                </label>
                <input
                  ref={inputRef}
                  id="obrolan-masukan"
                  className="isian !py-2.5"
                  autoComplete="off"
                  maxLength={300}
                  placeholder="Tanya tentang Komering…"
                  value={masukan}
                  onChange={(e) => setMasukan(e.target.value)}
                />
                <button type="submit" className="btn-emas btn-kecil !px-3.5" aria-label="Kirim" disabled={!!mengetik}>
                  <Send className="size-4" aria-hidden />
                </button>
              </form>
              <p className="px-4 pb-3 text-[0.68rem] leading-snug text-pasir">
                Pertanyaan dikirim ke Google Gemini lewat server situs ini bersama potongan kamus yang relevan. Jangan menulis data pribadi.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
