'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { fmtAngka } from '@/lib/teks';

/** Angka yang berjalan dari 0 ke target saat kartu masuk layar */
export function StatCounter({ label, nilai, tunda = 0 }: { label: string; nilai: number; tunda?: number }) {
  const ref = useRef<HTMLElement>(null);
  const terlihat = useInView(ref, { once: true, amount: 0.6 });
  const diam = useReducedMotion();
  const [angka, setAngka] = useState(0);

  useEffect(() => {
    if (!terlihat || diam) return;
    const kontrol = animate(0, nilai, {
      duration: 1.6,
      delay: tunda,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setAngka(Math.round(v)),
    });
    return () => kontrol.stop();
  }, [terlihat, diam, nilai, tunda]);

  return (
    <div className="kartu-stat permukaan">
      <dt className="text-[0.72rem] font-semibold tracking-wide text-pasir">{label}</dt>
      <dd ref={ref} className="font-display text-[1.65rem] font-extrabold leading-tight text-emas-300 tabular-nums">
        {fmtAngka(diam ? nilai : angka)}
      </dd>
    </div>
  );
}
