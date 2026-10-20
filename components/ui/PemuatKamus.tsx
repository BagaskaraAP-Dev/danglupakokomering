'use client';
/* Pemuat kamus: butir emas berhamburan lalu merangkai tulisan "Kamus Basa Kumoring" dan
   menyingkir dari kursor. Di sekelilingnya butir lepas melayang, terhubung benang tipis
   seperti tenunan (dan ke kursor bila dekat). Saat `selesai`, butir memencar dan memudar
   di atas kartu kata yang mulai tampil, lalu onHilang dipanggil.
   Gerak dikurangi: tulisan biasa tanpa animasi. */
import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, type PointerEvent } from 'react';
import { useKanvas } from './useKanvas';

const TULISAN = 'Kamus Basa Kumoring';
const BUBAR_MS = 750;
/** Sama dengan jeda animasi .tunda-muncul: pemuatan yang lebih singkat tidak pernah tampak */
const TUNDA_MS = 500;
const WARNA = ['229,193,88', '246,231,180', '212,175,55'];
const JARI_KURSOR = 55;
const JARAK_BENANG = 95;

interface Butir {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  r: number;
  fase: number;
  warna: string;
}

const acak = (a: number, b: number) => a + Math.random() * (b - a);
const warnaAcak = () => WARNA[Math.floor(Math.random() * WARNA.length)];

/** Titik-titik penyusun tulisan, diambil dari kanvas bantu (satu baris, atau dua bila sempit) */
function titikTulisan(lebar: number, tinggi: number, huruf: string): [number, number][] {
  const c = document.createElement('canvas');
  c.width = Math.ceil(lebar);
  c.height = Math.ceil(tinggi);
  const g = c.getContext('2d', { willReadFrequently: true });
  if (!g) return [];
  const pas = (teks: string, maks: number) => {
    g.font = `700 100px ${huruf}`;
    return Math.min(maks, (100 * lebar * 0.88) / g.measureText(teks).width);
  };
  g.fillStyle = '#000';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  let ukuran = pas(TULISAN, tinggi * 0.34);
  if (ukuran >= 30) {
    g.font = `700 ${ukuran}px ${huruf}`;
    g.fillText(TULISAN, lebar / 2, tinggi / 2);
  } else {
    ukuran = pas('Basa Kumoring', tinggi * 0.26);
    g.font = `700 ${ukuran}px ${huruf}`;
    g.fillText('Kamus', lebar / 2, tinggi / 2 - ukuran * 0.58);
    g.fillText('Basa Kumoring', lebar / 2, tinggi / 2 + ukuran * 0.58);
  }
  const data = g.getImageData(0, 0, c.width, c.height).data;
  let langkah = ukuran > 48 ? 4 : 3;
  let titik: [number, number][] = [];
  do {
    titik = [];
    for (let y = 0; y < c.height; y += langkah) {
      for (let x = 0; x < c.width; x += langkah) {
        if (data[(y * c.width + x) * 4 + 3] > 140) titik.push([x, y]);
      }
    }
    langkah++;
  } while (titik.length > 1700);
  return titik;
}

interface Props {
  selesai: boolean;
  onHilang: () => void;
  className?: string;
}

