import type { ReactNode } from 'react';

type Tag = 'div' | 'li' | 'aside' | 'article' | 'form' | 'section';

interface RevealProps {
  children: ReactNode;
  as?: Tag;
  className?: string;
  /** Dipertahankan agar pemanggil lama tetap valid; urutan kini diatur posisi gulir */
  delay?: number;
  id?: string;
}

/** Naik-pudar halus saat masuk layar lewat CSS scroll-driven animation (.muncul).
 *  Tidak butuh JavaScript, jadi isi langsung tampil di HTML dan tidak menunda LCP. */
export function Reveal({ children, as: Komponen = 'div', className = '', id }: RevealProps) {
  return (
    <Komponen id={id} className={`muncul ${className}`}>
      {children}
    </Komponen>
  );
}
