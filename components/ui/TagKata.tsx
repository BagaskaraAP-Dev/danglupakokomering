'use client';

import type { ReactNode } from 'react';
import { useKamus } from '../providers/KamusProvider';

interface TagKataProps {
  kata: string;
  children: ReactNode;
  className?: string;
  title?: string;
}

/** Tag yang membuka sebuah kata di bagian Kamus */
export function TagKata({ kata, children, className = '', title }: TagKataProps) {
  const { bukaKamus } = useKamus();
  return (
    <button type="button" className={`tag ${className}`} title={title ?? `Buka “${kata}” di kamus`} onClick={() => bukaKamus(kata)}>
      {children}
    </button>
  );
}
