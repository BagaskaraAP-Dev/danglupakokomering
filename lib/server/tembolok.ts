/* Tembolok (cache) kecil di memori instance: pertanyaan & terjemahan yang sama tidak
   memakai kuota Gemini lagi selama instance fungsi masih hidup. */
export function buatTembolok<T>(maks = 300, umurMs = 6 * 60 * 60 * 1000) {
  const isi = new Map<string, { waktu: number; nilai: T }>();
  return {
    ambil(kunci: string): T | undefined {
      const x = isi.get(kunci);
      if (!x) return undefined;
      isi.delete(kunci);
      if (Date.now() - x.waktu > umurMs) return undefined;
      isi.set(kunci, x);
      return x.nilai;
    },
    simpan(kunci: string, nilai: T) {
      isi.set(kunci, { waktu: Date.now(), nilai });
      if (isi.size > maks) isi.delete(isi.keys().next().value as string);
    },
  };
}
