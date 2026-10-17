/* =============================================================================
   AI PENERJEMAH — mesin NLP ringan yang berjalan di browser
   Pengetahuan:
   a) Kamus Basa Kumoring (kata dasar + turunan, arti Indonesia → glosa)
   b) Padanan kata fungsi hasil penyelarasan korpus contoh kalimat (skor Dice)
   c) Padanan berbukti dari lib/konten.ts
   Proses:
   1) Pencocokan frasa terpanjang (n-gram)
   2) Stemming Bahasa Indonesia (imbuhan me-, ber-, di-, -kan, -an, -nya, …)
   3) Akhiran: -nya ⇄ -na, -ku, -mu, -lah ⇄ -da
   4) Reduplikasi (jama-jama) dan pola "sangat X" → "X nihan"
   5) Koreksi ejaan dengan jarak Levenshtein
   6) Peringkat kandidat (ketepatan glosa + frekuensi korpus) & skor keyakinan
   ============================================================================= */
import type { Entri, Kamus } from './kamus';
import type { Konten } from './konten';
import { glosa, levenshtein, norm } from './teks';

export type Bahasa = 'id' | 'km';
export type JenisSegmen = 'exact' | 'same' | 'korpus' | 'stem' | 'fuzzy' | 'unknown' | 'punct';

export interface Segmen {
  src: string;
  out: string;
  type: JenisSegmen;
  ref?: Entri;
  base?: string;
  cap?: boolean;
}

export interface HasilTerjemahan {
  text: string;
  segs: Segmen[];
  /** 0–1, null bila tidak ada kata */
  conf: number | null;
}

export interface Penerjemah {
  translate: (text: string, from: Bahasa) => HasilTerjemahan;
  detect: (text: string) => Bahasa;
}

export const LABEL_BAHASA: Record<Bahasa, string> = { id: 'Bahasa Indonesia', km: 'Basa Kumoring' };

interface NilaiKamus {
  out: string;
  type?: JenisSegmen;
  ref?: Entri;
}
type Hit = { out: string; type: JenisSegmen; ref?: Entri; base?: string };

