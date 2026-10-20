/* Basis pengetahuan sisi server untuk Gemini (RAG): indeks Kamus Basa Kumoring dan
   potongan isi bab situs. Dibangun sekali per instance fungsi, lalu dipakai ulang. */
import kamusMentah from '@/public/data/kamus.json';
import { isiAngka } from '@/lib/chatbot';
import { bangunKamus, type Entri, type Kamus, type KamusMentah } from '@/lib/kamus';
import { DATA } from '@/lib/konten';
import { buatPenerjemah, type Penerjemah } from '@/lib/penerjemah';
import { urlHidangan, urlLagu } from '@/lib/tautan';
import { glosa, norm } from '@/lib/teks';

export interface Potongan {
  id: string;
  label: string;
  href: string;
  judul: string;
  isi: string;
  kataJudul: Set<string>;
  kataIsi: Set<string>;
}

interface Basis {
  kamus: Kamus;
  penerjemah: Penerjemah;
  /** glosa Indonesia → entri yang artinya persis glosa itu */
  perGlosa: Map<string, Entri[]>;
  potongan: Potongan[];
  /** Semua kata Komering di kamus, contoh kalimat, & padanan korpus */
  kosakata: Set<string>;
}

let basis: Basis | null = null;

export const kataDari = (s: string): string[] => norm(s).match(/[\p{L}\p{N}]+/gu) ?? [];

function potong(id: string, label: string, href: string, judul: string, isi: string): Potongan {
  return { id, label, href, judul, isi, kataJudul: new Set(kataDari(judul)), kataIsi: new Set(kataDari(`${judul} ${isi}`)) };
}

function bangunPotongan(kamus: Kamus): Potongan[] {
  const p: Potongan[] = [];
  const L = DATA.lagu;
  DATA.sejarah.forEach((s, i) => p.push(potong(`sejarah-${i}`, `Sejarah: ${s.judul}`, '#sejarah', `${s.era} — ${s.judul}`, s.isi)));
  DATA.wilayah.forEach((w) => p.push(potong(`peta-${w.key}`, `Peta: ${w.nama}`, '#peta', `${w.nama} (${w.kab})`, w.isi)));
  p.push(potong('marga', 'Bab Marga', '#marga', 'Marga dan kebuayan Komering', DATA.marga.map((m) => `${m.nama} (${m.kab}): ${m.isi}`).join(' ')));
  p.push(potong('busana', 'Busana adat', '#busana', 'Busana pengantin adat Komering', DATA.busana.map((b) => `${b.nama}: ${b.isi}`).join(' ')));
  p.push(potong('adat', 'Tahapan adat pernikahan', '#busana', 'Tahapan adat pernikahan Komering',
    DATA.adatPernikahan.map((a, i) => `${i + 1}. ${a.km} (${a.judul}): ${a.isi}`).join(' ')));
  DATA.kuliner.forEach((h) => p.push(potong(`kuliner-${urlHidangan(h.nama).split('/').pop()}`, `Kuliner: ${h.nama}`, urlHidangan(h.nama),
    `${h.nama} — ${h.alias} (${h.jenis})`, [h.teaser, ...h.cerita, `Bahan: ${h.bahan.join('; ')}.`, `Cara menikmati: ${h.sajian}`, `Fakta: ${h.fakta}`].join(' '))));
  p.push(potong('penganan', 'Penganan lain', '#kuliner', 'Penganan lain di kamus', DATA.penganan.map(([k, a]) => `${k} (${a})`).join(', ')));
  p.push(potong('lagu', `Lagu: ${L.judul}`, urlLagu(L.judul), `Lagu daerah "${L.judul}"`,
    [`${L.asal}. Pencipta: ${L.kredit.pencipta}. Rekaman: ${L.kredit.rekaman}.`, L.keterangan,
      ...L.bagian.map((b) => `${b.label}: ${b.baris.map((x) => `"${x.km}" (${x.id})`).join(' / ')}`)].join(' ')));

  // Jawaban terkurasi chatbot lama = ringkasan fakta per topik
  const lewati = new Set(['salam', 'kabar', 'terimakasih', 'kuis', 'ai']);
  DATA.chatbot.intents.filter((it) => !lewati.has(it.id)).forEach((it) => {
    const teks = Array.isArray(it.jawab) ? it.jawab[0] : it.jawab;
    p.push(potong(`info-${it.id}`, it.aksi?.[0]?.label ?? 'Info budaya', it.aksi?.[0]?.href ?? '#beranda', `Ringkasan topik ${it.id}: ${it.kata.slice(0, 6).join(', ')}`,
      isiAngka(teks, kamus.meta).replace(/\*\*/g, '')));
  });
  p.push(potong('situs', 'Tentang situs', '#beranda', `${DATA.meta.nama} (${DATA.meta.arti})`,
    `Portal budaya Suku Komering untuk ${DATA.meta.acara}, tema "${DATA.meta.tema}". Fitur: penerjemah Indonesia–Basa Kumoring, Kamus Basa Kumoring ${isiAngka('{jumlahKata} kata dengan {jumlahContoh} contoh kalimat', kamus.meta)}, linimasa sejarah, peta wilayah, data marga, busana dan adat pernikahan, kuliner, lagu daerah berlirik, generator jajuluk (gelar adat), dan kuis. Pemandunya maskot Raka (sejarah) dan Ratih (bahasa).`));
  return p;
}

