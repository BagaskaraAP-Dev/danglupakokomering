'use client';
/* Loop kanvas ringan: menyesuaikan ukuran & kerapatan piksel, dan hanya menggambar selama
   kanvas terlihat di layar dan tab aktif. Fungsi gambar dibaca lewat ref, jadi props terbaru
   langsung terpakai tanpa memulai ulang loop. */
import { useEffect, useRef } from 'react';

/** dt dalam satuan bingkai 60 fps (1 ≈ 16,7 ms), dibatasi 3 agar tidak melompat setelah jeda */
export type Gambar = (ctx: CanvasRenderingContext2D, lebar: number, tinggi: number, dt: number) => void;

export function useKanvas(gambar: Gambar, jalan = true) {
  const ref = useRef<HTMLCanvasElement>(null);
  const fungsi = useRef(gambar);
  useEffect(() => {
    fungsi.current = gambar;
  });

  useEffect(() => {
    const kanvas = ref.current;
    const ctx = kanvas?.getContext('2d');
    if (!kanvas || !ctx || !jalan) return;
    let lebar = 0;
    let tinggi = 0;
    let bingkai = 0;
    let lalu = 0;
    let terlihat = false;

    const ukur = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = kanvas.getBoundingClientRect();
      lebar = r.width;
      tinggi = r.height;
      kanvas.width = Math.round(lebar * dpr);
      kanvas.height = Math.round(tinggi * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const putar = (t: number) => {
      const dt = lalu ? Math.min((t - lalu) / 16.67, 3) : 1;
      lalu = t;
      ctx.clearRect(0, 0, lebar, tinggi);
      fungsi.current(ctx, lebar, tinggi, dt);
      bingkai = requestAnimationFrame(putar);
    };
    const mulai = () => {
      if (bingkai || !terlihat || document.hidden) return;
      lalu = 0;
      bingkai = requestAnimationFrame(putar);
    };
    const henti = () => {
      cancelAnimationFrame(bingkai);
      bingkai = 0;
    };

    const ro = new ResizeObserver(ukur);
    ro.observe(kanvas);
    ukur();
    const io = new IntersectionObserver((entri) => {
      terlihat = entri[entri.length - 1].isIntersecting;
      if (terlihat) mulai();
      else henti();
    });
    io.observe(kanvas);
    const tab = () => (document.hidden ? henti() : mulai());
    document.addEventListener('visibilitychange', tab);
    return () => {
      henti();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', tab);
    };
  }, [jalan]);

  return ref;
}
