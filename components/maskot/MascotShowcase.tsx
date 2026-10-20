'use client';
/* =============================================================================
   Maskot Raka & Ratih di bingkai lengkung bermotif pucuk rebung.
   - Video 3D Raka & Ratih memberi salam "Tabik pun" berputar tanpa suara selama bingkai
     terlihat. Poster (bingkai pertama video) tampil sejak HTML pertama.
     Gerak dikurangi atau mode hemat data: video tidak diputar otomatis.
   - Setelah pengunjung pernah klik/ketuk/menekan tombol di halaman (syarat peramban untuk
     suara), Raka menyapa "Tabik pun" dengan suara asli setiap kali selesai menunduk.
   - Sentuh/klik Raka: Raka membesar sedikit (Web Animations API) dan video melompat ke
     saat Raka mengucapkan "Tabik pun" dengan suara aslinya, jadi gerak bibir pas dengan
     suara; suara mati lagi saat video berputar ulang. Bila video gagal dimuat, ucapan
     memakai Web Speech API (suara pria id-ID). Tanpa tulisan apa pun di atas maskot.
   - Kartu "Raka & Ratih menyapa": speaker membacakan sapaan beserta artinya; kata
     tersorot mengikuti suara. Sapaan berganti hanya lewat tombol "berikutnya".
   ============================================================================= */
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, Volume2 } from 'lucide-react';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { preload } from 'react-dom';
import { DATA } from '@/lib/konten';
import { suara, useBacaanAktif, useSedangBicara } from '@/lib/suara';
import { Avatar } from './Avatar';

const UCAPAN_RAKA = 'Tabik pun!';
/** Titik tengah tubuh Raka di dalam bingkai (persen) — asal skala saat disentuh */
const PUSAT_RAKA = '27% 60%';
/* Versi web dipotong ke area yang terlihat di bingkai 4:5 (640×800, ±650 KB); video asli
   1080×1920 disimpan di DOKUMENTASIITFEST2026/00-bahan/ */
const VIDEO = '/maskot/video3d-maskot-pasangan-hero.mp4';
const POSTER = '/maskot/poster-video-hero.webp';
/* Di video, Raka selesai menunduk lalu mulutnya terbuka "Ta-" pada detik 4,71 dan "pun" usai
   di 5,7. Versi web punya keyframe tepat di 4,5 agar lompatan ke sapaan instan, juga di HP */
