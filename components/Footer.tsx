'use client';

import Link from 'next/link';
import { DATA } from '@/lib/konten';
import { fmtAngka } from '@/lib/teks';
import { LogoBulat, MENU } from './Navbar';
import { useKamus } from './providers/KamusProvider';
import { Tumpal } from './ui/Tumpal';

export function Footer() {
  const { meta } = useKamus();
  return (
    // pb-28 di bawah lg: ruang untuk tombol "Tanya Raka & Ratih" agar baris terakhir tidak tertutup
    <footer className="pb-28 pt-4 lg:pb-10">
      <Tumpal balik />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <LogoBulat />
            <p className="font-display text-2xl font-bold text-gading">
              Dang Lupa ko <span className="teks-emas">Komering</span>
            </p>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-gading/75">
            Dari tanah Komering, untuk generasi hari ini. Dang Lupa ko Komering lahir agar bahasa dan budaya warisan leluhur tetap hidup,
            tidak hanya dikenang, tapi juga dipakai, dipelajari, dan dibanggakan. Lewat kamus, penerjemah, dan teman ngobrol berbasis AI,
            mengenal Komering kini terasa lebih dekat, lebih seru, dan selalu dalam genggaman.
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-gading/75">
            Dipersembahkan untuk <strong className="text-emas-300">{DATA.meta.acara}</strong> <em>“{DATA.meta.tema}”</em>.
          </p>
        </div>
        <nav aria-label="Jelajahi">
          <p className="eyebrow">Jelajahi</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 text-sm text-gading/75">
            {MENU.map((m) => (
              <li key={m.id}>
                <Link className="inline-flex min-h-11 items-center hover:text-emas-300" href={`#${m.id}`} prefetch={false}>
                  {m.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="inline-flex min-h-11 items-center hover:text-emas-300" href="/sumber">
                Sumber &amp; kredit
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <p className="eyebrow">Catatan Kurasi</p>
          <p className="mt-4 text-xs leading-relaxed text-pasir">
            Kosakata, istilah adat, dan kuliner bersumber dari Kamus Basa Kumoring ({fmtAngka(meta.jumlahKata)} kata). Sejarah dan wilayah
            disusun dari sumber umum dan tradisi lisan, dan dapat berbeda antar-marga. Lagu “Dang Lupa ko Komering” adalah lagu daerah
            Komering; terjemahannya bersifat bebas. Jajuluk adalah kreasi untuk edukasi.
          </p>
        </div>
      </div>
      <p className="mt-12 text-center text-xs text-pasir">© 2026 Dang Lupa ko Komering · Tabik pun, tarima kasih!</p>
    </footer>
  );
}
