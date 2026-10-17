'use client';

import { Volume2 } from 'lucide-react';
import { suara, useSedangBicara } from '@/lib/suara';
import { useToast } from '../providers/ToastProvider';

interface TombolDengarProps {
  teks: string;
  /** Id unik agar hanya tombol yang sedang membaca yang berdenyut */
  id: string;
  label: string;
  rate?: number;
  kecil?: boolean;
  className?: string;
}

/** Tombol speaker yang membacakan teks (TTS); ketuk lagi untuk berhenti */
export function TombolDengar({ teks, id, label, rate = 0.95, kecil = true, className = '' }: TombolDengarProps) {
  const bicara = useSedangBicara(id);
  const toast = useToast();
  return (
    <button
      type="button"
      className={`ikon-btn ${kecil ? 'kecil' : ''} ${className}`}
      data-bicara={bicara}
      aria-label={bicara ? 'Hentikan suara' : label}
      onClick={() => {
        if (bicara) {
          suara.berhenti();
          return;
        }
        if (!teks) {
          toast('Belum ada teks untuk dibacakan.');
          return;
        }
        if (!suara.ucapkan(teks, { id, rate })) toast('Browser ini tidak mendukung Text-to-Speech.');
      }}
    >
      <Volume2 className="size-[1.1rem]" aria-hidden />
    </button>
  );
}
