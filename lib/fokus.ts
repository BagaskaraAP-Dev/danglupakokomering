'use client';
/* Perangkap fokus untuk dialog modal (laci obrolan, lirik layar penuh): selama dialog
   terbuka, Tab dan Shift+Tab berputar di dalam dialog dan tidak lari ke halaman di belakangnya. */
import { useEffect, type RefObject } from 'react';

const BISA_FOKUS =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useJebakFokus(ref: RefObject<HTMLElement | null>, aktif: boolean) {
  useEffect(() => {
    if (!aktif) return;
    const tekan = (e: KeyboardEvent) => {
      const wadah = ref.current;
      if (e.key !== 'Tab' || !wadah) return;
      // getClientRects: elemen tersembunyi tidak ikut, elemen di dalam wadah position:fixed tetap ikut
      const daftar = [...wadah.querySelectorAll<HTMLElement>(BISA_FOKUS)].filter((el) => el.getClientRects().length > 0);
      if (!daftar.length) {
        e.preventDefault();
        wadah.focus();
        return;
      }
      const pertama = daftar[0];
      const terakhir = daftar[daftar.length - 1];
      const kini = document.activeElement;
      if (!wadah.contains(kini)) {
        e.preventDefault();
        (e.shiftKey ? terakhir : pertama).focus();
      } else if (e.shiftKey && (kini === pertama || kini === wadah)) {
        e.preventDefault();
        terakhir.focus();
      } else if (!e.shiftKey && kini === terakhir) {
        e.preventDefault();
        pertama.focus();
      }
    };
    document.addEventListener('keydown', tekan);
    return () => document.removeEventListener('keydown', tekan);
  }, [ref, aktif]);
}
