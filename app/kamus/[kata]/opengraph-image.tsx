import { DATA } from '@/lib/konten';
import { dataKata } from '@/lib/server/kamus-halaman';
import { kartuOg, UKURAN_OG } from '@/lib/server/kartu-og';

export const alt = 'Arti kata dalam Kamus Basa Kumoring';
export const size = UKURAN_OG;
export const contentType = 'image/png';

// Dibuat saat pertama diminta lalu disimpan, sama seperti halamannya
export function generateStaticParams() {
  return [];
}

export default async function Gambar({ params }: { params: Promise<{ kata: string }> }) {
  const d = dataKata((await params).kata);
  if (!d) return kartuOg({ label: 'Kamus Basa Kumoring', judul: 'Kata tidak ditemukan' });
  const e = d.entri[0];
  const contoh = d.entri.find((x) => x.contoh.length)?.contoh[0];
  return kartuOg({
    label: `Kamus Basa Kumoring · ${DATA.kelasKata[e.kelas] ?? 'kata'}`,
    judul: d.kata,
    sub: d.entri.map((x) => x.arti).join('; '),
    isi: contoh ? `“${contoh[0]}” — ${contoh[1]}` : undefined,
  });
}