const BOBOT: Record<Exclude<JenisSegmen, 'punct'>, number> = { exact: 1, same: 0.9, korpus: 0.85, stem: 0.8, fuzzy: 0.6, unknown: 0 };
const SUFIKS: Record<Bahasa, [string, string][]> = {
  id: [['nya', 'na'], ['ku', 'ku'], ['mu', 'mu'], ['lah', 'da'], ['kah', ''], ['pun', '']],
  km: [['na', 'nya'], ['ku', 'ku'], ['mu', 'mu'], ['da', 'lah']],
};
const PREFIKS: [RegExp, (m: string) => string[]][] = [
  [/^meny([a-z]{3,})$/, (m) => [`s${m}`]],
  [/^meng([a-z]{3,})$/, (m) => [m, `k${m}`]],
  [/^mem([a-z]{3,})$/, (m) => [`p${m}`, m]],
  [/^men([a-z]{3,})$/, (m) => [`t${m}`, m]],
  [/^me([a-z]{3,})$/, (m) => [m]],
  [/^ber([a-z]{3,})$/, (m) => [m]],
  [/^be([a-z]{3,})$/, (m) => [m]],
  [/^di([a-z]{3,})$/, (m) => [m]],
  [/^ter([a-z]{3,})$/, (m) => [m]],
  [/^ke([a-z]{3,})$/, (m) => [m]],
  [/^se([a-z]{3,})$/, (m) => [m]],
  [/^pe([a-z]{3,})$/, (m) => [m]],
];
const TOKEN_RE = /[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*|[^\s\p{L}\p{N}]/gu;
// Arti kamus yang panjang diringkas ke intinya: "permisi kepada orang-orang yang …" → "permisi"
const PENGHUBUNG = /\s(?:kepada|yang|untuk|sambil|dengan|dari|karena|seperti|dalam|di|ke|pada|saat|ketika|agar)\s/;

function ringkas(g: string): string {
  if (g.split(' ').length <= 3) return g;
  const inti = g.split(PENGHUBUNG)[0];
  return inti.split(' ').length <= 4 ? inti : g.split(' ').slice(0, 3).join(' ');
}

const isCap = (w: string) => /^\p{Lu}/u.test(w);

export function buatPenerjemah(kamus: Kamus, konten: Pick<Konten, 'kataSama' | 'padanan'>): Penerjemah {
  const dict: Record<Bahasa, Map<string, NilaiKamus>> = { id: new Map(), km: new Map() };
  const maxLen: Record<Bahasa, number> = { id: 1, km: 1 };
  const same = new Set(konten.kataSama.map(norm));

  // Kosakata yang benar-benar dipakai di korpus: kata ini tidak "dikoreksi ejaannya"
  // (mencegah "sedang" → "senang" atau "kasih" → "masih").
  const kosakata: Record<Bahasa, Set<string>> = { id: new Set(), km: new Set() };
  const kataDari = (s: string) => String(s).toLowerCase().match(/[a-z]+(?:[-'][a-z]+)*/g) ?? [];
  kamus.entri.forEach((e) => e.contoh.forEach(([k, i]) => {
    kataDari(k).forEach((w) => kosakata.km.add(w));
    kataDari(i).forEach((w) => kosakata.id.add(w));
  }));

  function set(lang: Bahasa, key: string, val: NilaiKamus) {
    const k = norm(key);
    if (!k) return;
    dict[lang].set(k, val);
    maxLen[lang] = Math.max(maxLen[lang], k.split(' ').length);
  }

  /* ---------- Membangun kamus dua arah ---------- */
  const korpusKm = new Map<string, { id: string; skor: number }>(); // pasangan korpus terkuat per kata Komering
  kamus.selaras.forEach(([km, id, skor]) => {
    const lama = korpusKm.get(km);
    if (!lama || lama.skor < skor) korpusKm.set(km, { id, skor });
  });
  const bonusFrek = (w: string) => Math.log1p(kamus.frek.get(norm(w)) ?? 0) * 0.5;

  // 1) Komering → Indonesia: kata dasar didahulukan, lalu yang contohnya terbanyak
  const urut = [...kamus.entri].sort((a, b) => (a.induk ? 1 : 0) - (b.induk ? 1 : 0) || b.contoh.length - a.contoh.length);
  urut.forEach((e) => [e.kata, ...e.varian].forEach((w) => {
    const k = norm(w);
    if (dict.km.has(k)) return;
    const g = glosa(e.arti);
    let out = ringkas(g[0] || norm(e.arti));
    const kp = korpusKm.get(k);
    // Korpus memilih glosa yang paling sering dipakai (kuti: "mereka, kalian" → kalian)
    if (kp && kp.skor >= 0.75 && g.includes(kp.id)) out = kp.id;
    else if (kp && kp.skor >= 0.5 && out.split(' ').length > 2) out = kp.id;
    set('km', k, { out, ref: e });
  }));
  korpusKm.forEach((kp, km) => {
    if (!dict.km.has(km)) set('km', km, { out: kp.id, type: 'korpus' });
  });

  // 2) Indonesia → Komering: kandidat berperingkat (glosa tunggal > glosa pertama > glosa lain;
  //    kata dasar > turunan; makin sering muncul di korpus makin diutamakan)
  const kandidat = new Map<string, NilaiKamus & { skor: number }>();
  const usul = (key: string, skor: number, val: NilaiKamus) => {
    const k = norm(key);
    if (!k || k.split(' ').length > 3) return;
    const lama = kandidat.get(k);
    if (!lama || lama.skor < skor) kandidat.set(k, { ...val, skor });
  };
  kamus.entri.forEach((e) => {
    const g = glosa(e.arti);
    g.forEach((gl, i) => usul(gl, (g.length === 1 ? 3 : i === 0 ? 2 : 1) + (e.induk ? 0 : 0.5) + bonusFrek(e.kata), { out: e.kata, ref: e }));
  });
  kamus.selaras.forEach(([km, id, skor]) => usul(id, 2.5 + skor + bonusFrek(km), { out: km, type: 'korpus' }));
  kandidat.forEach(({ out, type, ref }, k) => set('id', k, { out, type, ref }));

  // 3) Padanan berbukti dari konten menimpa keduanya
  konten.padanan.forEach((p) => {
    const ids = p.id.split('|');
    const kms = p.km.split('|');
    ids.forEach((k) => set('id', k, { out: kms[0] }));
    kms.forEach((k) => set('km', k, { out: ids[0] }));
  });

  /* ---------- Pencarian kata ---------- */
  function idCandidates(w: string): string[] {
    const roots = [w];
    PREFIKS.forEach(([re, f]) => {
      const m = w.match(re);
      if (m) roots.push(...f(m[1]));
    });
    const out: string[] = [];
    roots.forEach((r) => {
      out.push(r);
      ['kan', 'an', 'i'].forEach((s) => {
        if (r.length > s.length + 2 && r.endsWith(s)) out.push(r.slice(0, -s.length));
      });
    });
    return out;
  }

  function derive(w: string): { out: string; base: string; ref?: Entri } | null {
    for (const c of idCandidates(w)) {
      const v = dict.id.get(c);
      if (v) return { out: v.out, base: c, ref: v.ref };
    }
    return null;
  }

  function fuzzy(w: string, lang: Bahasa): string | null {
    if (w.length < 5 || kosakata[lang].has(w)) return null;
    const max = w.length >= 8 ? 2 : 1;
    let best: string | null = null;
    let bestD = max + 1;
    for (const key of dict[lang].keys()) {
      if (key.includes(' ') || Math.abs(key.length - w.length) > max) continue;
      const d = levenshtein(w, key, max);
      if (d < bestD) {
        bestD = d;
        best = key;
      }
    }
    return best;
  }

  function lookupWord(w: string, lang: Bahasa): Hit | null {
    const d = dict[lang];
    const v = d.get(w);
    if (v) return { out: v.out, type: v.type ?? 'exact', ref: v.ref };
    if (same.has(w)) return { out: w, type: 'same' };

    for (const [suf, ganti] of SUFIKS[lang]) {
      if (w.length <= suf.length + 2 || !w.endsWith(suf)) continue;
      const base = w.slice(0, -suf.length);
      let hit: { out: string; base?: string; ref?: Entri } | null = null;
      const vb = d.get(base);
      if (vb) hit = vb;
      else if (same.has(base)) hit = { out: base };
      else if (lang === 'id') hit = derive(base);
      if (hit) return { out: hit.out + ganti, type: 'stem', base: hit.base || base, ref: hit.ref };
    }

    if (lang === 'id') {
      const hit = derive(w);
      if (hit) return { ...hit, type: 'stem' };
    }

    const fz = fuzzy(w, lang);
    if (fz) {
      const vf = d.get(fz);
      if (vf) return { out: vf.out, type: 'fuzzy', base: fz, ref: vf.ref };
    }
    return null;
  }

  function translateWord(raw: string, lang: Bahasa): Segmen {
    const w = norm(raw);
    const cap = isCap(raw);
    const hit = lookupWord(w, lang);
    if (hit) return { src: raw, ...hit, cap };

    // Reduplikasi: "anak-anak", "bersama-sama"
    const parts = w.split('-');
    if (parts.length === 2 && (parts[0] === parts[1] || parts[0].endsWith(parts[1]))) {
      const h = lookupWord(parts[0], lang) || lookupWord(parts[1], lang);
      if (h) return { src: raw, out: `${h.out}-${h.out}`, type: h.type === 'same' ? 'exact' : h.type, cap };
    }
    return { src: raw, out: raw, type: 'unknown', cap: false };
  }

  function translate(text: string, from: Bahasa): HasilTerjemahan {
    const toks = (text.match(TOKEN_RE) ?? []).map((t) => ({ t, word: /[\p{L}\p{N}]/u.test(t) }));
    const segs: Segmen[] = [];
    let i = 0;

    while (i < toks.length) {
      const tk = toks[i];
      if (!tk.word) {
        segs.push({ src: tk.t, out: tk.t, type: 'punct' });
        i++;
        continue;
      }

      // Pola "sangat X" → "X nihan"
      const berikut = toks[i + 1];
      if (from === 'id' && norm(tk.t) === 'sangat' && berikut?.word) {
        const nx = lookupWord(norm(berikut.t), 'id');
        if (nx) {
          segs.push({ src: `${tk.t} ${berikut.t}`, out: `${nx.out} nihan`, type: nx.type === 'same' ? 'exact' : nx.type, cap: isCap(tk.t) });
          i += 2;
          continue;
        }
      }

      // Frasa terpanjang (≥ 2 kata)
      let run = 0;
      while (toks[i + run]?.word) run++;
      let matched = false;
      for (let L = Math.min(maxLen[from], run); L >= 2; L--) {
        const src = toks.slice(i, i + L).map((x) => x.t).join(' ');
        const v = dict[from].get(norm(src));
        if (v) {
          segs.push({ src, out: v.out, type: v.type ?? 'exact', ref: v.ref, cap: isCap(tk.t) });
          i += L;
          matched = true;
          break;
        }
      }
      if (matched) continue;

      segs.push(translateWord(tk.t, from));
      i++;
    }

    let hasil = '';
    segs.forEach((s) => {
      let o = s.out;
      if (s.cap && o && o === o.toLowerCase()) o = o[0].toUpperCase() + o.slice(1);
      const noSpace = s.type === 'punct' && /^[.,!?;:%)\]}”’…]$/.test(o);
      const afterOpen = /[([{“‘]$/.test(hasil);
      hasil += (hasil && !noSpace && !afterOpen ? ' ' : '') + o;
    });

    const words = segs.filter((s): s is Segmen & { type: Exclude<JenisSegmen, 'punct'> } => s.type !== 'punct');
    const conf = words.length ? words.reduce((a, s) => a + BOBOT[s.type], 0) / words.length : null;
    return { text: hasil, segs, conf };
  }

  /* Tebak bahasa: jumlah kata yang dikenali langsung (frasa dihitung per kata).
     Contoh "api kabar": frasa Komering (2 kata) mengalahkan "api" Indonesia (1). */
  function detect(text: string): Bahasa {
    const score = (lang: Bahasa) => translate(text, lang).segs
      .reduce((a, s) => a + (s.type === 'exact' || s.type === 'korpus' ? s.src.split(/\s+/).length : 0), 0);
    return score('km') > score('id') ? 'km' : 'id';
  }

  return { translate, detect };
}
