/* Kontrak & pemanggil endpoint Gemini (/api/chat, /api/translate) dari browser.
   Bila endpoint gagal, pemanggil mengembalikan null dan komponen memakai mesin lokal. */
import type { Pembicara } from './chatbot';
import type { AksiChat } from './konten';
import type { Bahasa } from './penerjemah';

export interface PesanRiwayat {
  oleh: Pembicara | 'pengguna';
  teks: string;
}

export interface JawabanAi {
  oleh: Pembicara;
  teks: string;
  aksi: AksiChat[];
}

export interface TerjemahanAi {
  terjemahan: string;
  catatan: string;
  /** Kata hasil Gemini yang tidak ditemukan di kamus — perlu diperiksa */
  kataLuarKamus: string[];
}

export type HasilAi<T> = { ok: true; data: T } | { ok: false; status: number; galat: string };

async function kirim<T>(url: string, isi: unknown, signal?: AbortSignal): Promise<HasilAi<T>> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(isi),
      signal: signal ?? AbortSignal.timeout(30_000),
    });
    const data = (await res.json().catch(() => ({}))) as T & { galat?: string };
    if (!res.ok) return { ok: false, status: res.status, galat: data.galat ?? `HTTP ${res.status}` };
    return { ok: true, data };
  } catch (err) {
    return { ok: false, status: 0, galat: err instanceof Error ? err.message : 'Jaringan bermasalah' };
  }
}

export const tanyaAi = (pesan: string, riwayat: PesanRiwayat[], signal?: AbortSignal) =>
  kirim<JawabanAi>('/api/chat', { pesan, riwayat }, signal);

export const terjemahAi = (teks: string, dari: Bahasa, signal?: AbortSignal) =>
  kirim<TerjemahanAi>('/api/translate', { teks, dari }, signal);
