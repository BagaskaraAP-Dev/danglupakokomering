import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DATA } from '@/lib/konten';
import { kartuOg, UKURAN_OG } from '@/lib/server/kartu-og';
import { slug } from '@/lib/teks';

export const alt = 'Kuliner khas Komering';
export const size = UKURAN_OG;
export const contentType = 'image/png';

export function generateStaticParams() {
  return DATA.kuliner.map((h) => ({ slug: slug(h.nama) }));
}

export default async function Gambar({ params }: { params: Promise<{ slug: string }> }) {
  const s = (await params).slug;
  const h = DATA.kuliner.find((x) => slug(x.nama) === s);
  if (!h) return kartuOg({ label: 'Kuliner Komering', judul: 'Hidangan tidak ditemukan' });
  // Dibuat saat build (semua slug statis), jadi foto dibaca langsung dari public/
  const foto = await readFile(join(process.cwd(), 'public', h.foto));
  return kartuOg({
    label: `Kuliner Komering · ${h.jenis}`,
    judul: h.nama,
    sub: h.alias,
    isi: h.teaser,
    foto: `data:image/jpeg;base64,${foto.toString('base64')}`,
  });
}
