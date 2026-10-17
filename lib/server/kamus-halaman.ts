/* Data halaman /kamus/[kata]: semua entri untuk satu kata + kata berarti serupa */
import type { Entri } from '@/lib/kamus';
import { bacaSegmen } from '@/lib/tautan';
import { glosa, norm } from '@/lib/teks';
import { ambilBasis } from './basis';

export interface DataKata {
  kata: string;
  entri: Entri[];
  turunan: Entri[];
  serupa: Entri[];
}

export function dataKata(segmen: string): DataKata | null {
  const { kamus, perGlosa } = ambilBasis();
  const kata = norm(bacaSegmen(segmen));
  const entri = kamus.cari(kata).filter((e) => !e.sensitif);
  if (!entri.length) return null;
  const ids = new Set(entri.map((e) => e.id));
  const turunan = entri.flatMap((e) => (e.induk ? [] : kamus.turunanDari(e.kata))).filter((e) => !e.sensitif && !ids.has(e.id));
  const serupa = [
    ...new Map(
      entri
        .flatMap((e) => glosa(e.arti))
        .flatMap((g) => perGlosa.get(g) ?? [])
        .filter((e) => !ids.has(e.id) && norm(e.kata) !== kata)
        .map((e) => [norm(e.kata), e]),
    ).values(),
  ].slice(0, 8);
  return { kata: entri[0].kata, entri, turunan, serupa };
}

/** Satu kalimat ringkas untuk deskripsi meta & gambar pratinjau */
export function ringkasKata(d: DataKata): string {
  const arti = [...new Set(d.entri.map((e) => e.arti))].join('; ');
  const contoh = d.entri.find((e) => e.contoh.length)?.contoh[0];
  return `Arti “${d.kata}” dalam Basa Kumoring (bahasa Komering): ${arti}.${contoh ? ` Contoh: “${contoh[0]}” — ${contoh[1]}.` : ''}`;
}
