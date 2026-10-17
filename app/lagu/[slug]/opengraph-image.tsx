import { DATA } from '@/lib/konten';
import { kartuOg, UKURAN_OG } from '@/lib/server/kartu-og';
import { slug } from '@/lib/teks';

export const alt = 'Lirik lagu daerah Komering';
export const size = UKURAN_OG;
export const contentType = 'image/png';

export function generateStaticParams() {
  return [{ slug: slug(DATA.lagu.judul) }];
}

export default function Gambar() {
  return kartuOg({
    label: 'Lagu daerah Komering · lirik & terjemahan',
    judul: DATA.lagu.judul,
    sub: '“Kumoring dang lupa dipa juga”',
    isi: 'Komering, jangan lupa di mana pun berada.',
  });
}
