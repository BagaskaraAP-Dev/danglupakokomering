/* =============================================================================
   CHATBOT RAKA & RATIH
   Deteksi niat terjemahan (regex) → penerjemah; selain itu klasifikasi niat
   berbasis skor kata kunci (frasa +3, kata +2, salah ketik +1).
   ============================================================================= */
import type { Kamus, KamusMeta } from './kamus';
import { DATA, type AksiChat, type NiatChat } from './konten';
import { LABEL_BAHASA, type Penerjemah } from './penerjemah';
import { fmtAngka, levenshtein, norm, pick } from './teks';

export type Pembicara = 'raka' | 'ratih';

export interface Balasan {
  oleh: Pembicara;
  teks: string;
  aksi: AksiChat[];
  /** Teks Basa Kumoring yang boleh dibacakan */
  ucap?: string;
}

const POLA_TERJEMAH = [
  /(.+?)\s+(?:dalam|dlm|pakai|ke)\s+(?:bahasa|basa)\s+(?:komering|kumoring)\b/i,
  /(?:bahasa|basa)\s+(?:komering|kumoring)(?:nya)?\s+(?:dari\s+|untuk\s+|kata\s+)?(.+)/i,
  /(?:terjemahkan|translate|artikan)\s+(.+)/i,
  /\barti(?:nya)?\s+(?:kata\s+|dari\s+)?(.+)/i,
];

/** Isi penanda {jumlahKata}, {jumlahContoh}, … dengan angka dari meta kamus */
export const isiAngka = (s: string, meta: KamusMeta): string =>
  s.replace(/\{(\w+)\}/g, (m, k: string) => (k in meta ? fmtAngka(meta[k as keyof KamusMeta] as number) : m));

const bersihkan = (s: string) => s.replace(/^[\s"'“”‘’:]+|[\s"'“”‘’?!.:]+$/g, '');

/** Entri kamus lengkap untuk satu kata Komering (maks. 3 arti) */
function entriKamus(kamus: Kamus, w: string): string | null {
  const hits = kamus.cari(w);
  if (!hits.length) return null;
  return hits.slice(0, 3).map((e) => {
    const kelas = e.kelas ? ` (${DATA.kelasKata[e.kelas]})` : '';
    const contoh = e.contoh[0] ? `\nContoh: “${e.contoh[0][0]}” — ${e.contoh[0][1]}` : '';
    return `📖 **${e.kata}**${kelas} — ${e.arti}${contoh}`;
  }).join('\n\n');
}

function cobaTerjemah(q: string, kamus: Kamus, tr: Penerjemah): Balasan | null {
  for (const re of POLA_TERJEMAH) {
    const m = q.match(re);
    if (!m) continue;
    const frasa = bersihkan(m[1]);
    if (!frasa || /^(itu|ini|apa|komering|kumoring|nama komering)$/i.test(frasa)) continue;
    const from = tr.detect(frasa);
    const to = from === 'id' ? 'km' : 'id';
    const res = tr.translate(frasa, from);
    const pct = Math.round((res.conf ?? 0) * 100);
    const asing = res.segs.filter((s) => s.type === 'unknown').map((s) => s.src);
    const aksi: AksiChat[] = [{ label: 'Buka Penerjemah', href: '#penerjemah' }];
    let teks = `“${frasa}” dalam ${LABEL_BAHASA[to]}:\n**${res.text}**\n(keyakinan ${pct}%)`;
    if (asing.length) teks += `\nKata yang belum ada di kamus: ${asing.join(', ')}.`;

    // Satu kata: tampilkan juga entri kamusnya
    if (!/\s/.test(frasa)) {
      const kataKm = from === 'km' ? frasa : res.text;
      const entri = entriKamus(kamus, kataKm);
      if (entri) {
        teks = from === 'km' ? entri : `“${frasa}” dalam Basa Kumoring: **${res.text}**\n\n${entri}`;
        aksi.unshift({ label: 'Buka di kamus', href: '#kamus', cari: kataKm });
      }
    }
    return { oleh: 'ratih', teks, aksi, ucap: to === 'km' ? res.text : undefined };
  }
  return null;
}

function cariNiat(q: string): NiatChat | null {
  const n = ` ${norm(q).replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim()} `;
  const words = n.trim().split(' ');
  let best: NiatChat | null = null;
  let bestS = 0;
  DATA.chatbot.intents.forEach((it) => {
    let s = 0;
    it.kata.forEach((k) => {
      if (k.includes(' ')) {
        if (n.includes(` ${k} `)) s += 3;
      } else if (words.includes(k)) {
        s += 2;
      } else if (k.length >= 5 && words.some((w) => Math.abs(w.length - k.length) <= 1 && levenshtein(w, k, 1) <= 1)) {
        s += 1;
      }
    });
    if (s > bestS) {
      bestS = s;
      best = it;
    }
  });
  return best;
}

/** Jawab pertanyaan; kamus & penerjemah boleh null selama kamus belum termuat */
export function jawab(q: string, kamus: Kamus | null, tr: Penerjemah | null, meta: KamusMeta): Balasan {
  if (kamus && tr) {
    const hasil = cobaTerjemah(q, kamus, tr);
    if (hasil) return hasil;
  }
  const it = cariNiat(q);
  if (it) return { oleh: it.oleh, teks: isiAngka(pick(it.jawab), meta), aksi: it.aksi ?? [] };
  // Satu kata Komering tanpa kata tanya: langsung tampilkan entri kamusnya
  const kata = bersihkan(q);
  if (kamus && tr && !/\s/.test(kata) && tr.detect(kata) === 'km') {
    const entri = entriKamus(kamus, kata);
    if (entri) return { oleh: 'ratih', teks: entri, aksi: [{ label: 'Buka di kamus', href: '#kamus', cari: kata }] };
  }
  return { oleh: 'ratih', teks: isiAngka(pick(DATA.chatbot.fallback), meta), aksi: [] };
}
