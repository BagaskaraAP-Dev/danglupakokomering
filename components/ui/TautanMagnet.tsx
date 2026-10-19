'use client';

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import Link from 'next/link';
import { useRef, type PointerEvent, type ReactNode } from 'react';

// Link (bukan <a>) agar lompatan ke #bab tercatat di router dan tombol Back tetap memulihkan halaman
const MotionLink = motion.create(Link);

interface TautanMagnetProps {
  href: string;
  className?: string;
  children: ReactNode;
  /** Seberapa kuat tombol "tertarik" ke kursor */
  kekuatan?: number;
}

/** Tautan-tombol yang sedikit mengikuti kursor (efek magnetik) */
export function TautanMagnet({ href, className, children, kekuatan = 0.3 }: TautanMagnetProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const diam = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  const gerak = (e: PointerEvent<HTMLAnchorElement>) => {
    if (diam || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * kekuatan);
    y.set((e.clientY - (r.top + r.height / 2)) * kekuatan * 1.2);
  };
  const lepas = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionLink ref={ref} href={href} className={className} style={{ x: sx, y: sy }} onPointerMove={gerak} onPointerLeave={lepas} whileTap={{ scale: 0.97 }}>
      {children}
    </MotionLink>
  );
}
