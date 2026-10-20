import type { MetadataRoute } from 'next';
import { DATA } from '@/lib/konten';
import { ambilBasis } from '@/lib/server/basis';
import { SITUS } from '@/lib/situs';
import { urlHidangan, urlKata, urlLagu } from '@/lib/tautan';
import { norm } from '@/lib/teks';

export default function sitemap(): MetadataRoute.Sitemap {
  const { kamus } = ambilBasis();
  const kata = [...new Set(kamus.entri.filter((e) => !e.sensitif).map((e) => norm(e.kata)))];
  return [
    { url: SITUS, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITUS}/sumber`, priority: 0.4 },
    { url: `${SITUS}${urlLagu(DATA.lagu.judul)}`, priority: 0.7 },
    ...DATA.kuliner.map((h) => ({ url: `${SITUS}${urlHidangan(h.nama)}`, priority: 0.7 })),
    ...kata.map((k) => ({ url: `${SITUS}${urlKata(k)}`, priority: 0.5 })),
  ];
}
