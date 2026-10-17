import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface BabProps {
  id: string;
  nomor: string;
  label: string;
  judul: ReactNode;
  deskripsi?: ReactNode;
  /** Latar pita songket untuk bab berselang-seling */
  pita?: boolean;
  children: ReactNode;
}

/** Kerangka satu bab: pembuka bernomor (Bab 01 · …), judul serif, deskripsi */
export function Bab({ id, nomor, label, judul, deskripsi, pita, children }: BabProps) {
  return (
    <section id={id} className={`relative py-20 lg:py-28 ${pita ? 'pita-songket' : ''}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">
            Bab {nomor} · {label}
          </p>
          <h2 className="judul-bab">{judul}</h2>
          {deskripsi && <div className="desk-bab">{deskripsi}</div>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
