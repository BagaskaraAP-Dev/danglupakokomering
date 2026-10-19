'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const MENU = [
  { id: 'penerjemah', label: 'Penerjemah' },
  { id: 'kamus', label: 'Kamus' },
  { id: 'sejarah', label: 'Sejarah' },
  { id: 'peta', label: 'Peta' },
  { id: 'marga', label: 'Marga' },
  { id: 'busana', label: 'Busana & Adat' },
  { id: 'kuliner', label: 'Kuliner' },
  { id: 'lagu', label: 'Lagu' },
  { id: 'jajuluk', label: 'Jajuluk' },
  { id: 'kuis', label: 'Kuis' },
] as const;

/** Logo bundar: hanya lingkaran marun-emas bermahkota dari logokomering.jpeg yang tampil */
export function LogoBulat({ ukuran = 'w-12 h-12' }: { ukuran?: string }) {
  return (
    <span className={`${ukuran} flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D4AF37]/40 bg-kayu-800`}>
      {/* Lingkaran logo ±78% tinggi gambar & sedikit di bawah tengah → diperbesar 1,3× lalu digeser naik */}
      <Image src="/logokomering.jpeg" alt="" width={1024} height={498} sizes="64px" loading="eager" className="h-full w-full -translate-y-1 scale-[1.3] object-cover" />
    </span>
  );
}

export function Navbar() {
  const [tergulir, setTergulir] = useState(false);
  const [aktif, setAktif] = useState<string | null>(null);
  const [buka, setBuka] = useState(false);

  useEffect(() => {
    const cek = () => setTergulir(window.scrollY > 24);
    cek();
    window.addEventListener('scroll', cek, { passive: true });
    return () => window.removeEventListener('scroll', cek);
  }, []);

  // Sorot menu bab yang sedang berada di tengah layar
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setAktif(e.target.id === 'beranda' ? null : e.target.id);
      }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ['beranda', ...MENU.map((m) => m.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!buka) return;
    const tutup = (e: KeyboardEvent) => e.key === 'Escape' && setBuka(false);
    window.addEventListener('keydown', tutup);
    return () => window.removeEventListener('keydown', tutup);
  }, [buka]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        tergulir || buka
          ? 'border-emas/20 bg-kayu-950/80 shadow-[0_12px_32px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl'
          : 'border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Navigasi utama">
        <a href="#beranda" className="flex shrink-0 items-center gap-3" aria-label="Dang Lupa ko Komering — ke beranda">
          <LogoBulat />
          <span className="leading-[1.15]">
            <span className="block text-[0.72rem] font-medium tracking-[0.2em] text-white">DANG LUPA KO</span>
            <span className="block text-lg font-extrabold tracking-[0.08em] text-[#D4AF37]">KOMERING</span>
          </span>
        </a>

        <ul className="hidden items-center gap-0.5 xl:flex">
          {MENU.map((m) => (
            <li key={m.id}>
              <a
                href={`#${m.id}`}
                aria-current={aktif === m.id ? 'true' : undefined}
                className={`relative isolate block rounded-full px-3 py-2 text-[0.84rem] font-semibold transition-colors ${
                  aktif === m.id ? 'text-emas-200' : 'text-gading/70 hover:text-gading'
                }`}
              >
                {aktif === m.id && (
                  <motion.span
                    layoutId="pil-nav-aktif"
                    className="absolute inset-0 -z-10 rounded-full border border-emas/35 bg-emas/10 shadow-[inset_0_1px_0_rgba(253,251,247,0.08)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {m.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="ikon-btn xl:hidden"
          aria-label={buka ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={buka}
          aria-controls="menu-seluler"
          onClick={() => setBuka((b) => !b)}
        >
          {buka ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {buka && (
          <motion.div
            id="menu-seluler"
            className="overflow-hidden xl:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <ul className="permukaan-kuat mx-4 mb-4 grid grid-cols-2 gap-1 rounded-2xl p-3 sm:grid-cols-3">
              {MENU.map((m) => (
                <li key={m.id}>
                  <a
                    href={`#${m.id}`}
                    onClick={() => setBuka(false)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                      aktif === m.id ? 'bg-emas/10 text-emas-200' : 'text-gading/75 hover:bg-white/5 hover:text-gading'
                    }`}
                  >
                    {m.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
