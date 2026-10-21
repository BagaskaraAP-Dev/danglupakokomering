'use client';
/* Kuliner sebagai halaman menu majalah: daftar hidangan bernomor di satu sisi, satu
   hidangan disorot di sisi lain. Kisah lengkapnya ada di halaman /kuliner/[slug]. */
import { ArrowRight } from 'lucide-react';
import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import { DATA, type Hidangan } from '@/lib/konten';
import { urlHidangan } from '@/lib/tautan';
import { artiSingkat, norm } from '@/lib/teks';
import { useKamus } from '../providers/KamusProvider';
import { Bab } from '../ui/Bab';
import { Reveal } from '../ui/Reveal';

/** Tombol kata kamus: "lalak · pedas" → membuka kata itu di kamus */
function TagKosakata({ kata, arti }: { kata: string; arti?: string }) {
  const { kamus, bukaKamus } = useKamus();
  const e = kamus?.cari(kata).find((x) => !x.sensitif);
  if (!e) return null;
  const singkat = arti ?? artiSingkat(e.arti, e.kata);
  // Jarak kata–arti diatur gap .tag; tanpa &nbsp; tambahan agar "iwak · ikan" berjarak rata
  return (
    <button type="button" className="tag" title={e.arti} onClick={() => bukaKamus(e.kata)}>
      <strong>{e.kata}</strong>
      {singkat !== norm(e.kata) && <span className="font-semibold opacity-80">· {singkat}</span>}
    </button>
  );
}

/* Foto kuliner beresolusi kecil (387–736 px). Semua dibingkai seragam seperti cetakan foto di atas latar
   songket yang sama, tanpa diperbesar melewati ukuran aslinya (tetap tajam). Juadah tampil sebagai piring bundar */
function FotoHidangan({ h }: { h: Hidangan }) {
  if (h.piring) {
    // Latar piring diburamkan 28 px, jadi cukup versi kecil teroptimasi (±3 KB), bukan JPEG asli
    const latar = getImageProps({ src: h.foto, alt: '', width: 64, height: Math.round((64 * h.ukuran[1]) / h.ukuran[0]) }).props.src;
    return (
      <span className="foto-hidangan h-[clamp(15rem,40vw,24rem)]" data-piring="true" style={{ '--foto': `url('${latar}')` } as CSSProperties}>
        <span className="piring-hidangan block">
          <Image src={h.foto} alt={h.alt} width={h.ukuran[0]} height={h.ukuran[1]} sizes="(min-width: 1024px) 320px, 60vw" />
        </span>
      </span>
    );
  }
  return (
    <span className="foto-hidangan h-[clamp(15rem,40vw,24rem)]" data-cetak>
      <Image
        src={h.foto}
        alt={h.alt}
        width={h.ukuran[0]}
        height={h.ukuran[1]}
        sizes="(min-width: 1024px) 640px, 100vw"
        style={{ '--lebar-asli': `${h.ukuran[0]}px` } as CSSProperties}
      />
    </span>
  );
}

export function KulinerSection() {
  const [aktif, setAktif] = useState(0);
  const h = DATA.kuliner[aktif];

  return (
    <Bab
      id="kuliner"
      tata="belah"
      label="Bangik nihan!"
      judul={
        <>
          Kuliner Khas <span className="teks-emas">Tanah Komering</span>
        </>
      }
      deskripsi={
        <>
          Way Komering kaya iwak (ikan), dan pawon (dapur)-nya kaya rasa: asam, pedas, gurih, hingga legit. Ada pula tradisi{' '}
          <em>katodan</em>: membagi nasi dan lauk pauk kepada tetangga.
        </>
      }
    >
      <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <Reveal as="aside" className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-pasir">Daftar hidangan</p>
          <ol className="menu-kuliner mt-3" aria-label="Pilih hidangan">
            {DATA.kuliner.map((x, i) => (
              <li key={x.nama}>
                <button type="button" aria-pressed={i === aktif} aria-controls="sorotan-kuliner" onClick={() => setAktif(i)}>
                  <span className="nomor-menu">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-base font-bold leading-tight sm:text-lg lg:text-xl">{x.nama}</span>
                    <span className="hidden text-sm text-pasir lg:block">{x.alias}</span>
                  </span>
                  <span className="ml-auto hidden shrink-0 text-xs font-semibold text-pasir xl:block">{x.jenis}</span>
                </button>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal as="article" className="min-w-0 lg:sticky lg:top-24">
          <div id="sorotan-kuliner" key={h.nama} className="sorotan-kuliner permukaan overflow-hidden rounded-[1.6rem]" aria-live="polite">
            <FotoHidangan h={h} />
            <div className="p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emas-400">
                {String(aktif + 1).padStart(2, '0')} · {h.jenis}
              </p>
              <h3 className="mt-2 font-display text-4xl font-extrabold leading-tight text-gading">{h.nama}</h3>
              <p className="font-semibold text-emas-300">{h.alias}</p>
              <p className="mt-4 font-display text-xl italic leading-relaxed text-gading/85">{h.teaser}</p>
              <p className="mt-4 leading-relaxed text-gading/75">{h.cerita[0]}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {h.kosakata.slice(0, 5).map((k) => (
                  <TagKosakata key={k} kata={k} />
                ))}
              </div>
              <Link href={urlHidangan(h.nama)} className="group mt-6 inline-flex items-center gap-2 font-bold text-emas-300 hover:text-emas-200">
                Baca kisah lengkap, bahan &amp; cara menikmati
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-12 border-t border-emas/15 pt-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-pasir">Penganan lain di kamus</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {DATA.penganan.map(([kata, arti]) => (
            <TagKosakata key={kata} kata={kata} arti={arti} />
          ))}
        </div>
      </Reveal>
    </Bab>
  );
}
