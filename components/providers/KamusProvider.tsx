'use client';
/* Memuat public/data/kamus.json sekali, membangun indeks kamus & mesin penerjemah,
   lalu membagikannya ke semua bagian. bukaKamus(kata) dipakai tombol kata di
   seluruh halaman untuk membuka entri itu di bagian Kamus. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
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

  // Kamus (±160 KB + pengindeksan) baru dimuat saat pengunjung mulai berinteraksi,
  // agar tidak bersaing dengan tampilan layar pertama
  useEffect(() => {
    if (diminta) return;
    const peristiwa = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const;
    const mulai = () => setDiminta(true);
    peristiwa.forEach((p) => window.addEventListener(p, mulai, { once: true, passive: true }));
    if (window.scrollY > 0 || location.hash) mulai();
    return () => peristiwa.forEach((p) => window.removeEventListener(p, mulai));
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

  const bukaKamus = useCallback((kata: string) => {
    setDiminta(true);
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
