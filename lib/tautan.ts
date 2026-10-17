/* Alamat halaman mandiri (kata kamus, hidangan, lagu) — dipakai tautan & sitemap */
import { norm, slug } from './teks';

export const urlKata = (kata: string): string => `/kamus/${encodeURIComponent(norm(kata))}`;
export const urlHidangan = (nama: string): string => `/kuliner/${slug(nama)}`;
export const urlLagu = (judul: string): string => `/lagu/${slug(judul)}`;

/** Nilai segmen dinamis → teks asli. Next.js bisa menyerahkan segmen yang masih ter-encode. */
export function bacaSegmen(nilai: string): string {
  try {
    return decodeURIComponent(nilai);
  } catch {
    return nilai;
  }
}
