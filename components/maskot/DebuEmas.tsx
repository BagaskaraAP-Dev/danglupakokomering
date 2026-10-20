'use client';
/* Debu emas songket di belakang maskot: butir naik pelan dan menyingkir dari kursor,
   lebih deras saat maskot berbicara, berputar mengelilingi kepala saat maskot berpikir,
   dan memercik dari satu titik setiap kali `percik` berganti. */
import { useRef, type RefObject } from 'react';
import { useKanvas } from '../ui/useKanvas';

export type Suasana = 'tenang' | 'bicara' | 'berpikir';

interface Butir {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  fase: number;
  warna: string;
  /** Hanya percikan: 1 → 0 lalu hilang */
  umur: number;
}

const WARNA = ['229,193,88', '246,231,180', '212,175,55'];
const JARI_KURSOR = 80;

const acak = (a: number, b: number) => a + Math.random() * (b - a);

function butirBaru(lebar: number, tinggi: number, dariBawah: boolean): Butir {
  return {
    x: acak(0, lebar),
    y: dariBawah ? tinggi + 4 : acak(0, tinggi),
    vx: acak(-0.08, 0.08),
    vy: -acak(0.15, 0.5),
    r: acak(0.7, 2.6),
    fase: acak(0, Math.PI * 2),
    warna: WARNA[Math.floor(Math.random() * WARNA.length)],
    umur: 1,
  };
}

interface Props {
  suasana: Suasana;
  percik: number;
  /** Titik asal percikan dalam kanvas (0–1) */
  asal: { x: number; y: number };
  /** Posisi kursor dalam kanvas (px), null bila di luar */
  kursor: RefObject<{ x: number; y: number } | null>;
  jalan: boolean;
}

export function DebuEmas({ suasana, percik, asal, kursor, jalan }: Props) {
  const butir = useRef<Butir[]>([]);
  const percikan = useRef<Butir[]>([]);
  const percikLalu = useRef(percik);

  const ref = useKanvas((ctx, w, h, dt) => {
    const jumlah = Math.round(Math.min(90, Math.max(30, (w * h) / 4200)));
    while (butir.current.length < jumlah) butir.current.push(butirBaru(w, h, false));
    butir.current.length = jumlah;

    if (percik !== percikLalu.current) {
      percikLalu.current = percik;
      for (let i = 0; i < 38; i++) {
        const sudut = acak(0, Math.PI * 2);
        const laju = acak(1.2, 4.2);
        percikan.current.push({ ...butirBaru(w, h, false), x: asal.x * w, y: asal.y * h, vx: Math.cos(sudut) * laju, vy: Math.sin(sudut) * laju - 1.2 });
      }
    }

    const deras = suasana === 'bicara' ? 2.6 : 1;
    const terang = suasana === 'tenang' ? 0.7 : 0.95;
    const k = kursor.current;
    // Pusat putaran saat berpikir: sekitar kepala maskot
    const cx = w * 0.5;
    const cy = h * 0.3;
    ctx.globalCompositeOperation = 'lighter';

    for (const b of butir.current) {
      b.fase += 0.035 * dt;
      if (suasana === 'berpikir') {
        const dx = b.x - cx;
        const dy = (b.y - cy) * 1.5;
        const jari = Math.hypot(dx, dy);
        const sudut = Math.atan2(dy, dx) + 0.018 * dt;
        const jariBaru = jari + (55 + b.r * 38 - jari) * 0.03 * dt;
        b.x = cx + Math.cos(sudut) * jariBaru;
        b.y = cy + (Math.sin(sudut) * jariBaru) / 1.5;
      } else {
        b.x += (b.vx + Math.sin(b.fase) * 0.12) * dt;
        b.y += b.vy * deras * dt;
        if (b.y < -6) Object.assign(b, butirBaru(w, h, true));
      }
      if (k) {
        const dx = b.x - k.x;
        const dy = b.y - k.y;
        const d = Math.hypot(dx, dy);
        if (d < JARI_KURSOR && d > 0) {
          const dorong = (1 - d / JARI_KURSOR) * 2.4 * dt;
          b.x += (dx / d) * dorong;
          b.y += (dy / d) * dorong;
        }
      }
      const kedip = 0.4 + 0.6 * Math.abs(Math.sin(b.fase));
      ctx.fillStyle = `rgba(${b.warna},${kedip * terang})`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      if (b.r > 1.8) {
        ctx.fillStyle = `rgba(${b.warna},${0.1 * kedip * terang})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (const p of percikan.current) {
      p.vy += 0.07 * dt;
      p.vx *= 0.985;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.umur -= dt / 55;
      ctx.fillStyle = `rgba(${p.warna},${Math.max(0, p.umur)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    percikan.current = percikan.current.filter((p) => p.umur > 0);
    ctx.globalCompositeOperation = 'source-over';
  }, jalan);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-0 size-full" aria-hidden />;
}
