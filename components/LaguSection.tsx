'use client';
/* Pemutar lagu daerah "Dang Lupa ko Komering" (public/lagu/). Lirik tersorot mengikuti
   waktu tiap baris (DATA.lagu…t); reff yang dinyanyikan berulang menyala setiap kali muncul. */
import { useReducedMotion } from 'framer-motion';
import { Maximize2, Pause, Play, SkipBack, SkipForward, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { DATA } from '@/lib/konten';
import { suara } from '@/lib/suara';
import { artiSingkat, clamp, fmtWaktu, norm } from '@/lib/teks';
import { useKamus } from './providers/KamusProvider';
import { useToast } from './providers/ToastProvider';
import { Bab } from './ui/Bab';
import { Reveal } from './ui/Reveal';

const L = DATA.lagu;

const BARIS = L.bagian.flatMap((bag, bi) =>
  bag.baris.map((b, j) => ({ ...b, bi, label: j === 0 ? bag.label : null, ulang: j === 0 ? bag.ulang : undefined })),
);

/** Tiap kali sebuah baris dinyanyikan: menyala sampai baris berikutnya, jeda musik, atau akhir nyanyian */
const KEMUNCULAN = (() => {
  const daftar = BARIS.flatMap((b, baris) => b.t.map((mulai) => ({ mulai, baris, akhir: 0 }))).sort((a, b) => a.mulai - b.mulai);
  daftar.forEach((o, i) => {
    const berikut = i + 1 < daftar.length ? daftar[i + 1].mulai : Infinity;
    const jeda = L.jeda.find(([a]) => a > o.mulai);
    o.akhir = Math.min(berikut, jeda ? jeda[0] : Infinity, L.selesai);
  });
  return daftar;
})();

const kemunculanPada = (pos: number) => KEMUNCULAN.findIndex((o) => pos >= o.mulai && pos < o.akhir);

function status(pos: number, oi: number): string {
  if (oi >= 0) return L.bagian[BARIS[KEMUNCULAN[oi].baris].bi].label;
  if (pos < KEMUNCULAN[0].mulai) return '♪ Intro musik';
  if (pos >= L.selesai) return '♪ Penutup';
  return '♪ Interlude musik';
}

export function LaguSection() {
  const { kamus, bukaKamus } = useKamus();
  const toast = useToast();
  const diam = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const lirikRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);
  const [durasi, setDurasi] = useState(L.durasi);
  const [main, setMain] = useState(false);
  const [terjemahan, setTerjemahan] = useState(true);
  const [ikuti, setIkuti] = useState(true);
  const [panggung, setPanggung] = useState(false);
  const panggungRef = useRef<HTMLDivElement>(null);
  const pemicuPanggung = useRef<HTMLButtonElement>(null);

  // Mode layar penuh: kunci gulir halaman, Esc menutup, dan pakai Fullscreen API bila tersedia
  useEffect(() => {
    if (!panggung) return;
    const el = panggungRef.current;
    const tombol = pemicuPanggung.current;
    document.body.style.overflow = 'hidden';
    el?.requestFullscreen?.().catch(() => {});
    el?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setPanggung(false);
    const keluarLayarPenuh = () => !document.fullscreenElement && setPanggung(false);
    window.addEventListener('keydown', esc);
    document.addEventListener('fullscreenchange', keluarLayarPenuh);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', esc);
      document.removeEventListener('fullscreenchange', keluarLayarPenuh);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      tombol?.focus();
    };
  }, [panggung]);

  // Posisi diperbarui tiap frame selama lagu diputar
  useEffect(() => {
    if (!main) return;
    let raf = 0;
    const tik = () => {
      if (audioRef.current) setPos(audioRef.current.currentTime);
      raf = requestAnimationFrame(tik);
    };
    raf = requestAnimationFrame(tik);
    return () => cancelAnimationFrame(raf);
  }, [main]);

  const oi = kemunculanPada(pos);
  const aktif = oi >= 0 ? KEMUNCULAN[oi].baris : -1;
  // Baris sebelum & sesudah untuk mode layar penuh (saat jeda musik: baris yang akan datang)
  const berikutO = KEMUNCULAN.findIndex((o) => o.mulai > pos);
  const barisKe = (o: number) => (o >= 0 && o < KEMUNCULAN.length ? BARIS[KEMUNCULAN[o].baris] : null);
  const barisSebelum = barisKe((oi >= 0 ? oi : berikutO >= 0 ? berikutO : KEMUNCULAN.length) - 1);
  const barisSesudah = barisKe(oi >= 0 ? oi + 1 : berikutO);

  const gulirKe = (i: number) => {
    const box = lirikRef.current;
    const el = box?.querySelectorAll<HTMLElement>('[data-baris]')[i];
    if (!box || !el) return;
    box.scrollTo({ top: el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2, behavior: diam ? 'auto' : 'smooth' });
  };
  useEffect(() => {
    if (aktif >= 0 && ikuti) gulirKe(aktif);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktif, ikuti]);

  const lompatKe = (detik: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = clamp(detik, 0, durasi);
    setPos(a.currentTime);
  };
  const putar = () => {
    suara.berhenti();
    audioRef.current?.play().catch(() => toast('Lagu belum bisa diputar. Coba ketuk tombol putar sekali lagi.'));
  };

  /* Kata-kata lirik yang ada di kamus (kecuali yang artinya sama dengan bahasa Indonesia) */
  const kosakata = useMemo(() => {
    if (!kamus) return [];
    const terlihat = new Set<string>(L.abaikan);
    const hasil: { w: string; kata: string; arti: string; lengkap: string }[] = [];
    BARIS.forEach((b) => norm(b.km).split(/[^a-z]+/).forEach((w) => {
      if (!w || terlihat.has(w)) return;
      terlihat.add(w);
      const e = kamus.cari(L.akarKata[w] ?? w).find((x) => !x.sensitif);
      if (!e || terlihat.has(e.id)) return;
      terlihat.add(e.id);
      const arti = artiSingkat(e.arti, e.kata);
      if (arti !== norm(e.kata)) hasil.push({ w, kata: e.kata, arti, lengkap: e.arti });
    }));
    return hasil;
  }, [kamus]);

  return (
    <Bab
      id="lagu"
      label="Lagu Daerah"
      pita
      judul={
        <>
          Lagu <span className="teks-emas">“Dang Lupa ko Komering”</span>
        </>
      }
      deskripsi="Lagu yang menjadi nama aplikasi ini. Dengarkan rekamannya dan ikuti lirik Basa Kumoring yang tersorot baris demi baris, lengkap dengan terjemahannya. Ketuk satu baris untuk langsung memutar bagian itu."
    >
      <audio
        ref={audioRef}
        src={L.audio}
        preload="none"
        onPlay={() => setMain(true)}
        onPause={() => {
          setMain(false);
          if (audioRef.current) setPos(audioRef.current.currentTime);
        }}
        onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDurasi(e.currentTarget.duration)}
        onError={() => toast('File lagu tidak ditemukan atau gagal dimuat.')}
      />
      <div className="grid items-stretch gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="permukaan sudut-songket flex flex-col items-center rounded-3xl p-6 text-center sm:p-8">
          <div className="piringan piringan-putar" data-main={main} role="img" aria-label="Piringan hitam berlabel maskot Raka & Ratih" />
          <h3 className="mt-8 font-display text-2xl font-bold text-gading">{L.judul}</h3>
          <p className="mt-1 text-sm text-pasir">{L.asal}</p>
          <p className="mt-3 min-h-[1.6rem] rounded-full border border-emas/20 bg-emas/10 px-3.5 py-0.5 text-xs font-bold tracking-wider text-emas-300">
            {status(pos, oi)}
          </p>

          <div className="mt-5 w-full">
            <label htmlFor="lagu-posisi" className="sr-only">
              Posisi lagu
            </label>
            <input
              id="lagu-posisi"
              type="range"
              className="penggeser"
              min={0}
              max={durasi}
              step={0.1}
              value={pos}
              style={{ '--pct': `${(pos / durasi) * 100}%` } as CSSProperties}
              onChange={(e) => lompatKe(Number(e.target.value))}
            />
            <div className="mt-2 flex justify-between text-xs font-semibold text-pasir tabular-nums">
              <span>{fmtWaktu(pos)}</span>
              <span>{fmtWaktu(durasi)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              className="ikon-btn"
              aria-label="Baris sebelumnya"
              onClick={() => {
                // Kembali ke awal baris ini; bila baru saja dimulai, ke baris sebelumnya
                const prev = [...KEMUNCULAN].reverse().find((o) => o.mulai < pos - 1.5);
                lompatKe(prev ? prev.mulai : 0);
              }}
            >
              <SkipBack className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-emas-300 to-emas text-kayu-950 shadow-[0_12px_30px_-8px_rgba(212,175,55,0.8)] transition-transform hover:scale-105"
              aria-label={main ? 'Jeda lagu' : 'Putar lagu'}
              onClick={() => (main ? audioRef.current?.pause() : putar())}
            >
              {main ? <Pause className="size-7 fill-current" aria-hidden /> : <Play className="ml-1 size-7 fill-current" aria-hidden />}
            </button>
            <button
              type="button"
              className="ikon-btn"
              aria-label="Baris berikutnya"
              onClick={() => {
                const next = KEMUNCULAN.find((o) => o.mulai > pos + 0.25);
                if (next) lompatKe(next.mulai);
              }}
            >
              <SkipForward className="size-5" aria-hidden />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button type="button" className="chip" aria-pressed={terjemahan} onClick={() => setTerjemahan((t) => !t)}>
              Terjemahan
            </button>
            <button type="button" className="chip" aria-pressed={ikuti} onClick={() => setIkuti((t) => !t)}>
              Ikuti lirik
            </button>
            <button ref={pemicuPanggung} type="button" className="chip" onClick={() => setPanggung(true)}>
              <Maximize2 className="size-4" aria-hidden /> Layar penuh
            </button>
          </div>
          <dl className="mt-6 w-full space-y-1.5 rounded-2xl border border-emas/20 bg-white/[0.03] px-4 py-3 text-left text-xs leading-relaxed">
            <div className="flex gap-2">
              <dt className="w-20 shrink-0 font-bold text-emas-400">Pencipta</dt>
              <dd className="text-gading/75">{L.kredit.pencipta}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-20 shrink-0 font-bold text-emas-400">Rekaman</dt>
              <dd className="text-gading/75">{L.kredit.rekaman}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-pasir">{L.keterangan}</p>
        </Reveal>

        <Reveal className="permukaan flex flex-col rounded-3xl p-4 sm:p-6" delay={0.1}>
          <div ref={lirikRef} className="lirik">
            {BARIS.map((b, i) => (
              <div key={`${b.km}-${i}`}>
                {b.label && (
                  <p className="mb-1.5 mt-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-emas">
                    {b.label}
                    {b.ulang && <span className="ml-2 rounded-full bg-emas/15 px-2 py-0.5 normal-case tracking-normal text-emas-200">{b.ulang}</span>}
                  </p>
                )}
                <button
                  type="button"
                  data-baris={i}
                  className="baris-lirik"
                  data-aktif={i === aktif}
                  aria-current={i === aktif ? 'true' : undefined}
                  onClick={() => {
                    // Reff muncul berkali-kali: lompat ke kemunculan berikutnya, atau yang pertama
                    lompatKe(b.t.find((s) => s > pos + 0.5) ?? b.t[0]);
                    if (!main) putar();
                  }}
                >
                  <span className={`block font-display text-[1.2rem] font-semibold ${i === aktif ? 'text-emas-300' : ''}`}>{b.km}</span>
                  {terjemahan && <span className="mt-0.5 block text-sm text-gading/70">{b.id}</span>}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-emas/20 px-1 pt-4">
            <p className="eyebrow">Kosakata dari Lagu</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {kosakata.map((k) => (
                <button key={k.kata} type="button" className="tag" title={k.lengkap} onClick={() => bukaKamus(k.kata)}>
                  <strong>{k.w}</strong>&nbsp;· {k.arti}
                </button>
              ))}
              {!kamus && <span className="text-xs text-pasir">Memuat kosakata…</span>}
            </div>
          </div>
        </Reveal>
      </div>

      {panggung &&
        createPortal(
          <div
            ref={panggungRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`Lirik layar penuh: ${L.judul}`}
            className="panggung-lagu fixed inset-0 z-[90] flex flex-col px-5 py-5 outline-none sm:px-10 sm:py-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-bold text-gading">{L.judul}</p>
                <p className="text-xs font-bold tracking-wider text-emas-300">{status(pos, oi)}</p>
              </div>
              <button type="button" className="ikon-btn" aria-label="Tutup layar penuh" onClick={() => setPanggung(false)}>
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-8 text-center" aria-live="polite">
              <p className="min-h-[2.5rem] font-display text-xl text-gading/35 sm:text-2xl">{barisSebelum?.km}</p>
              <div key={oi} className="sorotan-kuliner min-h-[9rem]">
                {aktif >= 0 ? (
                  <>
                    <p className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-bold leading-tight text-emas-300">{BARIS[aktif].km}</p>
                    {terjemahan && <p className="mt-3 text-lg text-gading/75 sm:text-2xl">{BARIS[aktif].id}</p>}
                  </>
                ) : (
                  <p className="font-display text-[clamp(1.8rem,4vw,3rem)] italic text-gading/60">{status(pos, oi).replace('♪ ', '')}</p>
                )}
              </div>
              <p className="min-h-[2.5rem] font-display text-xl text-gading/45 sm:text-2xl">{barisSesudah?.km}</p>
            </div>

            <div className="mx-auto w-full max-w-3xl">
              <label htmlFor="lagu-posisi-panggung" className="sr-only">
                Posisi lagu
              </label>
              <input
                id="lagu-posisi-panggung"
                type="range"
                className="penggeser"
                min={0}
                max={durasi}
                step={0.1}
                value={pos}
                style={{ '--pct': `${(pos / durasi) * 100}%` } as CSSProperties}
                onChange={(e) => lompatKe(Number(e.target.value))}
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="w-12 text-xs font-semibold text-pasir tabular-nums">{fmtWaktu(pos)}</span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="ikon-btn"
                    aria-label="Baris sebelumnya"
                    onClick={() => {
                      const prev = [...KEMUNCULAN].reverse().find((o) => o.mulai < pos - 1.5);
                      lompatKe(prev ? prev.mulai : 0);
                    }}
                  >
                    <SkipBack className="size-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="grid size-16 place-items-center rounded-full bg-emas-300 text-kayu-950 transition-transform hover:scale-105"
                    aria-label={main ? 'Jeda lagu' : 'Putar lagu'}
                    onClick={() => (main ? audioRef.current?.pause() : putar())}
                  >
                    {main ? <Pause className="size-7 fill-current" aria-hidden /> : <Play className="ml-1 size-7 fill-current" aria-hidden />}
                  </button>
                  <button
                    type="button"
                    className="ikon-btn"
                    aria-label="Baris berikutnya"
                    onClick={() => {
                      const next = KEMUNCULAN.find((o) => o.mulai > pos + 0.25);
                      if (next) lompatKe(next.mulai);
                    }}
                  >
                    <SkipForward className="size-5" aria-hidden />
                  </button>
                </div>
                <span className="w-12 text-right text-xs font-semibold text-pasir tabular-nums">{fmtWaktu(durasi)}</span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </Bab>
  );
}
