/* Kuis Ulun Kumoring: soal budaya dari konten + soal kosakata acak dari kamus */
import type { Kamus } from './kamus';
import { DATA } from './konten';
import { glosa, kapital, norm, shuffle } from './teks';

export const JUMLAH_SOAL = 10;

export interface Opsi {
  t: string;
  benar: boolean;
}
export interface Soal {
  q: string;
  opsi: Opsi[];
  info: string;
  jenis: 'Budaya' | 'Kosakata kamus';
}

interface SoalMentah {
  q: string;
  opsi: string[];
  benar: number;
  info: string;
  jenis: Soal['jenis'];
}

/** Soal kosakata dari kamus: separuh "apa arti X?", separuh "apa Basa Kumoring dari Y?" */
function soalKosakata(kamus: Kamus, n: number): SoalMentah[] {
  const pool = kamus.layakAcak
    .filter((e) => ['n', 'v', 'a'].includes(e.kelas) && /^[a-z-]+$/.test(e.kata))
    .map((e) => ({ e, g: glosa(e.arti)[0] }))
    .filter(({ e, g }) => g && g.split(' ').length <= 2 && g !== norm(e.kata));
  if (pool.length < 8) return [];
  return shuffle(pool).slice(0, n).map(({ e, g }, i) => {
    const balik = i % 2 === 1;
    const benar = balik ? e.kata : g;
    const salah: string[] = [];
    for (const p of shuffle(pool)) {
      const v = balik ? p.e.kata : p.g;
      if (p.g !== g && p.e.kelas === e.kelas && v !== benar && !salah.includes(v)) salah.push(v);
      if (salah.length === 3) break;
    }
    const [k, terj] = e.contoh[0];
    return {
      q: balik ? `Apa Basa Kumoring dari kata “${g}”?` : `Apa arti kata “${e.kata}” dalam Basa Kumoring?`,
      opsi: [benar, ...salah].map(kapital),
      benar: 0,
      info: `Kamus (${e.id}): ${e.kata} = ${e.arti}. Contoh: “${k}” — ${terj}.`,
      jenis: 'Kosakata kamus',
    };
  });
}

/** Satu putaran kuis: 6 soal budaya + 4 soal kosakata (bila kamus sudah termuat) */
export function buatPutaran(kamus: Kamus | null): Soal[] {
  const kosakata = kamus ? soalKosakata(kamus, 4) : [];
  const budaya: SoalMentah[] = shuffle(DATA.kuis).slice(0, JUMLAH_SOAL - kosakata.length).map((q) => ({ ...q, jenis: 'Budaya' }));
  return shuffle([...budaya, ...kosakata]).map((q) => ({
    q: q.q,
    info: q.info,
    jenis: q.jenis,
    opsi: shuffle(q.opsi.map((t, i) => ({ t, benar: i === q.benar }))),
  }));
}

export function peringkat(skor: number) {
  if (skor === JUMLAH_SOAL) return { gelar: 'Ulun Kumoring Sejati', pesan: 'Sempurna! Niku benar-benar menjaga budaya Komering.' };
  if (skor >= 8) return { gelar: 'Morli Maranai Pandai', pesan: 'Hebat! Pengetahuanmu tentang Komering sangat baik.' };
  if (skor >= 5) return { gelar: 'Sanak Rajin Belajar', pesan: 'Holau! Sedikit lagi menuju gelar tertinggi.' };
  return { gelar: 'Ayo Belajar Lagi', pesan: 'Dang lupa — jelajahi bab-bab di atas lalu coba lagi!' };
}
