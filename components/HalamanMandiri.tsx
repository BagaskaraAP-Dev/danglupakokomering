/* Kerangka halaman mandiri (kata kamus, hidangan, lagu, sumber): kepala ringkas,
   isi selebar bacaan, dan kaki dengan tautan kembali ke bab di beranda. */
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { LogoBulat } from './Navbar';

export function HalamanMandiri({ children, kembali }: { children: ReactNode; kembali: { href: string; label: string } }) {
  return (
    <>
      <header className="border-b border-emas/20 bg-kayu-950/85">
        <nav className="mx-auto flex h-[4.5rem] max-w-5xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Navigasi">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Dang Lupa ko Komering — ke beranda">
            <LogoBulat ukuran="w-10 h-10" />
            <span className="hidden font-display text-lg font-bold text-gading sm:inline">
              Dang Lupa ko <span className="text-emas-300">Komering</span>
            </span>
          </Link>
          <Link href={kembali.href} className="btn-kaca btn-kecil shrink-0">
            <ArrowLeft className="size-4" aria-hidden /> {kembali.label}
          </Link>
        </nav>
      </header>
      <main id="utama" className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:pt-14">
        {children}
      </main>
      <footer className="border-t border-emas/15 px-4 py-8 text-center text-xs text-pasir">
        <nav aria-label="Tautan kaki" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <Link href="/" className="hover:text-emas-300">
            Beranda
          </Link>
          <Link href="/#kamus" className="hover:text-emas-300">
            Kamus
          </Link>
          <Link href="/#kuliner" className="hover:text-emas-300">
            Kuliner
          </Link>
          <Link href="/#lagu" className="hover:text-emas-300">
            Lagu
          </Link>
          <Link href="/sumber" className="hover:text-emas-300">
            Sumber &amp; kredit
          </Link>
        </nav>
      </footer>
    </>
  );
}
