'use client';
/* Suara peramban (Web Speech API, id-ID) untuk sapaan Raka & Ratih, terjemahan,
   entri kamus, dan cerita. Basa Kumoring belum punya suara TTS sendiri; suara
   Bahasa Indonesia dipakai karena ejaannya fonetis. Tidak memuat file audio apa pun. */
import { useSyncExternalStore } from 'react';

export type JenisSuara = 'pria' | 'wanita' | 'umum';

interface OpsiUcap {
  /** Id unik agar komponen tahu teks mana yang sedang dibacakan */
  id?: string;
  rate?: number;
  pitch?: number;
  jenis?: JenisSuara;
  mulai?: () => void;
  /** Dipanggil di tiap batas kata: indeks karakter di dalam teks */
  batas?: (indeksKarakter: number) => void;
  selesai?: () => void;
}

let aktif: string | null = null;
/* Nomor ujaran terakhir: ujaran lama yang dibatalkan tidak boleh menghapus status ujaran baru */
let urutan = 0;
const pendengar = new Set<() => void>();
const umumkan = () => pendengar.forEach((f) => f());
const setAktif = (id: string | null) => {
  aktif = id;
  umumkan();
};

const RE_PRIA = /ardi|andika|pria|laki|\bmale\b|\bman\b/i;
const RE_WANITA = /gadis|damayanti|wanita|perempuan|female|woman/i;
const RE_NATURAL = /natural|neural|online|premium|enhanced/i;

let siap = false;
function pastikanSiap(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  if (!siap) {
    siap = true;
    // Chrome memuat daftar suara secara asinkron; panggilan ini memicu pemuatannya lebih awal
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', () => window.speechSynthesis.getVoices());
  }
  return true;
}

/** Pilih suara Indonesia terbaik untuk jenis yang diminta; `cocok` = jenisnya benar-benar sesuai */
function pilihSuara(jenis: JenisSuara): { suara: SpeechSynthesisVoice | null; cocok: boolean } {
  const semua = window.speechSynthesis.getVoices();
  const indo = semua.filter((v) => /^id[-_]/i.test(v.lang));
  const pool = indo.length ? indo : semua.filter((v) => /^ms[-_]/i.test(v.lang));
  if (!pool.length) return { suara: null, cocok: false };
  const sesuai = (v: SpeechSynthesisVoice) =>
    jenis === 'pria' ? RE_PRIA.test(v.name) : jenis === 'wanita' ? RE_WANITA.test(v.name) || !RE_PRIA.test(v.name) : true;
  const nilai = (v: SpeechSynthesisVoice) => (sesuai(v) ? 4 : 0) + (RE_NATURAL.test(v.name) ? 2 : 0) + (v.localService ? 0 : 1);
  const terbaik = [...pool].sort((a, b) => nilai(b) - nilai(a))[0];
  return { suara: terbaik, cocok: jenis === 'umum' || sesuai(terbaik) };
}

export const suara = {
  /** Apakah peramban mendukung Text-to-Speech */
  didukung: (): boolean => pastikanSiap(),

  /** Bacakan teks. Mengembalikan false (tanpa pesan apa pun) bila peramban tidak mendukung. */
  ucapkan(teks: string, { id = 'umum', rate = 0.92, pitch, jenis = 'umum', mulai, batas, selesai }: OpsiUcap = {}): boolean {
    if (!pastikanSiap()) return false;
    const synth = window.speechSynthesis;
    synth.cancel();
    setAktif(null);
    if (!teks) return true;

    const { suara: v, cocok } = pilihSuara(jenis);
    const u = new SpeechSynthesisUtterance(teks);
    u.lang = v?.lang ?? 'id-ID';
    if (v) u.voice = v;
    u.rate = rate;
    // Tanpa suara pria Indonesia, nada diturunkan agar Raka tetap terdengar seperti laki-laki
    u.pitch = pitch ?? (jenis === 'pria' ? (cocok ? 1 : 0.72) : jenis === 'wanita' ? 1.1 : 1.02);

    const nomor = ++urutan;
    let usai = false;
    const tutup = () => {
      if (usai) return;
      usai = true;
      if (nomor === urutan) setAktif(null);
      selesai?.();
    };
    u.onstart = () => mulai?.();
    u.onboundary = (e) => {
      if (e.name === 'word' || e.name === undefined) batas?.(e.charIndex);
    };
    u.onend = tutup;
    u.onerror = tutup;
    setAktif(id);
    synth.speak(u);
    return true;
  },

  berhenti() {
    urutan++;
    if (pastikanSiap()) window.speechSynthesis.cancel();
    setAktif(null);
  },
};

const langganan = (f: () => void) => {
  pendengar.add(f);
  return () => {
    pendengar.delete(f);
  };
};

/** true selama teks dengan id ini sedang dibacakan */
export function useSedangBicara(id: string): boolean {
  return useSyncExternalStore(langganan, () => aktif === id, () => false);
}

/** Id teks yang sedang dibacakan, atau null */
export function useBacaanAktif(): string | null {
  return useSyncExternalStore(langganan, () => aktif, () => null);
}