export function PemuatKamus({ selesai, onHilang, className = '' }: Props) {
  const diam = useReducedMotion() ?? false;
  const huruf = useRef<HTMLSpanElement>(null);
  const kursor = useRef<{ x: number; y: number } | null>(null);
  const tulisan = useRef<Butir[]>([]);
  const lepas = useRef<Butir[]>([]);
  const ukuranLalu = useRef('');
  const pecah = useRef(false);
  const lahir = useRef(0);

  // Huruf Playfair baru siap setelah fon dimuat: susun ulang titik tulisan
  useEffect(() => {
    lahir.current = performance.now();
    void document.fonts?.ready.then(() => {
      ukuranLalu.current = '';
    });
  }, []);

  // Kamus siap: butir memencar dulu bila pemuat sudah tampak, selain itu langsung hilang
  useEffect(() => {
    if (!selesai) return;
    const tampak = performance.now() - lahir.current >= TUNDA_MS;
    const t = setTimeout(onHilang, diam || !tampak ? 0 : BUBAR_MS);
    return () => clearTimeout(t);
  }, [selesai, diam, onHilang]);

  const ref = useKanvas((ctx, w, h, dt) => {
    const kunci = `${Math.round(w)}x${Math.round(h)}`;
    if (kunci !== ukuranLalu.current && !selesai) {
      ukuranLalu.current = kunci;
      const keluarga = huruf.current ? getComputedStyle(huruf.current).fontFamily : 'serif';
      const titik = titikTulisan(w, h, keluarga);
      const lama = tulisan.current;
      tulisan.current = titik.map(([tx, ty], i) => {
        const b = lama[i];
        return b
          ? { ...b, tx, ty }
          : { x: acak(0, w), y: acak(0, h), tx, ty, vx: 0, vy: 0, r: acak(0.8, 1.5), fase: acak(0, Math.PI * 2), warna: warnaAcak() };
      });
      const jumlahLepas = Math.round(Math.min(46, Math.max(18, (w * h) / 9000)));
      lepas.current = Array.from({ length: jumlahLepas }, () => ({
        x: acak(0, w), y: acak(0, h), tx: 0, ty: 0, vx: acak(-0.35, 0.35), vy: acak(-0.35, 0.35), r: acak(1, 2.2), fase: acak(0, 6), warna: warnaAcak(),
      }));
    }

    // Kamus siap: setiap butir terlontar menjauh dari tengah
    if (selesai && !pecah.current) {
      pecah.current = true;
      for (const b of [...tulisan.current, ...lepas.current]) {
        const sudut = Math.atan2(b.y - h / 2, b.x - w / 2) + acak(-0.4, 0.4);
        const laju = acak(2, 7);
        b.vx = Math.cos(sudut) * laju;
        b.vy = Math.sin(sudut) * laju;
      }
    }
    const k = kursor.current;
    ctx.globalCompositeOperation = 'lighter';

    for (const b of tulisan.current) {
      b.fase += 0.05 * dt;
      if (pecah.current) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.vx *= 0.97;
        b.vy *= 0.97;
        b.r = Math.max(0, b.r - 0.025 * dt);
      } else {
        b.x += (b.tx + Math.sin(b.fase) * 0.6 - b.x) * 0.085 * dt;
        b.y += (b.ty + Math.cos(b.fase) * 0.6 - b.y) * 0.085 * dt;
        if (k) {
          const dx = b.x - k.x;
          const dy = b.y - k.y;
          const d = Math.hypot(dx, dy);
          if (d < JARI_KURSOR && d > 0) {
            const dorong = (1 - d / JARI_KURSOR) * 6 * dt;
            b.x += (dx / d) * dorong;
            b.y += (dy / d) * dorong;
          }
        }
      }
      ctx.fillStyle = `rgba(${b.warna},${0.55 + 0.45 * Math.abs(Math.sin(b.fase))})`;
      ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    }

    // Butir lepas + benang tenun di antaranya
    const daftar = lepas.current;
    for (const b of daftar) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (pecah.current) b.r = Math.max(0, b.r - 0.03 * dt);
      else {
        if (b.x < 0 || b.x > w) b.vx *= -1;
        if (b.y < 0 || b.y > h) b.vy *= -1;
      }
    }
    ctx.lineWidth = 0.7;
    for (let i = 0; i < daftar.length; i++) {
      const a = daftar[i];
      if (a.r <= 0) continue;
      for (let j = i + 1; j < daftar.length; j++) {
        const b = daftar[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < JARAK_BENANG && b.r > 0) {
          ctx.strokeStyle = `rgba(229,193,88,${0.22 * (1 - d / JARAK_BENANG)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      if (k && !pecah.current) {
        const d = Math.hypot(a.x - k.x, a.y - k.y);
        if (d < JARAK_BENANG * 1.4) {
          ctx.strokeStyle = `rgba(246,231,180,${0.35 * (1 - d / (JARAK_BENANG * 1.4))})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(k.x, k.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${a.warna},0.7)`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }, !diam);

  const gerak = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    kursor.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <div
      className={`tunda-muncul ${className} ${selesai ? 'pointer-events-none' : ''}`}
      onPointerMove={gerak}
      onPointerLeave={() => (kursor.current = null)}
      aria-hidden
    >
      {/* Sumber nama fon untuk kanvas; juga tulisan pengganti saat gerak dikurangi */}
      <span
        ref={huruf}
        className={`font-display font-bold text-emas-300 ${diam && !selesai ? 'grid size-full place-items-center text-center text-3xl sm:text-4xl' : 'sr-only'}`}
      >
        {TULISAN}
      </span>
      {!diam && <canvas ref={ref} className="size-full" />}
    </div>
  );
}
