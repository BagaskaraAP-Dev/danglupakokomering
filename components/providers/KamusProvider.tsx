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

  useEffect(() => {
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
  }, []);

  const bukaKamus = useCallback((kata: string) => {
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
  }), [data, status, permintaan, bukaKamus]);

  return <KamusContext.Provider value={nilai}>{children}</KamusContext.Provider>;
}
