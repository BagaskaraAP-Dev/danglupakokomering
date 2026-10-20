'use client';
/* Panggung maskot yang hidup lewat cahaya (Raka di Sejarah, Ratih di Penerjemah). Maskot
   sendiri tetap diam seperti gambar biasa; yang hidup adalah cahayanya:
   - debu emas songket di belakang maskot yang menyingkir dari kursor (DebuEmas);
   - pendar emas di belakang maskot yang menguat selama maskot berbicara atau berpikir;
   - percikan emas saat disentuh atau saat `sorak` berganti.
   Gerak dikurangi: debu emas dimatikan, pendar tetap. */
import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState, type PointerEvent } from 'react';
import { DebuEmas, type Suasana } from './DebuEmas';

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  suasana?: Suasana;
  /** Ganti nilainya (mis. bertambah satu) untuk memicu percikan emas */
  sorak?: number;
  /** Titik asal percikan di panggung (0–1), mis. ujung jari yang menunjuk */
  asalPercik?: { x: number; y: number };
  labelSentuh: string;
  onSentuh: () => void;
}

export function MaskotHidup({ src, alt, width, height, sizes, className = '', suasana = 'tenang', sorak = 0, asalPercik = { x: 0.5, y: 0.45 }, labelSentuh, onSentuh }: Props) {
  const diam = useReducedMotion() ?? false;
  const kursor = useRef<{ x: number; y: number } | null>(null);
  const [ketuk, setKetuk] = useState(0);

  const gerak = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    kursor.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <div className={`panggung-maskot ${className}`} onPointerMove={gerak} onPointerLeave={() => (kursor.current = null)}>
      <span className="pendar-maskot" data-aktif={suasana !== 'tenang'} aria-hidden />
      <DebuEmas suasana={suasana} percik={sorak + ketuk} asal={asalPercik} kursor={kursor} jalan={!diam} />
      <Image src={src} alt={alt} width={width} height={height} sizes={sizes} className="relative z-[1] block h-auto w-full" />
      <button
        type="button"
        className="sentuh-maskot"
        aria-label={labelSentuh}
        onClick={() => {
          setKetuk((n) => n + 1);
          onSentuh();
        }}
      />
    </div>
  );
}