const AWAL_SAPAAN = 4.5;
const MULAI_UCAPAN = 4.7;
const AKHIR_UCAPAN = 5.8;
/** Sebelum detik ini video dianggap sudah berputar ulang (awal video hening ±0,75 dtk) */
const BATAS_ULANG = 1;
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
  const bingkaiRef = useRef<HTMLDivElement>(null);
  const gambarRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  /** Video diputar otomatis setiap kali bingkai terlihat (false: gerak dikurangi/hemat data) */
  const putarSaatTerlihat = useRef(false);
  /** Peramban baru mengizinkan video bersuara setelah pengunjung pernah klik/ketuk/menekan tombol */
  const izinSuara = useRef(false);
  const diam = useReducedMotion();
  const rakaBicara = useSedangBicara('raka');
  // Suara video dibisukan sementara selama peramban membacakan teks lain, agar tidak bertumpuk
  const adaBacaan = useBacaanAktif() !== null;
  /** Suara video menyala: sejak Raka disentuh sampai video berputar ulang */
  const [bersuara, setBersuara] = useState(false);
  /** Raka sedang mengucapkan "Tabik pun" di video */
  const [menyapa, setMenyapa] = useState(false);
  const [gagal, setGagal] = useState(false);

  // Poster adalah gambar terbesar di layar pertama (LCP)
  preload(POSTER, { as: 'image', type: 'image/webp', fetchPriority: 'high' });

  // Jeda saat bingkai keluar layar; putar lagi saat kembali
  useEffect(() => {
    const video = videoRef.current;
    const bingkai = bingkaiRef.current;
    if (!video || !bingkai) return;
    const hematData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    putarSaatTerlihat.current = !diam && !hematData;
    // Satu panggilan bisa membawa beberapa perubahan sekaligus; entri terakhir = keadaan terkini
    const pengamat = new IntersectionObserver((entri) => {
      if (!entri[entri.length - 1].isIntersecting) video.pause();
      else if (putarSaatTerlihat.current) video.play().catch(() => {});
    });
    pengamat.observe(bingkai);
    return () => pengamat.disconnect();
  }, [diam]);

  // Interaksi pertama di mana pun membuka izin suara. Safari iOS juga mensyaratkan elemen video
  // itu sendiri pernah diubah suaranya di dalam gestur, maka muted dibalik sesaat (tak terdengar)
  useEffect(() => {
    if (navigator.userActivation?.hasBeenActive) izinSuara.current = true;
    const buka = () => {
      izinSuara.current = true;
      const video = videoRef.current;
      if (video?.muted) {
        video.muted = false;
        video.muted = true;
      }
      window.removeEventListener('pointerup', buka, true);
      window.removeEventListener('keydown', buka, true);
    };
    window.addEventListener('pointerup', buka, true);
    window.addEventListener('keydown', buka, true);
    return () => {
      window.removeEventListener('pointerup', buka, true);
      window.removeEventListener('keydown', buka, true);
    };
  }, []);

  const pantauWaktu = () => {
    const video = videoRef.current;
    if (!video) return;
    const t = video.currentTime;
    // Raka selesai menunduk: menyapa dengan suara asli setiap putaran, bila suara sudah diizinkan.
    // Jendela 0,5 dtk sebelum mulut terbuka cukup karena timeupdate datang paling lambat tiap 250 ms
    if (izinSuara.current && !bersuara && !adaBacaan && !video.paused && t >= MULAI_UCAPAN - 0.5 && t < MULAI_UCAPAN) {
      video.muted = false;
      video.play().then(
        () => {
          setBersuara(true);
          setMenyapa(true);
        },
        // Peramban tetap menolak suara: lanjutkan tanpa suara
        () => {
          video.muted = true;
          video.play().catch(() => {});
        },
      );
    }
    // Ucapan selesai: cahaya padam. Video berputar ulang: suara mati (dan diam lagi bila tak boleh putar otomatis)
    if (menyapa && t >= AKHIR_UCAPAN) setMenyapa(false);
    if (bersuara && t < BATAS_ULANG) {
      setBersuara(false);
      setMenyapa(false);
      if (!putarSaatTerlihat.current) video.pause();
    }
  };

  // Raka disentuh: video melompat ke sapaannya dengan suara asli, lalu Raka membesar sedikit dan memantul kembali
  const sentuhRaka = () => {
    const video = videoRef.current;
    if (video && !gagal) {
      suara.berhenti();
      video.currentTime = AWAL_SAPAAN;
      video.muted = false;
      video.play().catch(() => {});
      setBersuara(true);
      setMenyapa(true);
    } else {
      suara.ucapkan(UCAPAN_RAKA, { id: 'raka', jenis: 'pria', rate: 0.88 });
    }
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
      <div ref={bingkaiRef} className="bingkai-lengkung mx-auto w-[min(17rem,72vw)] sm:w-full">
        <div ref={gambarRef} className="lapis-maskot">
          {/* preload="none": unduhan video menunggu hidrasi agar tidak berebut dengan CSS/JS halaman */}
          <video
            ref={videoRef}
            poster={POSTER}
            muted={!bersuara || adaBacaan}
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            disableRemotePlayback
            aria-label="Animasi Raka dan Ratih berbusana adat pengantin Komering merah marun dan emas, menangkupkan tangan dan membungkuk memberi salam Tabik pun"
            onTimeUpdate={pantauWaktu}
          >
            <source src={VIDEO} type="video/mp4" onError={() => setGagal(true)} />
          </video>
        </div>
        {/* Cahaya emas di tubuh Raka selama ia berbicara */}
        <span className="cahaya-raka" data-aktif={rakaBicara || menyapa} aria-hidden />
        {/* Area sentuh transparan tepat di tubuh Raka (sisi kiri bingkai) */}
        <button
          type="button"
          className="sentuh-raka"
          data-bicara={rakaBicara || menyapa}
          aria-label="Sentuh Raka untuk mendengar sapaan Tabik pun"
          onClick={sentuhRaka}
        />
      </div>

      <KartuSapaan />
    </div>
  );
}
