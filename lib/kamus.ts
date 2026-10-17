/* =============================================================================
   Kamus Basa Kumoring — dimuat dari public/data/kamus.json
   (dibangun dari data/kamus_komering.json oleh tools/build-kamus.cjs)
   ============================================================================= */
import meta from '@/data/kamus-meta.json';
import { norm } from './teks';

export type Contoh = [string, string];

/** [idKata, kata, kelas, arti, contoh, kataDasar, varian, lihat, catatan] — kolom kosong di akhir dipangkas */
export type EntriMentah = [string, string, string?, string?, Contoh[]?, string?, string[]?, string?, string?];

export interface KamusMeta {
  sumber: string;
  dibuat: string;
  jumlahKata: number;
  jumlahKataDasar: number;
  jumlahTurunan: number;
  jumlahContoh: number;
}

export interface KamusMentah {
  meta: KamusMeta;
  entri: EntriMentah[];
  /** [kataKomering, kataIndonesia, skorDice, jumlahMunculBersama] */
  selaras: [string, string, number, number][];
  /** [kataKomering, jumlahKalimat] */
  frekuensi: [string, number][];
  sensitif: string[];
}

export interface Entri {
  id: string;
  kata: string;
  kelas: string;
  arti: string;
  contoh: Contoh[];
  induk: string;
  varian: string[];
  lihat: string;
  /** Terisi bila artinya masih dugaan (perlu verifikasi penutur asli) */
  catatan: string;
  sensitif: boolean;
}

export interface Kamus {
  meta: KamusMeta;
  entri: Entri[];
  /** Entri yang layak tampil acak (kuis, kata acak, kata hari ini) */
  layakAcak: Entri[];
  selaras: KamusMentah['selaras'];
  frek: Map<string, number>;
  cari: (kata: string) => Entri[];
  id: (id: string) => Entri | undefined;
  turunanDari: (kata: string) => Entri[];
}

/** Angka ringkas kamus yang tersedia sejak build (untuk statistik hero) */
export const KAMUS_META: KamusMeta = meta;

export function bangunKamus(src: KamusMentah): Kamus {
  const sensitif = new Set(src.sensitif);
  const entri: Entri[] = src.entri.map(([id, kata, kelas = '', arti = '', contoh = [], induk = '', varian = [], lihat = '', catatan = '']) => ({
    id, kata, kelas, arti, contoh, induk, varian, lihat, catatan, sensitif: sensitif.has(id),
  }));

  const perKata = new Map<string, Entri[]>();
  const perId = new Map<string, Entri>();
  const turunan = new Map<string, Entri[]>();
  const tambah = (m: Map<string, Entri[]>, k: string, v: Entri) => m.set(k, [...(m.get(k) ?? []), v]);
  entri.forEach((e) => {
    perId.set(e.id, e);
    [e.kata, ...e.varian].forEach((w) => tambah(perKata, norm(w), e));
    if (e.induk) tambah(turunan, norm(e.induk), e);
  });

  // Bukan turunan, punya contoh, artinya sudah pasti, dan kata itu tidak punya arti sensitif (mis. homonim)
  const kataSensitif = new Set(entri.filter((e) => e.sensitif).map((e) => norm(e.kata)));
  const layakAcak = entri.filter((e) => !kataSensitif.has(norm(e.kata)) && !e.induk && !e.catatan && e.contoh.length > 0);

  return {
    meta: { ...src.meta, jumlahKata: entri.length },
    entri,
    layakAcak,
    selaras: src.selaras,
    frek: new Map(src.frekuensi),
    cari: (w) => perKata.get(norm(w)) ?? [],
    id: (id) => perId.get(id),
    turunanDari: (w) => turunan.get(norm(w)) ?? [],
  };
}
