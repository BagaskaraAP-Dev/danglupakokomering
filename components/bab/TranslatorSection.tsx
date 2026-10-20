'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, Copy, Languages } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { terjemahAi, type TerjemahanAi } from '@/lib/ai';
import { DATA } from '@/lib/konten';
import { LABEL_BAHASA, type Bahasa, type HasilTerjemahan, type Segmen } from '@/lib/penerjemah';
import { suara, useBacaanAktif } from '@/lib/suara';
import { fmtAngka, glosa, norm } from '@/lib/teks';
import { useKamus } from '../providers/KamusProvider';
import { useToast } from '../providers/ToastProvider';
import { Bab } from '../ui/Bab';
import { MaskotHidup } from '../maskot/MaskotHidup';
import { Reveal } from '../ui/Reveal';
import { TombolDengar } from '../ui/TombolDengar';

const MAKS = 400;
const SAPAAN_RATIH = 'Tabik! Nyak Ratih. Coba ketik, saya mau makan. Nanti nyak terjemahkan jadi, nyak haga mongan.';
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
  const [dari, setDari] = useState<Bahasa>('id');
  const [teks, setTeks] = useState('');
  const [hasil, setHasil] = useState<HasilTerjemahan | null>(null);
  const [ai, setAi] = useState<{ kunci: string; data: TerjemahanAi } | null>(null);
  const [menunggu, setMenunggu] = useState<string | null>(null);
  const [putaran, setPutaran] = useState(0);
  /** Bertambah setiap kali Ratih selesai menyusun kalimat: Ratih melompat & memercikkan emas */
  const [sorakRatih, setSorakRatih] = useState(0);
  const bacaan = useBacaanAktif();
  const terakhir = useRef('');
  const batal = useRef<AbortController>(undefined);
  const ke: Bahasa = dari === 'id' ? 'km' : 'id';

  /** Mesin lokal: instan, kata per kata, berjalan di browser */
  const lokal = (isi: string, arah: Bahasa) => {
    const t = isi.trim();
    terakhir.current = `${arah}|${t}`;
    setHasil(t && penerjemah ? penerjemah.translate(t, arah) : null);
  };

  /** Gemini menyusun kalimat alami dari entri & contoh kalimat kamus */
  const mintaAi = async (isi: string, arah: Bahasa) => {
    const t = isi.trim();
    if (!t) return;
    lokal(isi, arah);
    const kunci = `${arah}|${t}`;
    batal.current?.abort();
    const c = new AbortController();
    batal.current = c;
    setMenunggu(kunci);
    const r = await terjemahAi(t, arah, c.signal);
    if (c.signal.aborted) return;
    setMenunggu(null);
    if (r.ok) {
      setAi({ kunci, data: r.data });
      setSorakRatih((n) => n + 1);
    } else toast(r.status === 429 ? 'Penerjemah kalimat sedang ramai, jadi ditampilkan terjemahan kata per kata.' : 'Penerjemah kalimat sedang tidak tersedia, jadi ditampilkan terjemahan kata per kata.');
  };

  useEffect(() => () => batal.current?.abort(), []);

  // Terjemahan lokal langsung saat mengetik (jeda 300 ms)
  useEffect(() => {
    if (!penerjemah || terakhir.current === `${dari}|${teks.trim()}`) return;
    const t = setTimeout(() => lokal(teks, dari), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teks, dari, penerjemah]);

  const kunciKini = `${dari}|${teks.trim()}`;
  const hasilAi = ai?.kunci === kunciKini ? ai.data : null;
  const sedangAi = menunggu === kunciKini;
  const tampil = hasilAi?.terjemahan ?? hasil?.text ?? '';

  const tukar = () => {
    setPutaran((p) => p + 180);
    setDari(ke);
    if (tampil) setTeks(tampil);
  };

  const pct = Math.round((hasil?.conf ?? 0) * 100);
  const ratihBicara = bacaan === 'hasil-terjemahan' || bacaan === 'ratih-penerjemah';

  return (
    <Bab
      id="penerjemah"
      label="Ratih Menerjemahkan"
      pita
      tata="belah"
      judul={
        <>
          Penerjemah <span className="teks-emas">Basa Kumoring</span>
        </>
      }
      deskripsi={
        <>
          Saat kamu mengetik, mesin lokal mencocokkan tiap kata dengan{' '}
          <strong className="text-emas-200">{fmtAngka(meta.jumlahKata)} kata</strong> Kamus Basa Kumoring. Tekan{' '}
          <strong className="text-emas-200">Terjemahkan</strong>, dan Ratih menyusun kalimat yang alami dari entri kamus serta{' '}
          {fmtAngka(meta.jumlahContoh)} contoh kalimatnya.
        </>
      }
    >
      <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal as="aside" className="order-2 space-y-5 lg:order-1">
          <MaskotHidup
            className="mx-auto max-w-sm lg:max-w-none"
            src="/maskot/ratih-penerjemah.webp"
            alt="Maskot Ratih berhijab merah dengan mahkota emas, menunjuk ke arah penerjemah"
            width={1100}
            height={821}
            sizes="(min-width: 1024px) 30vw, 90vw"
            suasana={ratihBicara ? 'bicara' : sedangAi ? 'berpikir' : 'tenang'}
            sorak={sorakRatih}
            asalPercik={{ x: 0.78, y: 0.56 }}
            labelSentuh={ratihBicara ? 'Hentikan suara Ratih' : 'Sentuh Ratih untuk mendengar sapaannya'}
            onSentuh={() => {
              if (ratihBicara) suara.berhenti();
              else suara.ucapkan(SAPAAN_RATIH, { id: 'ratih-penerjemah', jenis: 'wanita', rate: 0.92 });
            }}
          />
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
                void mintaAi(teks, dari);
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
                  batal.current?.abort();
                  setMenunggu(null);
                  document.getElementById('tr-masukan')?.focus();
                }}
              >
                Hapus
              </button>
              <button type="button" className="btn-emas btn-kecil" disabled={!teks.trim() || sedangAi} onClick={() => void mintaAi(teks, dari)}>
                <Languages className="size-4" aria-hidden /> {sedangAi ? 'Menyusun…' : 'Terjemahkan'}
              </button>
            </div>
          </div>

          <div className="hasil-terjemahan mt-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-emas-400">
                  Hasil · {LABEL_BAHASA[ke]}
                  {tampil && (
                    <span className="ml-2 font-semibold normal-case tracking-normal text-pasir">
                      {hasilAi ? '· disusun Ratih dari kamus' : '· kata per kata'}
                    </span>
                  )}
                </p>
                <div aria-live="polite" className="min-h-[2.2rem]">
                  {tampil ? (
                    <>
                      <p className="break-words font-display text-[1.3rem] font-semibold leading-snug text-gading sm:text-[1.45rem]">{tampil}</p>
                      {sedangAi && (
                        <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-pasir">
                          <span className="berpikir" aria-hidden>
                            <i />
                            <i />
                            <i />
                          </span>
                          Ratih sedang menyusun kalimat…
                        </p>
                      )}
                      {hasilAi && hasil?.text && hasil.text !== hasilAi.terjemahan && (
                        <p className="mt-2 text-xs text-pasir">Kata per kata: {hasil.text}</p>
                      )}
                      {hasilAi?.catatan && <p className="mt-2 text-xs leading-relaxed text-gading/70">{hasilAi.catatan}</p>}
                      {hasilAi && hasilAi.kataLuarKamus.length > 0 && (
                        <p className="mt-2 text-xs leading-relaxed text-gading/70">
                          <span className="tag tag-dugaan mr-1.5">periksa</span>
                          Belum ditemukan di kamus: {hasilAi.kataLuarKamus.join(', ')}.
                        </p>
                      )}
                    </>
                  ) : sedangAi ? (
                    <span className="berpikir" aria-label="Sedang menerjemahkan">
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : (
                    <p className="font-display text-lg italic text-pasir">
                      {status === 'gagal' ? 'Kamus gagal dimuat. Muat ulang halaman.' : 'Hasil terjemahan akan muncul di sini.'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <TombolDengar id="hasil-terjemahan" teks={tampil} label="Dengarkan hasil terjemahan" kecil={false} rate={dari === 'id' ? 0.85 : 0.95} />
                <button
                  type="button"
                  className="ikon-btn"
                  aria-label="Salin hasil terjemahan"
                  onClick={async () => {
                    if (!tampil) return toast('Belum ada hasil untuk disalin.');
                    toast((await salin(tampil)) ? 'Tersalin ke clipboard.' : 'Gagal menyalin, salin manual, ya.');
                  }}
                >
                  <Copy className="size-[1.1rem]" aria-hidden />
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="shrink-0 text-xs font-semibold text-pasir" title="Persentase kata yang dikenali mesin lokal dari kamus">Cakupan kamus</span>
              <div className="meter flex-1">
                <span style={{ width: `${hasil ? pct : 0}%` }} />
              </div>
              <span className="w-10 text-right text-xs font-bold text-emas-300">{hasil ? `${pct}%` : '—'}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <AnimatePresence>
                {hasil?.segs.filter((s) => s.type !== 'punct').map((s, i) => <SegmenTerjemahan key={`${s.src}-${i}`} s={s} i={i} dari={dari} />)}
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
                    void mintaAi(k, dari);
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
