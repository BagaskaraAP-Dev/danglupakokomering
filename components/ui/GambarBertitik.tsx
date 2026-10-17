'use client';

import Image from 'next/image';

export interface Titik {
  key: string;
  nama: string;
  x: number;
  y: number;
}

interface GambarBertitikProps {
  src: string;
  alt: string;
  lebar: number;
  tinggi: number;
  titik: Titik[];
  aktif: number;
  onPilih: (i: number) => void;
}

/** Gambar dengan titik-titik interaktif (x/y dalam persen) — dipakai Peta & Busana */
export function GambarBertitik({ src, alt, lebar, tinggi, titik, aktif, onPilih }: GambarBertitikProps) {
  return (
    <div className="permukaan sudut-songket rounded-[1.6rem] p-2 sm:p-3">
      <div className="relative overflow-hidden rounded-2xl">
        <Image src={src} alt={alt} width={lebar} height={tinggi} sizes="(min-width: 1024px) 62vw, 100vw" className="block h-auto w-full" />
        {titik.map((t, i) => (
          <button
            key={t.key}
            type="button"
            className="titik-peta"
            style={{ left: `${t.x}%`, top: `${t.y}%` }}
            data-aktif={i === aktif}
            aria-pressed={i === aktif}
            aria-label={t.nama}
            onClick={() => onPilih(i)}
          >
            <span className="label-titik">{t.nama}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
