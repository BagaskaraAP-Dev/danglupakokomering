/* Utilitas teks & angka yang dipakai mesin penerjemah, kamus, kuis, dan chatbot. */

/** Huruf kecil, NFKC, apostrof seragam, spasi dirapikan */
export const norm = (s: string): string =>
  String(s).toLowerCase().normalize('NFKC').replace(/[’`]/g, "'").replace(/\s+/g, ' ').trim();

export const pick = <T>(v: T | T[]): T => (Array.isArray(v) ? v[Math.floor(Math.random() * v.length)] : v);

export const clamp = (n: number, a: number, b: number): number => Math.min(b, Math.max(a, n));

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** FNV-1a: hash deterministik untuk generator jajuluk */
export function hashStr(s: string): number {
  let h = 2166136261;
  for (const ch of s) {
    h ^= ch.codePointAt(0) ?? 0;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Jarak Levenshtein dengan batas atas (berhenti lebih awal bila melebihi max) */
export function levenshtein(a: string, b: string, max = Infinity): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

export const fmtAngka = (n: number | undefined): string => Number(n || 0).toLocaleString('id-ID');

export function fmtWaktu(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Pecah arti kamus menjadi glosa: "mau, akan, suka" → [mau, akan, suka];
 *  "ahad (nama hari)" → [ahad]; "pakaian atau seluruh …" → [pakaian, seluruh …] */
export function glosa(arti: string): string[] {
  return String(arti)
    .replace(/\([^)]*\)/g, ' ')
    .split(/\s*(?:[,;/]|\s-\s|\batau\b)\s*/i)
    .map(norm)
    .filter((g) => g && g !== '-');
}

/** Arti ringkas untuk label tombol: glosa pertama yang bukan kata itu sendiri,
 *  dipotong sebelum "yang …" atau di kata ke-5 ("pelepah pinang yang sering …" → "pelepah pinang") */
export function artiSingkat(arti: string, kata = ''): string {
  const gs = glosa(arti);
  const g = gs.find((x) => x !== norm(kata)) || gs[0] || norm(arti);
  const kt = g.split(' ');
  const yang = kt.indexOf('yang');
  if (yang >= 2) return kt.slice(0, yang).join(' ');
  return kt.length > 5 ? `${kt.slice(0, 5).join(' ')}…` : g;
}

/** Huruf pertama kapital */
export const kapital = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** Ubah teks menjadi potongan nama file: "Payu kita liak!" → "payu-kita-liak" */
export const slug = (s: string): string => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
