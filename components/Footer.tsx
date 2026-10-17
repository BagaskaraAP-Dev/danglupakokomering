'use client';

import { DATA } from '@/lib/konten';
import { fmtAngka } from '@/lib/teks';
import { LogoBulat, MENU } from './Navbar';
import { useKamus } from './providers/KamusProvider';
import { Tumpal } from './ui/Tumpal';

export function Footer() {
  const { meta } = useKamus();
  return (
    <footer className="pb-10 pt-4">
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
            Karya untuk <strong className="text-emas-300">{DATA.meta.acara}</strong> bertema <em>“{DATA.meta.tema}”</em>. Seluruh fitur AI
            berjalan di browser — tanpa server, tanpa data pribadi yang dikirim.
          </p>
        </div>
        <nav aria-label="Jelajahi">
          <p className="eyebrow">Jelajahi</p>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-gading/75">
            {MENU.map((m) => (
              <li key={m.id}>
                <a className="hover:text-emas-300" href={`#${m.id}`}>
                  {m.label}
                </a>
              </li>
            ))}
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
