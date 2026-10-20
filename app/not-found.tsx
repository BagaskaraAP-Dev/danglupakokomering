import type { Metadata } from 'next';
import Link from 'next/link';
import { HalamanMandiri } from '@/components/tata-letak/HalamanMandiri';
import { Mahkota } from '@/components/ui/Mahkota';

export const metadata: Metadata = {
  title: 'Halaman tidak ditemukan',
};

/* Halaman 404 untuk alamat yang tidak ada dan kata yang belum tercatat di kamus (/kamus/[kata]) */
export default function TidakDitemukan() {
  return (
    <HalamanMandiri kembali={{ href: '/', label: 'Beranda' }}>
      <div className="mx-auto max-w-2xl py-10 text-center sm:py-16">
        <Mahkota className="mx-auto w-28" />
        <p className="penanda-bab mt-6">404</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight text-gading sm:text-5xl">Halaman ini tidak ditemukan</h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-gading/75">
          Alamatnya mungkin salah ketik, atau kata yang kamu cari belum tercatat di Kamus Basa Kumoring. Coba cari lewat kamus atau susun
          kalimatnya di penerjemah.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/#kamus" className="btn-emas">
            Cari di kamus
          </Link>
          <Link href="/#penerjemah" className="btn-kaca">
            Buka penerjemah
          </Link>
        </div>
      </div>
    </HalamanMandiri>
  );
}
