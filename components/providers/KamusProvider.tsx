'use client';
/* Memuat public/data/kamus.json sekali, membangun indeks kamus & mesin penerjemah,
   lalu membagikannya ke semua bagian. bukaKamus(kata) dipakai tombol kata di
   seluruh halaman untuk membuka entri itu di bagian Kamus. */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { bangunKamus, KAMUS_META, type Kamus, type KamusMentah, type KamusMeta } from '@/lib/kamus';
import { DATA } from '@/lib/konten';
import { buatPenerjemah, type Penerjemah } from '@/lib/penerjemah';

interface NilaiKamus {
  kamus: Kamus | null;
  penerjemah: Penerjemah | null;
  status: 'memuat' | 'siap' | 'gagal';
  meta: KamusMeta;
  /** Permintaan terakhir untuk membuka kata di bagian Kamus */
  permintaan: { kata: string; n: number } | null;
  bukaKamus: (kata: string) => void;
  /** Minta kamus dimuat sekarang (mis. saat chat dibuka) */
  muat: () => void;
}

const KamusContext = createContext<NilaiKamus | null>(null);

export function useKamus(): NilaiKamus {
  const v = useContext(KamusContext);
  if (!v) throw new Error('useKamus harus dipakai di dalam <KamusProvider>');
  return v;
}

export function KamusProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<{ kamus: Kamus; penerjemah: Penerjemah } | null>(null);
  const [status, setStatus] = useState<NilaiKamus['status']>('memuat');
  const [permintaan, setPermintaan] = useState<NilaiKamus['permintaan']>(null);

  const [diminta, setDiminta] = useState(false);
  const muat = useCallback(() => setDiminta(true), []);

  // Saat kamus siap, bab Penerjemah, Kamus, Busana, Kuliner, dan Lagu memanjang (hingga ±1.600 px di HP).
  // Lompatan ke #bab yang terjadi sebelum itu bisa mendarat jauh dari tujuan, jadi lompatan terakhir
  // dicatat dan diluruskan sekali setelah kamus siap, kecuali pengunjung sudah menggulir sendiri.
  const lompatan = useRef<{ id: string; waktu: number } | null>(null);
  useEffect(() => {
    const catat = (id: string) => {
      if (id) lompatan.current = { id, waktu: Date.now() };
    };
    if (location.hash) catat(decodeURIComponent(location.hash.slice(1)));
    const klik = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href*="#"]');
      if (!(a instanceof HTMLAnchorElement) || a.pathname !== location.pathname) return;
      catat(decodeURIComponent(a.hash.slice(1)));
    };
    const batal = () => {
      lompatan.current = null;
    };
    document.addEventListener('click', klik, true);
    window.addEventListener('wheel', batal, { passive: true });
    window.addEventListener('touchmove', batal, { passive: true });
    return () => {
      document.removeEventListener('click', klik, true);
      window.removeEventListener('wheel', batal);
      window.removeEventListener('touchmove', batal);
    };
  }, []);

  // Kamus (±160 KB + pengindeksan) dimuat saat pengunjung mulai berinteraksi, atau saat peramban
  // senggang setelah halaman selesai dimuat: tidak bersaing dengan tampilan layar pertama, tetapi
  // sudah siap sebelum pengunjung sampai di kolom pencarian kamus
  useEffect(() => {
    if (diminta) return;
    const peristiwa = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const;
    const mulai = () => setDiminta(true);
    peristiwa.forEach((p) => window.addEventListener(p, mulai, { once: true, passive: true }));
    let batalSenggang = () => {};
    const senggang = () => {
      // Safari belum punya requestIdleCallback
      if (typeof window.requestIdleCallback === 'function') {
        const id = window.requestIdleCallback(mulai, { timeout: 3000 });
        batalSenggang = () => window.cancelIdleCallback(id);
      } else {
        const id = window.setTimeout(mulai, 1500);
        batalSenggang = () => window.clearTimeout(id);
      }
    };
    if (document.readyState === 'complete') senggang();
    else window.addEventListener('load', senggang, { once: true });
    if (window.scrollY > 0 || location.hash) mulai();
    return () => {
      peristiwa.forEach((p) => window.removeEventListener(p, mulai));
      window.removeEventListener('load', senggang);
      batalSenggang();
    };
  }, [diminta]);

  useEffect(() => {
    if (!diminta) return;
    let batal = false;
    fetch('/data/kamus.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<KamusMentah>;
      })
      .then((raw) => {
        if (batal) return;
        const kamus = bangunKamus(raw);
        setData({ kamus, penerjemah: buatPenerjemah(kamus, DATA) });
        setStatus('siap');
      })
      .catch((err: unknown) => {
        console.error('Kamus gagal dimuat:', err);
        if (!batal) setStatus('gagal');
      });
    return () => {
      batal = true;
    };
  }, [diminta]);

  useEffect(() => {
    const l = lompatan.current;
    if (!data || !l) return;
    lompatan.current = null;
    if (Date.now() - l.waktu > 5000) return;
    const halus = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(l.id)?.scrollIntoView({ behavior: halus ? 'smooth' : 'auto', block: 'start' });
  }, [data]);

  const bukaKamus = useCallback((kata: string) => {
    setDiminta(true);
    lompatan.current = { id: 'kamus', waktu: Date.now() };
    setPermintaan((p) => ({ kata, n: (p?.n ?? 0) + 1 }));
    const halus = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('kamus')?.scrollIntoView({ behavior: halus ? 'smooth' : 'auto', block: 'start' });
  }, []);

  const nilai = useMemo<NilaiKamus>(() => ({
    kamus: data?.kamus ?? null,
    penerjemah: data?.penerjemah ?? null,
    status,
    meta: data?.kamus.meta ?? KAMUS_META,
    permintaan,
    bukaKamus,
    muat,
  }), [data, status, permintaan, bukaKamus, muat]);

  return <KamusContext.Provider value={nilai}>{children}</KamusContext.Provider>;
}
