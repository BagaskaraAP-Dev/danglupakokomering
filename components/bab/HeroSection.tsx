import type { CSSProperties } from 'react';
import { Languages, MapPin } from 'lucide-react';
import Link from 'next/link';
import { KAMUS_META } from '@/lib/kamus';
import { DATA } from '@/lib/konten';
import { MascotShowcase } from '../maskot/MascotShowcase';
import { StatCounter } from '../ui/StatCounter';

/* Hero dirender di server: judul & teks langsung ada di HTML dan terlihat sejak cat
   pertama. Di HP urutannya judul → maskot → isi, supaya Raka & Ratih tampil di layar
   pertama; di desktop maskot menempati kolom kanan. */
export function HeroSection() {
  return (
    <section id="beranda" className="relative overflow-hidden pb-16 pt-24 lg:pb-24 lg:pt-36">
      <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-7 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="geser-masuk lg:col-start-1 lg:row-start-1 lg:self-end">
          <h1 className="font-display text-5xl font-extrabold leading-[1.03] text-gading sm:text-6xl lg:text-7xl">
            Dang Lupa ko <span className="teks-emas-kilau">Komering</span>
          </h1>
          <p className="mt-3 font-display text-xl italic text-emas-300 lg:mt-5">“Jangan lupakan Komering.”</p>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <MascotShowcase />
        </div>

        <div className="geser-masuk space-y-6 lg:col-start-1 lg:row-start-2 lg:self-start" style={{ '--tunda': '0.08s' } as CSSProperties}>
          <p className="max-w-xl text-lg leading-relaxed text-gading/75">
            Kenali sejarah, asal-usul, adat pernikahan, lagu daerah, makanan khas, dan wilayah di sepanjang Sungai Komering, hingga
            terjemahan <strong className="text-emas-200">Basa Kumoring</strong> bersama pemandu virtual{' '}
            <strong className="text-emas-200">Raka &amp; Ratih</strong>.
          </p>

          {/* Link (bukan <a>) agar lompatan ke #bab tercatat di router dan tombol Back tetap memulihkan halaman.
              prefetch={false}: tujuannya bab di halaman yang sama. Tombol diam (tanpa efek magnetik): dulu tombol
              bergeser mengikuti kursor sampai ±30 px dan menabrak tombol di sebelahnya */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="#penerjemah" prefetch={false} className="btn-emas">
              <Languages className="size-[1.1rem]" aria-hidden />
              Coba Penerjemah
            </Link>
            <Link href="#peta" prefetch={false} className="btn-kaca">
              <MapPin className="size-[1.1rem]" aria-hidden />
              Jelajahi Peta &amp; Budaya
            </Link>
          </div>

          <dl className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
            <StatCounter label="Kata di kamus" nilai={KAMUS_META.jumlahKata} />
            <StatCounter label="Contoh kalimat" nilai={KAMUS_META.jumlahContoh} />
            <StatCounter label="Kebuayan/marga" nilai={DATA.marga.length} />
            <StatCounter label="Kabupaten" nilai={4} />
          </dl>
        </div>
      </div>
    </section>
  );
}