export function ambilBasis(): Basis {
  if (basis) return basis;
  const kamus = bangunKamus(kamusMentah as unknown as KamusMentah);
  const perGlosa = new Map<string, Entri[]>();
  kamus.entri.forEach((e) => {
    if (e.sensitif) return;
    glosa(e.arti).forEach((g) => perGlosa.set(g, [...(perGlosa.get(g) ?? []), e]));
  });
  const kosakata = new Set<string>([
    ...kamus.entri.flatMap((e) => [e.kata, ...e.varian, ...e.contoh.map(([km]) => km)].flatMap(kataDari)),
    ...kamus.selaras.flatMap(([km]) => kataDari(km)),
    ...DATA.padanan.flatMap((p) => kataDari(p.km)),
  ]);
  basis = { kamus, penerjemah: buatPenerjemah(kamus, DATA), perGlosa, potongan: bangunPotongan(kamus), kosakata };
  return basis;
}

/* Kata tanya & kata umum yang tidak membantu memilih bab */
const KATA_UMUM = new Set(
  ('apa apakah yang dan di ke dari itu ini untuk dengan adalah saya aku kamu bagaimana gimana kenapa mengapa siapa kapan berapa mana dimana ' +
    'ada tidak bisa tentang dong ya sih nya jelaskan ceritakan sebutkan tolong mohon bahasa basa komering kumoring suku orang juga atau pada ' +
    'dalam oleh sebagai akan sudah belum kah lah arti artinya kata coba biasanya apa saja seperti banyak lebih sangat boleh minta tahu').split(' '),
);

/** Kata bermakna dari pertanyaan (untuk memilih bab) */
export const kataKunci = (q: string): string[] => [...new Set(kataDari(q).filter((w) => w.length >= 3 && !KATA_UMUM.has(w)))];

function cocok(k: string, kata: Set<string>, isi: string): boolean {
  if (kata.has(k)) return true;
  // Imbuhan Indonesia: "pernikahan" ↔ "nikah", "disajikan" ↔ "sajikan"
  return k.length >= 5 && isi.includes(k.slice(0, Math.max(5, k.length - 3)));
}

/** Pilih maks. n potongan bab yang paling relevan */
export function pilihPotongan(q: string, n = 4): Potongan[] {
  const { potongan } = ambilBasis();
  const kunci = kataKunci(q);
  const berskor = potongan
    .map((p) => {
      const isi = norm(`${p.judul} ${p.isi}`);
      const s = kunci.reduce((t, k) => t + (p.kataJudul.has(k) ? 3 : 0) + (cocok(k, p.kataIsi, isi) ? 1 : 0), 0);
      return { p, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.p);
  return berskor.length ? berskor : potongan.filter((p) => p.id === 'info-tentang' || p.id === 'situs');
}

/** Entri kamus yang relevan dengan teks: kata Komering yang disebut + padanan kata Indonesianya */
export function pilihEntri(teks: string, maks = 12): Entri[] {
  const { kamus, penerjemah, perGlosa } = ambilBasis();
  const skor = new Map<Entri, number>();
  const tambah = (e: Entri, s: number) => {
    if (!e.sensitif) skor.set(e, Math.max(skor.get(e) ?? 0, s));
  };
  const kata = kataDari(teks);
  kata.forEach((w) => {
    kamus.cari(w).forEach((e) => tambah(e, KATA_UMUM.has(w) ? 1 : 4));
    perGlosa.get(w)?.slice(0, 3).forEach((e) => tambah(e, KATA_UMUM.has(w) ? 1 : 3));
  });
  // Mesin lokal mengenali imbuhan & frasa → entri pendukung
  penerjemah.translate(teks, 'id').segs.forEach((s) => s.ref && tambah(s.ref, 2));
  return [...skor.entries()]
    .sort((a, b) => b[1] - a[1] || (kamus.frek.get(norm(b[0].kata)) ?? 0) - (kamus.frek.get(norm(a[0].kata)) ?? 0))
    .slice(0, maks)
    .map(([e]) => e);
}

export const statusEntri = (e: Entri): string => (e.catatan ? 'arti dugaan' : 'tercatat di kamus');

export function tulisEntri(e: Entri, contoh = 2): string {
  const kelas = DATA.kelasKata[e.kelas] ? ` (${DATA.kelasKata[e.kelas]})` : '';
  const dasar = e.induk ? `; turunan dari "${e.induk}"` : '';
  const cth = e.contoh.slice(0, contoh).map(([k, i]) => ` Contoh: "${k}" = "${i}".`).join('');
  return `[${e.id}] ${e.kata}${kelas} — ${e.arti}${dasar}. Status: ${statusEntri(e)}.${cth}`;
}
