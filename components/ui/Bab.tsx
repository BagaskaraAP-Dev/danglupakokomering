import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface BabProps {
  id: string;
  /** Penanda kecil di atas judul (opsional, tanpa nomor bab) */
  label?: string;
  judul?: ReactNode;
  deskripsi?: ReactNode;
  /** Susunan kepala bab — sengaja berbeda-beda supaya tiap bab punya ritme sendiri:
   *  kiri = judul rata kiri; belah = judul kiri & deskripsi kanan; tengah = simetris;
   *  tanpa = bab menyusun kepalanya sendiri */
  tata?: 'kiri' | 'belah' | 'tengah' | 'tanpa';
  /** Elemen di sisi kanan kepala bab (mis. kolom cari) untuk tata "kiri" */
  aksi?: ReactNode;
  /** Latar pita songket untuk bab berselang-seling */
  pita?: boolean;
  className?: string;
  children: ReactNode;
}

export function Bab({ id, label, judul, deskripsi, tata = 'kiri', aksi, pita, className = '', children }: BabProps) {
  const penanda = label && <p className="penanda-bab mb-3">{label}</p>;
  let kepala: ReactNode = null;

  if (tata === 'belah') {
    kepala = (
      <Reveal className="mb-12 grid gap-6 lg:mb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
        <div>
          {penanda}
          <h2 className="judul-bab">{judul}</h2>
        </div>
        {deskripsi && <div className="desk-bab lg:pb-1.5">{deskripsi}</div>}
      </Reveal>
    );
  } else if (tata === 'tengah') {
    kepala = (
      <Reveal className="mx-auto mb-10 max-w-2xl text-center">
        {penanda}
        <h2 className="judul-bab">{judul}</h2>
        {deskripsi && <div className="desk-bab mt-4">{deskripsi}</div>}
      </Reveal>
    );
  } else if (tata === 'kiri') {
    kepala = (
      <Reveal className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {penanda}
          <h2 className="judul-bab">{judul}</h2>
          {deskripsi && <div className="desk-bab mt-4">{deskripsi}</div>}
        </div>
        {aksi}
      </Reveal>
    );
  }

  return (
    <section id={id} className={`relative py-20 lg:py-28 ${pita ? 'pita-songket' : ''} ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {kepala}
        {children}
      </div>
    </section>
  );
}
